# 🎥 Configuração da API do Vturb

## Status Atual

✅ **Dashboard funcionando** com dados de exemplo
⚠️ **Endpoints da API precisam ser configurados** conforme documentação oficial

## Credenciais Configuradas

- **API Key**: `9cb439e7737a950a43d2a169c52dffb73680f35ff430c8127362f23f5e75560d`
- **Localização**: `.env.local` → `VTURB_API_KEY`

## Como Obter os Endpoints Corretos

### 1. Acesse a Documentação Oficial

🔗 https://vturb.gitbook.io/analytics-api/pt

### 2. Procure pelos Endpoints

Você precisa encontrar os endpoints para:

- ✅ Estatísticas gerais (overall stats)
- ✅ Lista de vídeos
- ✅ Estatísticas por vídeo
- ✅ Dados de retenção
- ✅ Métricas de engajamento

### 3. Exemplo de Como Configurar

Quando você encontrar os endpoints corretos, atualize o arquivo:
`src/lib/vturb-api-client.ts`

**Exemplo de atualização:**

```typescript
// ANTES (atualmente)
baseURL: "https://api.vturb.com.br/analytics/v2",

// DEPOIS (com endpoint correto que você descobrir)
baseURL: "https://api.vturb.com.br/analytics/v1", // ou o que estiver na doc
```

**E nos métodos:**

```typescript
// ANTES
async getOverallStats(params?: { start_date?: string; end_date?: string; }) {
  const response = await this.client.get("/stats", { params });
  return response.data;
}

// DEPOIS (com endpoint correto)
async getOverallStats(params?: { start_date?: string; end_date?: string; }) {
  const response = await this.client.get("/v1/analytics/overall", { params }); // endpoint correto
  return response.data;
}
```

## Estrutura de Dados Esperada

O código atual espera que a API do Vturb retorne:

```json
{
  "total_views": 15420,
  "total_plays": 8234,
  "avg_watch_time": 245,
  "avg_retention": 68.5,
  "total_videos": 12,
  "engagement_rate": 53.4
}
```

Se a estrutura for diferente, ajuste o mapeamento em:
`src/lib/vturb-api-client.ts` → método `getDashboardMetrics()`

## Como Testar

### 1. Após Configurar os Endpoints

1. Edite: `src/lib/vturb-api-client.ts`
2. Descomente o código no método `getDashboardMetrics()`
3. Atualize os endpoints conforme documentação
4. Reinicie o servidor: `npm run dev`
5. Acesse: http://localhost:3000/dashboard/analytics
6. Vá na aba "Conteúdo (Vturb)"

### 2. Verificar Logs

Abra o console do navegador (F12) ou terminal do servidor para ver:

- ✅ Se a API respondeu corretamente
- ❌ Se há erros de autenticação ou endpoints

## Contato com Suporte Vturb

Se precisar de ajuda para encontrar os endpoints:

1. **Centro de Ajuda**: https://help.vturb.com/pt-br
2. **Documentação API**: https://vturb.gitbook.io/analytics-api/pt
3. **Suporte Direto**: Através da plataforma Vturb

## Checklist de Configuração

- [x] API Key configurada no `.env.local`
- [ ] Endpoints corretos identificados na documentação
- [ ] Base URL atualizada no cliente
- [ ] Métodos de API atualizados
- [ ] Estrutura de dados validada
- [ ] Testado com dados reais
- [ ] Dashboard mostrando métricas corretas

## Dados de Exemplo Atuais

Enquanto os endpoints não estão configurados, o dashboard mostra:

- 📊 **Visualizações Totais**: 15,420
- ▶️ **Plays Completos**: 8,234
- ⏱️ **Tempo Médio**: 4:05
- 📈 **Retenção Média**: 68.5%
- 🎥 **Total de Vídeos**: 12
- 🎯 **Engajamento**: 53.4%

Estes são dados fictícios apenas para demonstração da interface.

---

💡 **Dica**: Quando configurar corretamente, você terá acesso a métricas reais de:

- Curvas de retenção
- Drop-off points
- Taxa de conversão de visualização
- Tempo médio assistido por vídeo
- E muito mais!
