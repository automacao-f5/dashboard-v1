# 📚 Upload de Agentes para Qdrant Vector Database

Este guia explica como fazer upload dos documentos dos agentes para o Qdrant Vector Database.

## 🎯 Objetivo

Armazenar todos os documentos dos agentes (perfis, system prompts, maestro) no Qdrant para uso como Knowledge Base (KB) em sistemas de IA.

## 📋 Pré-requisitos

1. **Python 3.8+** instalado
2. **Qdrant** rodando em `http://qdrant.agencia.bot:6333`
3. Arquivos dos agentes na pasta `agents/`

## 🚀 Instalação

### 1. Instalar Dependências

```bash
cd D:\dashboard\next-shadcn-admin-dashboard-main\agents
pip install -r requirements.txt
```

**Dependências instaladas:**
- `sentence-transformers`: Para gerar embeddings dos textos
- `requests`: Para comunicação com Qdrant API
- `torch`: Necessário para sentence-transformers

### 2. Verificar Qdrant

Teste se o Qdrant está acessível:

```bash
curl http://qdrant.agencia.bot:6333/collections
```

Ou abra no navegador: http://qdrant.agencia.bot:6333/dashboard

## 📤 Upload dos Documentos

### Executar o Script

```bash
python upload_to_qdrant.py
```

### O que o script faz:

1. **Cria Collection** `agentes_cirurgiao` no Qdrant (se não existir)
2. **Lê todos os arquivos .md** da pasta `agents/`
3. **Divide em chunks** de 1000 caracteres com overlap de 200
4. **Gera embeddings** usando modelo `all-MiniLM-L6-v2`
5. **Faz upload** para o Qdrant
6. **Testa buscas** com queries de exemplo

### Saída Esperada:

```
================================================================================
🎼 UPLOAD DE AGENTES PARA QDRANT VECTOR DATABASE
================================================================================

🚀 Iniciando upload de 13 documentos...
📍 Qdrant URL: http://qdrant.agencia.bot:6333
📦 Collection: agentes_cirurgiao

✅ Collection 'agentes_cirurgiao' criada com sucesso

📄 Processando: AGENTE_01_BACKEND_SENIOR
   Agente: Rafael Silva
   Chunks: 45
   ✅ 45 chunks enviados com sucesso

📄 Processando: AGENTE_02_DEVOPS
   Agente: Carolina Mendes
   Chunks: 38
   ✅ 38 chunks enviados com sucesso

...

✅ Upload concluído!
   Sucesso: 13/13 documentos

================================================================================
🧪 TESTES DE BUSCA
================================================================================

🔍 Testando busca: 'Como implementar autenticação no backend?'

📊 Resultados encontrados: 2

1. Score: 0.8234
   Agente: Rafael Silva
   Arquivo: AGENTE_01_BACKEND_SENIOR
   Chunk: 12/45
   Preview: ## Autenticação e Segurança...

...

================================================================================
✅ PROCESSO CONCLUÍDO!
================================================================================
```

## 🔍 Como Usar o Qdrant

### 1. Busca Simples (Python)

```python
import requests
from sentence_transformers import SentenceTransformer

# Configuração
QDRANT_URL = "http://qdrant.agencia.bot:6333"
COLLECTION_NAME = "agentes_cirurgiao"
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

# Sua pergunta
query = "Quais são as responsabilidades do Tech Lead?"

# Gera embedding
query_vector = model.encode(query).tolist()

# Busca no Qdrant
url = f"{QDRANT_URL}/collections/{COLLECTION_NAME}/points/search"
payload = {
    "vector": query_vector,
    "limit": 5,
    "with_payload": True
}

response = requests.post(url, json=payload)
results = response.json()["result"]

# Exibe resultados
for result in results:
    print(f"Score: {result['score']}")
    print(f"Agente: {result['payload']['agent_name']}")
    print(f"Conteúdo: {result['payload']['content'][:200]}...")
    print("-" * 80)
```

### 2. Busca via API REST

```bash
# Gerar embedding (você precisa fazer isso primeiro)
# Depois fazer a busca:

curl -X POST "http://qdrant.agencia.bot:6333/collections/agentes_cirurgiao/points/search" \
  -H "Content-Type: application/json" \
  -d '{
    "vector": [0.1, 0.2, ...],  # Seu embedding aqui
    "limit": 5,
    "with_payload": true
  }'
```

### 3. Integração com N8N

No N8N, você pode:

1. **HTTP Request Node** para buscar no Qdrant
2. **Code Node** para gerar embeddings
3. **Function Node** para processar resultados

Exemplo de workflow:
```
Trigger → Generate Embedding → Search Qdrant → Process Results → Response
```

## 📊 Estrutura dos Dados no Qdrant

Cada chunk armazenado contém:

```json
{
  "id": 1001,
  "vector": [0.123, 0.456, ...],  // 384 dimensões
  "payload": {
    "filename": "AGENTE_01_BACKEND_SENIOR",
    "agent_name": "Rafael Silva",
    "agent_role": "BACKEND-SENIOR-01",
    "chunk_index": 1,
    "total_chunks": 45,
    "content": "Conteúdo do chunk...",
    "file_path": "D:\\dashboard\\...\\AGENTE_01_BACKEND_SENIOR.md"
  }
}
```

## 🔧 Configurações Avançadas

### Alterar Tamanho dos Chunks

No arquivo `upload_to_qdrant.py`, linha 52:

```python
def chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 200):
```

- `chunk_size`: Tamanho de cada chunk (padrão: 1000 caracteres)
- `overlap`: Sobreposição entre chunks (padrão: 200 caracteres)

### Usar Modelo de Embedding Diferente

No arquivo `upload_to_qdrant.py`, linha 14:

```python
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"
```

Outros modelos disponíveis:
- `all-mpnet-base-v2`: Mais preciso, mas mais lento (768 dim)
- `paraphrase-multilingual-MiniLM-L12-v2`: Melhor para português (384 dim)
- `all-MiniLM-L6-v2`: Rápido e eficiente (384 dim) ✅ Recomendado

### Filtrar por Agente Específico

```python
payload = {
    "vector": query_vector,
    "limit": 5,
    "filter": {
        "must": [
            {
                "key": "agent_role",
                "match": {
                    "value": "BACKEND-SENIOR-01"
                }
            }
        ]
    },
    "with_payload": True
}
```

## 🐛 Troubleshooting

### Erro: "Connection refused"

```bash
# Verifique se Qdrant está rodando
curl http://qdrant.agencia.bot:6333/collections

# Se não estiver, inicie o Qdrant
docker start qdrant  # ou o comando apropriado
```

### Erro: "ModuleNotFoundError: No module named 'sentence_transformers'"

```bash
pip install -r requirements.txt
```

### Erro: "torch not found"

```bash
# Windows
pip install torch --index-url https://download.pytorch.org/whl/cpu

# Linux/Mac
pip install torch
```

### Collection já existe e quer recriar

```bash
# Deletar collection existente
curl -X DELETE "http://qdrant.agencia.bot:6333/collections/agentes_cirurgiao"

# Rodar script novamente
python upload_to_qdrant.py
```

## 📈 Métricas e Monitoramento

### Ver Informações da Collection

```bash
curl http://qdrant.agencia.bot:6333/collections/agentes_cirurgiao
```

### Contar Pontos

```bash
curl http://qdrant.agencia.bot:6333/collections/agentes_cirurgiao/points/count
```

### Dashboard do Qdrant

Acesse: http://qdrant.agencia.bot:6333/dashboard

## 🔐 Segurança

**IMPORTANTE:** O Qdrant está exposto publicamente. Considere:

1. **Adicionar autenticação** no Qdrant
2. **Usar HTTPS** em produção
3. **Configurar firewall** para restringir acesso
4. **Usar API Key** para autenticação

## 📚 Recursos Adicionais

- [Documentação Qdrant](https://qdrant.tech/documentation/)
- [Sentence Transformers](https://www.sbert.net/)
- [Qdrant Python Client](https://github.com/qdrant/qdrant-client)

## ✅ Checklist de Sucesso

- [ ] Python 3.8+ instalado
- [ ] Dependências instaladas (`pip install -r requirements.txt`)
- [ ] Qdrant acessível em `http://qdrant.agencia.bot:6333`
- [ ] Arquivos .md na pasta `agents/`
- [ ] Script executado com sucesso
- [ ] Testes de busca funcionando
- [ ] Collection visível no dashboard do Qdrant

## 🎉 Próximos Passos

Após o upload bem-sucedido:

1. **Integrar com N8N** para workflows automáticos
2. **Criar API** para consultar o Qdrant
3. **Implementar cache** para buscas frequentes
4. **Adicionar mais documentos** conforme necessário
5. **Monitorar performance** das buscas

---

**Criado por:** Sistema de Agentes - Projeto Cirurgião
**Data:** 2025-01-07
**Versão:** 1.0.0
