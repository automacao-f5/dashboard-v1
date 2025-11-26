# Integração Google Analytics 4 (GA4)

## Visão Geral

Esta documentação descreve a integração do Google Analytics 4 (GA4) com o dashboard, permitindo a visualização e análise do funil de vendas de infoprodutos.

## Configuração

### 1. Credenciais do Google Cloud

O arquivo de credenciais `gen-lang-client-0900169805-c2d565b2468a.json` contém as credenciais da service account para acesso à API do GA4.

### 2. Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto `next-shadcn-admin-dashboard-main` com as seguintes variáveis:

```env
# ID da propriedade do GA4 (obrigatório)
GA4_PROPERTY_ID=2971518162

# Opção 1: Credenciais individuais (recomendado para produção)
GA4_CLIENT_EMAIL=ga4-api-access@gen-lang-client-0900169805.iam.gserviceaccount.com
GA4_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nSUA_CHAVE_PRIVADA_AQUI\n-----END PRIVATE KEY-----\n"

# Opção 2: JSON completo das credenciais (alternativa)
# GA4_CREDENTIALS_JSON='{"type":"service_account","project_id":"...","private_key":"...","client_email":"..."}'
```

### 3. Permissões no Google Analytics

Certifique-se de que a service account tem acesso de leitura à propriedade do GA4:

1. Acesse o Google Analytics 4
2. Vá para Admin → Gerenciamento de Conta → Gerenciamento de Acesso
3. Adicione o email da service account: `ga4-api-access@gen-lang-client-0900169805.iam.gserviceaccount.com`
4. Conceda a permissão de **Leitor**

## Arquitetura

### API Routes

| Endpoint                   | Descrição                   |
| -------------------------- | --------------------------- |
| `/api/analytics`           | Métricas resumidas (KPIs)   |
| `/api/analytics/pageviews` | Visualizações de páginas    |
| `/api/analytics/events`    | Eventos personalizados      |
| `/api/analytics/sources`   | Fontes de tráfego           |
| `/api/analytics/funnel`    | Dados do funil de conversão |
| `/api/analytics/campaigns` | Dados de campanhas (UTM)    |
| `/api/analytics/trend`     | Dados de tendência por dia  |

### Parâmetros de Query

Todos os endpoints aceitam os seguintes parâmetros:

| Parâmetro   | Tipo   | Default     | Descrição                  |
| ----------- | ------ | ----------- | -------------------------- |
| `startDate` | string | `30daysAgo` | Data inicial (formato GA4) |
| `endDate`   | string | `today`     | Data final (formato GA4)   |
| `limit`     | number | 20          | Limite de resultados       |

**Formatos de data aceitos:**

- Relativos: `today`, `yesterday`, `7daysAgo`, `30daysAgo`, `90daysAgo`
- Absolutos: `YYYY-MM-DD` (ex: `2024-01-15`)

### Exemplo de Uso

```typescript
// Buscar métricas dos últimos 7 dias
const response = await fetch("/api/analytics?startDate=7daysAgo&endDate=today");
const data = await response.json();

// Buscar fontes de tráfego
const sources = await fetch("/api/analytics/sources?startDate=30daysAgo&limit=10");
```

## Componentes

### Página do Funil (`/dashboard/funnel`)

A página do funil oferece uma visão completa do desempenho:

1. **Overview Cards** - KPIs principais (sessões, usuários, visualizações, engajamento)
2. **Trend Chart** - Gráfico de tendência com sessões, usuários e visualizações
3. **Sales Funnel** - Funil de conversão visual
4. **Traffic Sources** - Gráfico de pizza com fontes de tráfego
5. **Campaigns Table** - Tabela com performance de campanhas UTM

### Etapas do Funil

O funil padrão inclui as seguintes etapas (configuráveis):

```typescript
const DEFAULT_FUNNEL_STEPS = [
  "page_view", // Visualização da página
  "vsl_play", // Play no VSL
  "vsl_25_percent", // 25% do VSL assistido
  "vsl_50_percent", // 50% do VSL assistido
  "vsl_75_percent", // 75% do VSL assistido
  "vsl_complete", // VSL completo
  "click_checkout", // Clique no botão de checkout
  "begin_checkout", // Início do checkout
  "purchase", // Compra realizada
];
```

Para personalizar as etapas, envie o parâmetro `steps`:

```
/api/analytics/funnel?steps=page_view,vsl_play,purchase
```

## Eventos Recomendados para VSL (VTurb)

Configure os seguintes eventos no VTurb/GA4 para rastreamento completo:

| Evento           | Descrição                    |
| ---------------- | ---------------------------- |
| `vsl_play`       | Usuário iniciou o vídeo      |
| `vsl_25_percent` | Assistiu 25%                 |
| `vsl_50_percent` | Assistiu 50%                 |
| `vsl_75_percent` | Assistiu 75%                 |
| `vsl_complete`   | Assistiu 100%                |
| `click_checkout` | Clicou no botão de compra    |
| `begin_checkout` | Iniciou processo de checkout |
| `purchase`       | Compra concluída             |

## Client Library

O cliente GA4 (`src/lib/ga4-api-client.ts`) oferece os seguintes métodos:

```typescript
import { getGA4APIClient } from "@/lib/ga4-api-client";

const client = getGA4APIClient();

// Métricas resumidas
await client.getSummaryMetrics(startDate, endDate);

// Visualizações de páginas
await client.getPageViews(startDate, endDate, limit);

// Eventos
await client.getEvents(startDate, endDate, eventNames);

// Fontes de tráfego
await client.getTrafficSources(startDate, endDate, limit);

// Dados por data (tendência)
await client.getDataByDateRange(startDate, endDate);

// Dados de campanha
await client.getCampaignData(startDate, endDate, limit);

// Funil personalizado
await client.getFunnelData(funnelSteps, startDate, endDate);

// Dados de página específica
await client.getPageSpecificData(pagePath, startDate, endDate);

// Dados de dispositivo
await client.getDeviceData(startDate, endDate);

// Dados geográficos
await client.getGeographicData(startDate, endDate, limit);

// Comparar períodos
await client.comparePeriods(currentStart, currentEnd, previousStart, previousEnd);
```

## Segurança

- As credenciais são armazenadas apenas no servidor (variáveis de ambiente)
- As API routes rodam server-side, nunca expondo credenciais ao cliente
- O arquivo JSON de credenciais não deve ser commitado no repositório

## Troubleshooting

### Erro: "GA4_PROPERTY_ID não configurado"

Verifique se a variável de ambiente está definida no `.env.local`.

### Erro: "Credenciais GA4 não configuradas"

Configure `GA4_CLIENT_EMAIL` e `GA4_PRIVATE_KEY` ou `GA4_CREDENTIALS_JSON`.

### Erro: "Permission denied"

Verifique se a service account tem acesso de leitura à propriedade do GA4.

### Dados vazios

1. Verifique se há dados no GA4 para o período selecionado
2. Confirme que os eventos estão sendo enviados corretamente
3. Verifique os logs do servidor para erros específicos

## Próximos Passos

- [ ] Integrar com dados da Meta Ads para correlação
- [ ] Adicionar dados do Hotmart (conversões reais)
- [ ] Implementar alertas de queda de conversão
- [ ] Dashboard de comparação de períodos
- [ ] Exportação de relatórios PDF/CSV
