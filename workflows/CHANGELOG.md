# 📝 Changelog - Workflow Consultoria Projeto Cirurgião

## [2.0.0] - 2025-01-07

### 🔧 **CORREÇÃO CRÍTICA: Substituição de Tool Workflow por AI Agent Tool**

#### ❌ **Problema Identificado:**
Os nós `toolWorkflow` estavam com erro: **"Parameter 'Workflow' is required"**

**Causa:**
- `toolWorkflow` requer que você crie sub-workflows separados e referencie-os
- Isso tornaria o setup muito mais complexo (precisaria criar 8+ workflows adicionais)
- Não é ideal para delegação hierárquica de agentes

#### ✅ **Solução Implementada:**
Substituição de **todos** os nós `toolWorkflow` por `agentTool` (AI Agent Tool)

**Vantagens:**
- ✅ Agentes aninhados funcionam nativamente
- ✅ Cada "tool" é um sub-agente completo com seu próprio modelo e KB
- ✅ Não requer workflows separados
- ✅ Delegação hierárquica funciona perfeitamente
- ✅ System prompts podem instruir quando delegar

---

### 📊 **Mudanças Detalhadas:**

#### **Antes (v1.0.0):**
```json
{
  "type": "@n8n/n8n-nodes-langchain.toolWorkflow",
  "parameters": {
    "name": "delegate_to_tech_lead",
    "description": "Delega para Tech Lead..."
  }
  // ❌ ERRO: Faltava parâmetro "workflow"
}
```

#### **Depois (v2.0.0):**
```json
{
  "type": "@n8n/n8n-nodes-langchain.agentTool",
  "parameters": {
    "toolDescription": "Consulta o Tech Lead (Ricardo)...",
    "text": "={{ $json.query }}",
    "options": {
      "systemMessage": "Como Tech Lead..."
    }
  },
  "connections": {
    "ai_languageModel": [...],  // Bedrock Model
    "ai_memory": [...]           // Qdrant KB
  }
}
```

---

### 🎯 **Arquitetura Atualizada:**

```
📱 Chat Trigger
    │
    ▼
🎯 Product Owner (AI Agent)
    ├─ AWS Bedrock Model (Claude Sonnet 4.5)
    ├─ Qdrant KB (product_owner)
    └─ Tool: Tech Lead Agent ✨ (agentTool)
        │
        ▼
👨‍💼 Tech Lead (AI Agent Tool) ✨
    ├─ AWS Bedrock Model (Claude Sonnet 4.5)
    ├─ Qdrant KB (tech_lead)
    └─ Tools:
        ├─ Backend Senior Agent ✨ (agentTool)
        │   ├─ AWS Bedrock Model
        │   └─ Qdrant KB (backend_senior)
        │
        └─ DevOps Agent ✨ (agentTool)
            ├─ AWS Bedrock Model
            └─ Qdrant KB (devops)
```

**✨ = AI Agent Tool (novo)**

---

### 🔄 **Nós Modificados:**

1. **Tool: Tech Lead Agent**
   - Tipo: `toolWorkflow` → `agentTool`
   - Conexões: Adicionado Bedrock Model + Qdrant KB
   - System Prompt: Instruções de delegação

2. **Tool: Backend Senior Agent**
   - Tipo: `toolWorkflow` → `agentTool`
   - Conexões: Adicionado Bedrock Model + Qdrant KB
   - System Prompt: Especialista em backend

3. **Tool: DevOps Agent**
   - Tipo: `toolWorkflow` → `agentTool`
   - Conexões: Adicionado Bedrock Model + Qdrant KB
   - System Prompt: Especialista em infraestrutura

---

### 📈 **Estatísticas do Workflow v2.0.0:**

| Métrica | v1.0.0 | v2.0.0 | Delta |
|---------|--------|--------|-------|
| **Total de Nós** | 26 | 15 | -11 ❌ (removido consolidator e tools extras) |
| **AI Agents** | 4 | 1 | -3 (3 viraram agentTool) |
| **AI Agent Tools** | 0 | 3 | +3 ✅ |
| **Bedrock Models** | 5 | 4 | -1 |
| **Qdrant KBs** | 5 | 4 | -1 |
| **Erros** | 8 | 0 | -8 ✅ |

---

### ⚙️ **Configuração de Delegação:**

#### **Product Owner → Tech Lead**
```javascript
// No system prompt do PO:
"**IMPORTANTE - Delegação:**
- Se pergunta for TÉCNICA → Use 'tech_lead_agent'"
```

#### **Tech Lead → Especialistas**
```javascript
// No system prompt do Tech Lead:
"**IMPORTANTE - Delegação:**
- Backend, APIs, Database → Use 'backend_senior_agent'
- Infraestrutura, CI/CD → Use 'devops_agent'"
```

---

### 🎭 **Como Funciona a Delegação:**

1. **Usuário faz pergunta técnica:**
   ```
   "Qual arquitetura de backend usar para 100k usuários?"
   ```

2. **Product Owner recebe:**
   - Analisa: "É questão técnica"
   - Decision: Usa tool `tech_lead_agent`

3. **Tech Lead (como agentTool) processa:**
   - Recebe query do PO
   - Analisa: "É questão específica de backend"
   - Decision: Usa tool `backend_senior_agent`

4. **Backend Senior (como agentTool) responde:**
   - Consulta KB no Qdrant
   - Usa expertise em Node.js/PostgreSQL
   - Retorna resposta técnica detalhada

5. **Resposta sobe a hierarquia:**
   - Backend → Tech Lead → Product Owner → Usuário

---

### ✅ **Testes Realizados:**

- [x] Importação do workflow no N8N
- [x] Configuração de credenciais AWS/Qdrant
- [x] Ativação do workflow
- [x] Teste de pergunta direta ao PO
- [x] Teste de delegação PO → Tech Lead
- [x] Teste de delegação Tech Lead → Backend Senior
- [x] Teste de delegação Tech Lead → DevOps

---

### 📝 **Breaking Changes:**

#### **v1.0.0 → v2.0.0:**

1. **Removido: Response Consolidator**
   - Não é mais necessário
   - Cada agente retorna resposta completa
   - Hierarquia é mantida automaticamente

2. **Removidos: 6 Tools pendentes**
   - iOS Senior, Android Senior, Mobile Pleno, Frontend, Designer, QA
   - Podem ser adicionados seguindo o mesmo padrão
   - Simplificado para 4 agentes funcionais

3. **Mudança de Estrutura:**
   - Antes: AI Agent → Tool Workflow (erro) → Sub-workflow (não existia)
   - Agora: AI Agent → AI Agent Tool (funcional) → Resposta

---

### 🚀 **Migração:**

Se você já tinha v1.0.0 instalado:

1. **Deletar workflow antigo** no N8N
2. **Importar novo workflow** (v2.0.0)
3. **Reconfigurar credenciais:**
   - AWS Account
   - Qdrant Self-Hosted
4. **Ativar e testar**

**Não é necessário:**
- ❌ Criar sub-workflows
- ❌ Modificar Qdrant (mesma estrutura)
- ❌ Mudar credenciais

---

### 📚 **Documentação Atualizada:**

- ✅ [README-WORKFLOW.md](./README-WORKFLOW.md) - Atualizado com nova arquitetura
- ✅ [QUICK-START.md](./QUICK-START.md) - Passos de instalação atualizados
- ✅ [populate-qdrant.js](./populate-qdrant.js) - Sem mudanças (compatível)

---

### 🐛 **Bugs Corrigidos:**

- ✅ **CRÍTICO:** Tool Workflow nodes com erro "Parameter 'Workflow' is required"
- ✅ **CRÍTICO:** Workflow não executava devido a tools inválidos
- ✅ Simplificação da arquitetura
- ✅ Remoção de dependências de sub-workflows

---

### 🎯 **Próximos Passos (Roadmap):**

#### **v2.1.0 (Planejado):**
- [ ] Adicionar iOS Senior Agent (agentTool)
- [ ] Adicionar Android Senior Agent (agentTool)
- [ ] Adicionar Mobile Pleno Agent (agentTool)

#### **v2.2.0 (Planejado):**
- [ ] Adicionar Frontend Agent (agentTool)
- [ ] Adicionar Designer Agent (agentTool)
- [ ] Adicionar QA Agent (agentTool)

#### **v3.0.0 (Futuro):**
- [ ] Implementar memória de conversação persistente
- [ ] Adicionar métricas de performance
- [ ] Integração com Slack/Discord
- [ ] Export automático de decisões para docs

---

### 💡 **Lições Aprendidas:**

1. **Tool Workflow vs Agent Tool:**
   - `toolWorkflow`: Melhor para workflows estáticos e reutilizáveis
   - `agentTool`: Melhor para delegação hierárquica de agentes
   - **Escolha:** agentTool para este caso de uso

2. **Simplicidade > Complexidade:**
   - v1.0.0: 26 nós, muitos com erros
   - v2.0.0: 15 nós, todos funcionais
   - **Resultado:** Mais simples, mais robusto

3. **Validação Antecipada:**
   - Sempre validar workflow antes de documentar
   - Testar importação em N8N limpo
   - Verificar todos os nós sem erros

---

### 🔗 **Links Úteis:**

- [N8N AI Agent Tool Documentation](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.agenttool/)
- [N8N Tool Workflow Documentation](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.toolworkflow/)
- [AWS Bedrock Chat Model](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.lmchatawsbedrock/)
- [Qdrant Vector Store](https://docs.n8n.io/integrations/builtin/cluster-nodes/sub-nodes/n8n-nodes-langchain.vectorstoreqdrant/)

---

**Autor:** Projeto Cirurgião - Consultoria IA
**Data:** 2025-01-07
**Versão:** 2.0.0
**Status:** ✅ Estável e Funcional
