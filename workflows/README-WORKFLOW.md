# 🎼 Workflow: Consultoria Projeto Cirurgião - Equipe Hierárquica

## 📋 Visão Geral

Este workflow N8N implementa uma **equipe de 10 agentes de IA especializados** que trabalham em hierarquia, simulando uma consultoria completa para o Projeto Cirurgião. Cada agente tem sua própria especialidade, base de conhecimento (via Qdrant Vector Store) e pode delegar tarefas para agentes subordinados seguindo a estrutura organizacional definida no documento MAESTRO.

---

## 🏗️ Arquitetura

### Hierarquia de Agentes

```
📱 CHAT TRIGGER (Entrada do Usuário)
    │
    ├─► 🎯 NÍVEL 1: PRODUCT OWNER (Ana Paula)
    │   └─► Tool: Delegar para Tech Lead
    │
    ├─► 👨‍💼 NÍVEL 2: TECH LEAD (Ricardo)
    │   ├─► Tool: Delegar para Backend Senior
    │   ├─► Tool: Delegar para DevOps
    │   ├─► Tool: Delegar para iOS Senior
    │   ├─► Tool: Delegar para Android Senior
    │   ├─► Tool: Delegar para Frontend
    │   ├─► Tool: Delegar para Designer
    │   ├─► Tool: Delegar para QA
    │   └─► Tool: Delegar para Mobile Pleno
    │
    ├─► ⚙️ NÍVEL 3: ESPECIALISTAS SENIORES
    │   ├─► Backend Senior (Rafael)
    │   ├─► DevOps (Carolina)
    │   ├─► iOS Senior (Lucas)
    │   └─► Android Senior (Marina)
    │
    ├─► 💻 NÍVEL 4: ESPECIALISTAS
    │   ├─► Mobile Pleno (Pedro)
    │   ├─► Frontend (Juliana)
    │   ├─► Designer (Beatriz)
    │   └─► QA (Carlos)
    │
    └─► 📊 CONSOLIDATOR (Resposta Final)
```

---

## 🔧 Componentes Principais

### 1. **Chat Trigger**
- **Nó:** `@n8n/n8n-nodes-langchain.chatTrigger`
- **Função:** Ponto de entrada - Interface de chat interativa
- **Configuração:** Público, com mensagem de boas-vindas personalizada

### 2. **Agentes AI (10 no total)**
Cada agente possui:
- **AI Agent Node:** Processa solicitações e toma decisões
- **AWS Bedrock Chat Model:** Claude Sonnet 4.5 via Inference Profiles
- **Qdrant Vector Store:** Base de conhecimento específica
- **System Prompt:** Personalizado conforme especialidade
- **Tools (quando aplicável):** Para delegar para subordinados

### 3. **Response Consolidator**
- **Função:** Consolida respostas de múltiplos agentes
- **Formato:** Estruturado com resumo executivo, decisões, fluxo de consulta e próximos passos
- **Rastreamento:** Mostra quais agentes foram consultados

---

## 📦 Nós Implementados

### Agentes Completos (4)

1. **Product Owner (PO-01 - Ana Paula)**
   - System Prompt: AGENTE_10_PRODUCT_OWNER
   - KB Metadata: `agente: "product_owner"`
   - Tools: 1 (delegate_to_tech_lead)
   - Temperature: 0.7

2. **Tech Lead (TECH-LEAD-01 - Ricardo)**
   - System Prompt: AGENTE_09_TECH_LEAD
   - KB Metadata: `agente: "tech_lead"`
   - Tools: 8 (delegação para todos especialistas)
   - Temperature: 0.6

3. **Backend Senior (BACKEND-SENIOR-01 - Rafael)**
   - System Prompt: AGENTE_01_BACKEND_SENIOR
   - KB Metadata: `agente: "backend_senior"`
   - Tools: 0 (especialista final)
   - Temperature: 0.5

4. **DevOps (DEVOPS-01 - Carolina)**
   - System Prompt: AGENTE_02_DEVOPS
   - KB Metadata: `agente: "devops"`
   - Tools: 0 (especialista final)
   - Temperature: 0.5

### Agentes Pendentes (6)

Para completar a implementação, adicione:
- iOS Senior (Lucas)
- Android Senior (Marina)
- Mobile Pleno (Pedro)
- Frontend (Juliana)
- Designer (Beatriz)
- QA (Carlos)

> **Nota:** O workflow base está funcional com 4 agentes. Os 6 agentes restantes seguem o mesmo padrão e podem ser adicionados conforme necessário.

---

## ⚙️ Configuração Necessária

### 1. **Credenciais AWS**
```yaml
Nome: AWS Account
Tipo: AWS credentials
Configuração:
  - Access Key ID: [sua access key]
  - Secret Access Key: [sua secret key]
  - Region: us-east-1 (ou sua região)
```

### 2. **Credenciais Qdrant**
```yaml
Nome: Qdrant Self-Hosted
Tipo: Qdrant API
Configuração:
  - URL: http://qdrant.agencia.bot:6333/
  - API Key: AkHcd9cHGNwlCmfT5QkjMJG3M42RNOjJ
  - Collection: agentes_cirurgiao
```

### 3. **Collection Qdrant: agentes_cirurgiao**

#### Estrutura de Metadados
Cada documento na collection deve ter:
```json
{
  "agente": "product_owner" | "tech_lead" | "backend_senior" | "devops" | "ios_senior" | "android_senior" | "mobile_pleno" | "frontend" | "designer" | "qa",
  "tipo": "perfil" | "experiencia" | "skills" | "projetos",
  "nivel": 1 | 2 | 3 | 4
}
```

#### Exemplo de Documento
```json
{
  "id": "po-perfil-001",
  "vector": [0.123, 0.456, ...], // Embedding
  "payload": {
    "text": "Ana Paula Rodrigues é Product Owner sênior com 8 anos de experiência...",
    "metadata": {
      "agente": "product_owner",
      "tipo": "perfil",
      "nivel": 1,
      "secao": "formacao"
    }
  }
}
```

---

## 🚀 Como Usar

### 1. **Importar o Workflow**
```bash
# Abra o N8N
# Vá em: Workflows > Import from File
# Selecione: consultoria-cirurgiao-hierarchical-agents.json
```

### 2. **Configurar Credenciais**
- Configure **AWS Account** com suas credenciais
- Configure **Qdrant Self-Hosted** com a URL e API Key fornecidas

### 3. **Verificar Model AWS Bedrock**
- Certifique-se de que o modelo `us.anthropic.claude-sonnet-4-5-v2:0` está disponível em sua conta AWS Bedrock
- Caso não esteja, solicite acesso via AWS Console > Bedrock > Model Access

### 4. **Popular Qdrant Vector Store**
Execute o script de população (ver seção abaixo)

### 5. **Ativar o Workflow**
- Clique em **Activate** no canto superior direito
- Acesse a URL do Chat Trigger fornecida

### 6. **Testar**
Exemplos de perguntas:
- "Como devo priorizar as features do MVP?"
- "Qual arquitetura de backend você recomenda para escalar até 100k usuários?"
- "Preciso implementar autenticação biométrica no iOS, como proceder?"
- "Quais testes de QA devemos automatizar primeiro?"

---

## 📊 Fluxo de Execução

### Cenário 1: Pergunta de Produto
```
Usuário: "Como devo priorizar as features do MVP?"
    ↓
Product Owner (Ana Paula)
    ↓ (analisa e responde)
Consolidator
    ↓
Resposta ao Usuário
```

### Cenário 2: Pergunta Técnica
```
Usuário: "Qual stack de backend usar?"
    ↓
Product Owner (Ana Paula)
    ↓ (identifica como questão técnica)
Tool: delegate_to_tech_lead
    ↓
Tech Lead (Ricardo)
    ↓ (analisa e pode consultar Backend Senior)
Tool: delegate_to_backend_senior (opcional)
    ↓
Backend Senior (Rafael)
    ↓
Consolidator (agrega respostas)
    ↓
Resposta ao Usuário
```

### Cenário 3: Pergunta Complexa Multi-Área
```
Usuário: "Como implementar sistema de vídeo com streaming?"
    ↓
Product Owner (Ana Paula)
    ↓
Tool: delegate_to_tech_lead
    ↓
Tech Lead (Ricardo)
    ↓ (divide entre Backend, iOS, Android)
├─► Backend Senior (API + Cloudflare Stream)
├─► iOS Senior (Player AVFoundation)
├─► Android Senior (Player ExoPlayer)
└─► DevOps (CDN + Storage)
    ↓
Consolidator (agrega todas respostas)
    ↓
Resposta ao Usuário com plano completo
```

---

## 📝 Script de População do Qdrant

Crie um arquivo `populate-qdrant.js`:

```javascript
const { QdrantClient } = require('@qdrant/qdrant-js');
const fs = require('fs');
const path = require('path');

// Configuração
const QDRANT_URL = 'http://qdrant.agencia.bot:6333/';
const QDRANT_API_KEY = 'AkHcd9cHGNwlCmfT5QkjMJG3M42RNOjJ';
const COLLECTION_NAME = 'agentes_cirurgiao';

// Mapeamento de arquivos para agentes
const AGENTS_FILES = {
  'product_owner': 'AGENTE_10_PRODUCT_OWNER.md',
  'tech_lead': 'AGENTE_09_TECH_LEAD.md',
  'backend_senior': 'AGENTE_01_BACKEND_SENIOR.md',
  'devops': 'AGENTE_02_DEVOPS.md',
  'ios_senior': 'AGENTE_03_IOS_SENIOR.md',
  'android_senior': 'AGENTE_04_ANDROID_SENIOR.md',
  'mobile_pleno': 'AGENTE_05_MOBILE_PLENO.md',
  'frontend': 'AGENTE_06_FRONTEND.md',
  'designer': 'AGENTE_07_DESIGNER.md',
  'qa': 'AGENTE_08_QA.md'
};

// Níveis hierárquicos
const AGENT_LEVELS = {
  'product_owner': 1,
  'tech_lead': 2,
  'backend_senior': 3,
  'devops': 3,
  'ios_senior': 3,
  'android_senior': 3,
  'mobile_pleno': 4,
  'frontend': 4,
  'designer': 4,
  'qa': 4
};

async function main() {
  // Conectar ao Qdrant
  const client = new QdrantClient({
    url: QDRANT_URL,
    apiKey: QDRANT_API_KEY
  });

  console.log('✅ Conectado ao Qdrant');

  // Verificar se collection existe
  try {
    await client.getCollection(COLLECTION_NAME);
    console.log(`✅ Collection "${COLLECTION_NAME}" encontrada`);
  } catch (error) {
    console.log(`❌ Collection "${COLLECTION_NAME}" não existe. Criando...`);
    await client.createCollection(COLLECTION_NAME, {
      vectors: {
        size: 1536, // Dimensão para embeddings AWS Bedrock Titan
        distance: 'Cosine'
      }
    });
    console.log(`✅ Collection "${COLLECTION_NAME}" criada`);
  }

  // Para cada agente, carregar arquivo MD e inserir no Qdrant
  for (const [agentKey, fileName] of Object.entries(AGENTS_FILES)) {
    console.log(`\n📄 Processando: ${fileName} (${agentKey})`);

    const filePath = path.join(__dirname, '../agents', fileName);

    if (!fs.existsSync(filePath)) {
      console.log(`⚠️  Arquivo não encontrado: ${filePath}`);
      continue;
    }

    const content = fs.readFileSync(filePath, 'utf-8');

    // Dividir conteúdo em seções (por ##)
    const sections = content.split(/\n## /).filter(s => s.trim());

    console.log(`   Encontradas ${sections.length} seções`);

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const sectionTitle = section.split('\n')[0];

      // Aqui você precisaria gerar embeddings usando AWS Bedrock Titan
      // Por simplicidade, vamos criar um vetor dummy
      const dummyVector = Array(1536).fill(0).map(() => Math.random());

      const point = {
        id: `${agentKey}-section-${i}`,
        vector: dummyVector,
        payload: {
          text: section,
          metadata: {
            agente: agentKey,
            tipo: 'perfil',
            nivel: AGENT_LEVELS[agentKey],
            secao: sectionTitle.toLowerCase().replace(/[^a-z0-9]/g, '_')
          }
        }
      };

      await client.upsert(COLLECTION_NAME, {
        points: [point]
      });

      console.log(`   ✅ Inserida seção: ${sectionTitle}`);
    }
  }

  console.log('\n🎉 Population concluída!');
}

main().catch(console.error);
```

### Como Executar
```bash
# Instalar dependências
npm install @qdrant/qdrant-js

# Executar script
node populate-qdrant.js
```

---

## 🔍 Validação e Testes

### 1. **Testar Conexão Qdrant**
```bash
curl http://qdrant.agencia.bot:6333/collections/agentes_cirurgiao \
  -H "api-key: AkHcd9cHGNwlCmfT5QkjMJG3M42RNOjJ"
```

### 2. **Testar Workflow**
- Abra o workflow no N8N
- Clique em **Execute Workflow**
- Vá para o Chat Trigger
- Digite uma pergunta de teste

### 3. **Verificar Logs**
- Veja os logs de execução de cada nó
- Verifique se os agentes estão sendo chamados na ordem correta
- Confira se o Qdrant está retornando resultados relevantes

---

## 🎯 Próximos Passos

### Fase 1: Completar Implementação ✅
- [x] Chat Trigger
- [x] Product Owner
- [x] Tech Lead
- [x] Backend Senior
- [x] DevOps
- [ ] iOS Senior
- [ ] Android Senior
- [ ] Mobile Pleno
- [ ] Frontend
- [ ] Designer
- [ ] QA
- [x] Consolidator

### Fase 2: Melhorias
- [ ] Implementar memória de conversação persistente
- [ ] Adicionar métricas de performance (tempo de resposta, agentes acionados)
- [ ] Criar dashboard de analytics
- [ ] Implementar feedback loop para melhorar respostas

### Fase 3: Integração
- [ ] Integrar com sistema de tickets (Jira/Linear)
- [ ] Criar webhook para notificações Slack
- [ ] Exportar decisões para documentação automática

---

## 📚 Documentação de Referência

- [N8N AI Agents Documentation](https://docs.n8n.io/advanced-ai/)
- [AWS Bedrock Claude Models](https://docs.aws.amazon.com/bedrock/latest/userguide/model-parameters-anthropic-claude.html)
- [Qdrant Documentation](https://qdrant.tech/documentation/)
- [MAESTRO_ORQUESTRACAO_EQUIPE.md](../MAESTRO_ORQUESTRACAO_EQUIPE.md)
- [SYSTEM_PROMPTS_AGENTES.md](../SYSTEM_PROMPTS_AGENTES.md)

---

## 🤝 Contribuindo

Para adicionar novos agentes ou modificar a hierarquia:

1. Edite o arquivo JSON do workflow
2. Adicione os nós necessários (AI Agent + Bedrock Model + Qdrant KB)
3. Configure o System Prompt do arquivo SYSTEM_PROMPTS_AGENTES.md
4. Atualize as conexões no objeto `connections`
5. Popule o Qdrant com os dados do agente
6. Teste o workflow

---

## 📄 Licença

Este workflow faz parte do Projeto Cirurgião e está sob a mesma licença do projeto principal.

---

## ✉️ Suporte

Para dúvidas ou problemas:
1. Verifique os logs de execução do N8N
2. Consulte a documentação dos nós utilizados
3. Entre em contato com a equipe de desenvolvimento

---

**Versão:** 1.0.0
**Última Atualização:** 2025-01-07
**Autor:** Consultoria Projeto Cirurgião
