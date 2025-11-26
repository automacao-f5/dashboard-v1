# Integração Direta com API Meta para Produção

## 🎯 Objetivo

Este documento explica como configurar a integração direta com a Meta Marketing API em um ambiente de produção, sem depender de servidores MCP locais.

## 📋 Pré-requisitos

1. **Meta Business Account** configurada
2. **Meta App** criada no Meta for Developers
3. **Access Token** com permissões adequadas
4. **Ad Account ID** da conta de anúncios

## 🔧 Configuração

### 1. Obter Credenciais da Meta

#### Passo 1: Criar App no Meta for Developers

1. Acesse https://developers.facebook.com/
2. Vá em "Meus Apps" > "Criar App"
3. Escolha "Empresa" como tipo de app
4. Preencha os detalhes do app

#### Passo 2: Configurar Permissões

Adicione as seguintes permissões ao seu app:

- `ads_read` - Ler dados de anúncios
- `ads_management` - Gerenciar campanhas (se necessário)
- `business_management` - Gerenciar conta comercial

#### Passo 3: Gerar Access Token

1. Vá em "Ferramentas" > "Graph API Explorer"
2. Selecione seu app
3. Adicione as permissões necessárias
4. Gere o token de acesso
5. **IMPORTANTE**: Para produção, use um **System User Token** que não expira

#### Passo 4: Obter Ad Account ID

1. Acesse https://business.facebook.com/
2. Vá em "Configurações da Empresa" > "Contas de Anúncios"
3. Copie o ID da conta (formato: `act_XXXXXXXXXX`)

### 2. Configurar Variáveis de Ambiente

Crie/atualize o arquivo `.env.local`:

```env
# Meta Marketing API
META_ACCESS_TOKEN=seu_token_aqui
META_AD_ACCOUNT_ID=act_XXXXXXXXXX
META_API_VERSION=v21.0

# URL da API (não precisa mudar)
NEXT_PUBLIC_META_API_URL=https://graph.facebook.com
```

### 3. Criar Cliente HTTP para API Meta

Crie o arquivo `src/lib/meta-api-client.ts`:

```typescript
import axios, { AxiosInstance } from "axios";

class MetaAPIClient {
  private client: AxiosInstance;

  constructor() {
    const accessToken = process.env.META_ACCESS_TOKEN;
    const apiVersion = process.env.META_API_VERSION || "v21.0";

    if (!accessToken) {
      throw new Error("META_ACCESS_TOKEN não configurado");
    }

    this.client = axios.create({
      baseURL: `https://graph.facebook.com/${apiVersion}`,
      params: {
        access_token: accessToken,
      },
    });
  }

  // Buscar campanhas
  async getCampaigns(limit: number = 25, status?: string) {
    const adAccountId = process.env.META_AD_ACCOUNT_ID;

    const params: any = {
      fields: "id,name,status,objective,daily_budget,lifetime_budget,start_time,stop_time",
      limit,
    };

    if (status) {
      params.filtering = JSON.stringify([{ field: "status", operator: "IN", value: [status] }]);
    }

    const response = await this.client.get(`/${adAccountId}/campaigns`, { params });
    return response.data;
  }

  // Buscar insights de campanha
  async getCampaignInsights(campaignId: string, datePreset: string = "last_7d") {
    const response = await this.client.get(`/${campaignId}/insights`, {
      params: {
        fields: "impressions,clicks,spend,reach,cpc,cpm,ctr",
        date_preset: datePreset,
      },
    });

    return response.data.data?.[0] || {};
  }

  // Buscar insights com breakdown diário
  async getCampaignInsightsBreakdown(campaignId: string, datePreset: string = "last_7d") {
    const response = await this.client.get(`/${campaignId}/insights`, {
      params: {
        fields: "impressions,clicks,spend,reach,cpc,cpm,ctr,date_start,date_stop",
        date_preset: datePreset,
        time_increment: 1, // Breakdown diário
      },
    });

    return response.data.data || [];
  }
}

export const metaAPIClient = new MetaAPIClient();
```

### 4. Atualizar Server Actions

Atualize `src/app/(main)/dashboard/meta/_actions/meta-actions.ts`:

```typescript
"use server";

import { metaAPIClient } from "@/lib/meta-api-client";

export async function getMetaCampaigns(limit: number = 25, status?: string) {
  try {
    const data = await metaAPIClient.getCampaigns(limit, status);

    return {
      ad_account_id: process.env.META_AD_ACCOUNT_ID,
      total_campaigns: data.data?.length || 0,
      campaigns: data.data || [],
    };
  } catch (error) {
    console.error("Error fetching Meta campaigns:", error);
    throw error;
  }
}

export async function getCampaignInsights(campaignId: string, datePreset: string = "last_30d") {
  try {
    const insights = await metaAPIClient.getCampaignInsights(campaignId, datePreset);

    return {
      campaign_id: campaignId,
      date_preset: datePreset,
      insights: insights,
    };
  } catch (error) {
    console.error("Error fetching campaign insights:", error);
    return null;
  }
}

// ... resto do código
```

## 🚀 Deploy em Produção

### Vercel

1. **Adicionar Variáveis de Ambiente**:
   - Vá em Settings > Environment Variables
   - Adicione `META_ACCESS_TOKEN`
   - Adicione `META_AD_ACCOUNT_ID`
   - Adicione `META_API_VERSION`

2. **Deploy**:
   ```bash
   vercel --prod
   ```

### AWS / Outras Plataformas

Configure as variáveis de ambiente no painel de controle da plataforma ou via CLI.

## 🔒 Segurança

### Boas Práticas

1. **Nunca exponha o Access Token no cliente**
   - Todas as chamadas devem ser feitas via Server Actions ou API Routes
   - O token deve estar apenas em variáveis de ambiente do servidor

2. **Use System User Token**
   - Tokens de usuário expiram
   - System User Tokens são mais seguros para produção

3. **Implemente Rate Limiting**
   - A API Meta tem limites de requisições
   - Implemente cache quando possível

4. **Monitore Erros**
   - Configure logging adequado
   - Use ferramentas como Sentry para monitorar erros

### Exemplo de Rate Limiting

```typescript
import { LRUCache } from "lru-cache";

const cache = new LRUCache({
  max: 500,
  ttl: 1000 * 60 * 5, // 5 minutos
});

export async function getCachedCampaigns(limit: number = 25) {
  const cacheKey = `campaigns_${limit}`;

  const cached = cache.get(cacheKey);
  if (cached) {
    return cached;
  }

  const data = await metaAPIClient.getCampaigns(limit);
  cache.set(cacheKey, data);

  return data;
}
```

## 📊 Métricas Disponíveis

### Métricas Básicas (já implementadas)

- `impressions` - Impressões
- `clicks` - Cliques
- `spend` - Gasto
- `reach` - Alcance
- `cpc` - Custo por Clique
- `cpm` - Custo por Mil Impressões
- `ctr` - Taxa de Cliques

### Métricas Avançadas (disponíveis na API)

- `actions` - Ações realizadas
- `conversions` - Conversões
- `cost_per_action_type` - Custo por tipo de ação
- `purchase_roas` - ROAS de compras
- `video_views` - Visualizações de vídeo
- `post_engagement` - Engajamento com posts

Para adicionar mais métricas, basta incluí-las no parâmetro `fields` das requisições.

## 🐛 Troubleshooting

### Erro: "Invalid OAuth access token"

- Verifique se o token está correto
- Confirme se o token tem as permissões necessárias
- Verifique se o token não expirou

### Erro: "Unsupported get request"

- Verifique se o Ad Account ID está correto
- Confirme se o formato é `act_XXXXXXXXXX`

### Erro: "Rate limit exceeded"

- Implemente cache
- Reduza a frequência de requisições
- Use batch requests quando possível

## 📚 Recursos Adicionais

- [Meta Marketing API Documentation](https://developers.facebook.com/docs/marketing-apis)
- [Graph API Explorer](https://developers.facebook.com/tools/explorer/)
- [Meta Business Help Center](https://www.facebook.com/business/help)

## ✅ Checklist de Deploy

- [ ] Access Token configurado
- [ ] Ad Account ID configurado
- [ ] Variáveis de ambiente no servidor de produção
- [ ] Testes de integração realizados
- [ ] Rate limiting implementado
- [ ] Logging configurado
- [ ] Monitoramento de erros ativo
- [ ] Documentação atualizada

---

**Nota**: Este documento assume que você já removeu a dependência do MCP server local e está usando chamadas diretas à API Meta via HTTP.
