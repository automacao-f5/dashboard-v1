# Integração Meta Marketing API

Este documento explica como a integração com a Meta Marketing API foi implementada no dashboard.

## Arquitetura

A integração foi implementada usando a seguinte arquitetura:

```
Dashboard (Next.js)
    ↓
Server Actions (meta-actions.ts)
    ↓
MCP Client (mcp-client.ts)
    ↓
MCP Server (meta-marketing-server)
    ↓
Meta Marketing API
```

## Componentes Criados

### 1. Servidor MCP (`meta-marketing-server`)

Localização: `C:\Users\Pichau\Documents\Cline\MCP\meta-marketing-server`

O servidor MCP fornece três ferramentas principais:

- **get_campaigns**: Busca campanhas da conta de anúncios
- **get_campaign_insights**: Busca métricas de desempenho de uma campanha específica
- **get_products**: Busca produtos do catálogo (requer catalog_id)

### 2. Página do Dashboard (`/dashboard/meta`)

Componentes:

- `MetaOverviewCards`: Exibe métricas agregadas (gasto total, impressões, cliques, CTR)
- `MetaCampaignsTable`: Lista todas as campanhas com seus detalhes

### 3. Server Actions

Localização: `src/app/(main)/dashboard/meta/_actions/meta-actions.ts`

Funções disponíveis:

- `getMetaCampaigns(limit, status)`: Busca campanhas
- `getCampaignInsights(campaignId, datePreset)`: Busca insights de uma campanha
- `getAggregatedInsights()`: Calcula métricas agregadas de todas as campanhas ativas

## Como Funciona Atualmente

### Dados Mockados vs Dados Reais

**Status Atual**: Os dados exibidos no dashboard são baseados nos dados reais da sua conta Meta, mas estão sendo retornados através de uma simulação no `mcp-client.ts`.

**Por quê?**: O servidor MCP roda via stdio (entrada/saída padrão) e não pode ser chamado diretamente via HTTP do Next.js. Para uma integração completa em produção, você precisaria de uma das seguintes abordagens:

### Opções para Integração Real

#### Opção 1: Usar Cline/Claude para Fazer as Chamadas

A forma mais simples é usar o Cline (este assistente) para fazer chamadas ao servidor MCP quando necessário:

```typescript
// Você pode pedir ao Cline para executar:
use_mcp_tool("meta-marketing", "get_campaigns", { limit: 25 });
```

#### Opção 2: Criar um Servidor Proxy HTTP

Criar um servidor Node.js separado que:

1. Mantém conexão com o servidor MCP via stdio
2. Expõe endpoints HTTP que o Next.js pode chamar
3. Traduz as requisições HTTP para chamadas MCP

Exemplo de estrutura:

```javascript
// proxy-server.js
import express from "express";
import { spawn } from "child_process";

const app = express();
const mcpProcess = spawn("node", ["path/to/meta-marketing-server/build/index.js"]);

app.post("/api/mcp/:tool", async (req, res) => {
  // Envia comando para o processo MCP
  // Aguarda resposta
  // Retorna para o cliente
});

app.listen(3002);
```

#### Opção 3: Chamar a API do Meta Diretamente

Modificar o `mcp-client.ts` para fazer chamadas diretas à API do Meta:

```typescript
import axios from "axios";

const META_API = axios.create({
  baseURL: "https://graph.facebook.com/v21.0",
  params: {
    access_token: process.env.META_ACCESS_TOKEN,
  },
});

export async function callMCPTool(serverName, toolName, args) {
  if (toolName === "get_campaigns") {
    const response = await META_API.get(`/${process.env.META_AD_ACCOUNT_ID}/campaigns`, {
      params: {
        fields: "id,name,status,objective,daily_budget,start_time",
        limit: args.limit,
      },
    });
    return response.data;
  }
}
```

## Dados Disponíveis

### Campanhas

Sua conta possui as seguintes campanhas:

1. **004_Conversão_AddToCart_04-11-25** (ATIVA)
   - Objetivo: Vendas
   - Orçamento: R$ 15,00/dia

2. **007_Purchase_Catálogo_29-10-25** (PAUSADA)
   - Objetivo: Vendas
   - Orçamento: R$ 25,00/dia

3. **005_Tráfego Site_28-10-2025** (PAUSADA)
   - Objetivo: Tráfego
   - Orçamento: R$ 10,00/dia

4. **008_Conversão_InitiateCheckout_04-11-25** (ATIVA)
   - Objetivo: Vendas
   - Orçamento: R$ 15,00/dia

5. **003_Conversão_Purchase_27-10-25** (PAUSADA)
   - Objetivo: Vendas
   - Orçamento: R$ 25,00/dia

## Testando a Integração

### Via Cline/Claude

Você pode pedir ao Cline para buscar dados reais:

```
"Busque as campanhas ativas da minha conta Meta"
```

O Cline usará o servidor MCP para buscar os dados reais e exibi-los.

### Via Dashboard

Acesse: `http://localhost:3001/dashboard/meta`

Os dados exibidos são baseados nos dados reais, mas retornados via simulação no código.

## Próximos Passos

Para ter dados 100% em tempo real no dashboard:

1. **Implementar Opção 2 ou 3** acima
2. **Adicionar Refresh Automático**: Implementar polling ou Server-Sent Events para atualizar dados periodicamente
3. **Adicionar Filtros**: Permitir filtrar campanhas por status, data, etc.
4. **Adicionar Gráficos**: Visualizar tendências de desempenho ao longo do tempo
5. **Adicionar Ações**: Permitir pausar/ativar campanhas diretamente do dashboard

## Credenciais

As credenciais estão configuradas no arquivo MCP settings:

- **Access Token**: Configurado
- **Ad Account ID**: act_748894959735898

**IMPORTANTE**: Nunca commite credenciais no código. Use variáveis de ambiente.

## Suporte

Para dúvidas sobre a integração, consulte:

- [Meta Marketing API Docs](https://developers.facebook.com/docs/marketing-apis)
- [MCP Documentation](https://modelcontextprotocol.io)
