# 🚀 Quick Start - Consultoria Projeto Cirurgião

Guia rápido para colocar o workflow de consultoria hierárquica funcionando em **15 minutos**.

---

## ⚡ Passo a Passo Rápido

### 1️⃣ **Pré-requisitos** (2 min)

Verifique se você tem:

```bash
✅ Node.js >= 18 instalado
✅ Acesso ao N8N (cloud ou self-hosted)
✅ Conta AWS com acesso ao Bedrock
✅ Qdrant rodando em http://qdrant.agencia.bot:6333/
```

**Verificar Node.js:**
```bash
node --version
# Deve retornar v18.x.x ou superior
```

---

### 2️⃣ **Popular Qdrant Vector Store** (5 min)

```bash
# Navegar para pasta workflows
cd D:\dashboard\next-shadcn-admin-dashboard-main\workflows

# Executar script de população
node populate-qdrant.js
```

**O que acontece:**
- ✅ Conecta ao Qdrant
- ✅ Cria collection `agentes_cirurgiao` (se não existir)
- ✅ Processa 10 arquivos MD dos agentes
- ✅ Insere ~100-200 documentos com embeddings
- ✅ Configura metadados para filtragem

**Output esperado:**
```
🚀 Iniciando população do Qdrant Vector Store
📦 Verificando collection...
✅ Collection "agentes_cirurgiao" criada com sucesso
📄 Processando agente: Ana Paula Rodrigues (product_owner)
   ✅ Inseridos 15 pontos
...
✅ População concluída com sucesso!
📊 Total de pontos inseridos: 156
```

---

### 3️⃣ **Importar Workflow no N8N** (3 min)

**No N8N:**

1. Vá em **Workflows** → **Import from File**
2. Selecione: `consultoria-cirurgiao-hierarchical-agents.json`
3. Clique em **Import**

✅ Workflow importado!

---

### 4️⃣ **Configurar Credenciais** (5 min)

#### A) **AWS Credentials**

1. Clique em qualquer nó **AWS Bedrock**
2. Clique em **Select Credential** → **Create New**
3. Preencha:
   ```
   Name: AWS Account
   Credential Type: AWS
   Access Key ID: [sua access key]
   Secret Access Key: [sua secret key]
   Region: us-east-1
   ```
4. Clique em **Save**

#### B) **Qdrant Credentials**

1. Clique em qualquer nó **Qdrant Vector Store**
2. Clique em **Select Credential** → **Create New**
3. Preencha:
   ```
   Name: Qdrant Self-Hosted
   API Endpoint: http://qdrant.agencia.bot:6333/
   API Key: AkHcd9cHGNwlCmfT5QkjMJG3M42RNOjJ
   ```
4. Clique em **Save**

---

### 5️⃣ **Ativar e Testar** (2 min)

1. **Ativar workflow:**
   - Clique no botão **Inactive** → **Active** (canto superior direito)

2. **Obter URL do Chat:**
   - Clique no nó **Chat Trigger**
   - Copie a **Production URL** ou **Test URL**

3. **Testar:**
   - Abra a URL em seu navegador
   - Digite uma pergunta de teste:
     ```
     Como devo priorizar as features do MVP?
     ```

4. **Verificar resposta:**
   - Você deve receber uma resposta estruturada do Product Owner
   - Se a pergunta for técnica, o PO pode delegar para o Tech Lead

---

## 🎯 Perguntas de Teste

### Nível 1 - Product Owner
```
✅ "Quais são os principais KPIs que devemos monitorar?"
✅ "Como validar o product-market fit?"
✅ "Qual framework de priorização você recomenda?"
```

### Nível 2 - Tech Lead (via delegação)
```
✅ "Qual arquitetura de backend você recomenda?"
✅ "Como garantir escalabilidade para 100k usuários?"
✅ "Quais são os principais riscos técnicos do projeto?"
```

### Nível 3 - Especialistas (via delegação do Tech Lead)
```
✅ "Como implementar streaming de vídeo com Cloudflare?"
✅ "Qual estratégia de CI/CD devemos usar?"
✅ "Como implementar autenticação biométrica no iOS?"
```

---

## 🔍 Troubleshooting

### ❌ "Collection not found"
**Solução:**
```bash
# Re-executar script de população
node populate-qdrant.js
```

### ❌ "AWS Bedrock Access Denied"
**Solução:**
1. Vá para AWS Console → Bedrock → Model Access
2. Solicite acesso ao modelo: `Claude Sonnet 4.5 (Inference Profile)`
3. Aguarde aprovação (~2 minutos)

### ❌ "Cannot connect to Qdrant"
**Solução:**
```bash
# Verificar se Qdrant está rodando
curl http://qdrant.agencia.bot:6333/collections

# Se não funcionar, verifique firewall/VPN
```

### ❌ "Workflow execution failed"
**Solução:**
1. Abra o workflow no N8N
2. Clique em **Execute Workflow** (modo teste)
3. Veja qual nó falhou
4. Verifique os logs do nó
5. Certifique-se de que as credenciais estão configuradas

---

## 📊 Verificação de Saúde

Execute estes comandos para verificar se tudo está OK:

### 1. **Verificar Qdrant**
```bash
curl -X GET "http://qdrant.agencia.bot:6333/collections/agentes_cirurgiao" \
  -H "api-key: AkHcd9cHGNwlCmfT5QkjMJG3M42RNOjJ"
```

**Output esperado:**
```json
{
  "result": {
    "status": "green",
    "points_count": 156
  }
}
```

### 2. **Verificar AWS Bedrock**
```bash
aws bedrock list-foundation-models \
  --region us-east-1 \
  --query 'modelSummaries[?contains(modelId, `claude-sonnet-4-5`)]'
```

### 3. **Verificar N8N Workflow**
- Vá em N8N → Workflows
- Veja se status está **Active** ✅
- Clique em **Executions** → veja se há execuções bem-sucedidas

---

## 🎓 Próximos Passos

Agora que tudo está funcionando:

### **Fase 1: Explorar**
- ✅ Faça perguntas para diferentes agentes
- ✅ Observe como a delegação hierárquica funciona
- ✅ Veja o consolidador agregando respostas

### **Fase 2: Expandir**
- 📝 Adicione os 6 agentes restantes (iOS, Android, Frontend, Designer, QA, Mobile Pleno)
- 🔧 Customize os system prompts conforme necessário
- 📊 Adicione métricas e analytics

### **Fase 3: Integrar**
- 🔗 Conecte com Slack/Discord para notificações
- 📋 Integre com Jira/Linear para gestão de tarefas
- 📝 Exporte decisões para documentação automática

---

## 📚 Recursos Adicionais

- [README Completo](./README-WORKFLOW.md) - Documentação detalhada
- [Workflow JSON](./consultoria-cirurgiao-hierarchical-agents.json) - Arquivo do workflow
- [Script de População](./populate-qdrant.js) - Script Qdrant
- [MAESTRO](../MAESTRO_ORQUESTRACAO_EQUIPE.md) - Documento de orquestração
- [System Prompts](../SYSTEM_PROMPTS_AGENTES.md) - Prompts dos agentes

---

## 💡 Dicas Profissionais

### 🚀 **Performance**
- Configure cache no Qdrant para queries frequentes
- Use batch size adequado (100 pontos por requisição)
- Configure timeout adequado no N8N (300s para queries complexas)

### 🔐 **Segurança**
- **NUNCA** commite credenciais no Git
- Use variáveis de ambiente para API keys
- Configure autenticação no Chat Trigger (n8n User Auth)

### 📊 **Monitoramento**
- Ative logs detalhados no N8N
- Configure alertas para falhas
- Monitore custos AWS Bedrock

### 💰 **Custos**
- Claude Sonnet 4.5: ~$3 por 1M tokens de input
- Qdrant self-hosted: Sem custo (exceto infra)
- N8N self-hosted: Sem custo (exceto infra)

**Estimativa para 1000 queries/mês:**
- AWS Bedrock: ~$15-30
- Infraestrutura: ~$20-50
- **Total: ~$35-80/mês**

---

## ✅ Checklist Final

Antes de colocar em produção, verifique:

- [ ] Qdrant está populado com todos os 10 agentes
- [ ] Credenciais AWS configuradas corretamente
- [ ] Credenciais Qdrant configuradas corretamente
- [ ] Workflow ativado no N8N
- [ ] Chat Trigger testado e funcionando
- [ ] Delegação hierárquica testada (PO → Tech Lead → Especialista)
- [ ] Consolidador agregando respostas corretamente
- [ ] Logs do N8N sem erros
- [ ] Backup do workflow realizado
- [ ] Documentação revisada

---

## 🎉 Pronto!

Seu sistema de consultoria hierárquica com 10 agentes de IA está **funcionando**!

Agora você tem uma equipe virtual de especialistas trabalhando 24/7 para responder perguntas sobre o Projeto Cirurgião, seguindo a hierarquia definida no documento MAESTRO.

**Dúvidas?** Consulte o [README completo](./README-WORKFLOW.md) ou entre em contato com a equipe.

---

**Versão:** 1.0.0
**Data:** 2025-01-07
**Tempo Estimado de Setup:** 15 minutos
