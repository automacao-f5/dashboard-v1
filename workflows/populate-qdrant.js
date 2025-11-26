/**
 * Script para Popular Qdrant Vector Store com Dados dos Agentes
 * Projeto Cirurgião - Consultoria Hierárquica
 *
 * Este script:
 * 1. Conecta ao Qdrant self-hosted
 * 2. Cria a collection se não existir
 * 3. Processa os arquivos MD de cada agente
 * 4. Divide em seções e gera embeddings
 * 5. Insere os documentos com metadados
 */

const fs = require('fs');
const path = require('path');

// ===== CONFIGURAÇÃO =====
const QDRANT_URL = 'http://qdrant.agencia.bot:6333';
const QDRANT_API_KEY = 'AkHcd9cHGNwlCmfT5QkjMJG3M42RNOjJ';
const COLLECTION_NAME = 'agentes_cirurgiao';
const VECTOR_SIZE = 1536; // Tamanho para embeddings (ajustar conforme modelo)

// Mapeamento de arquivos para agentes
const AGENTS_CONFIG = {
  'product_owner': {
    file: 'AGENTE_10_PRODUCT_OWNER.md',
    nivel: 1,
    nome: 'Ana Paula Rodrigues'
  },
  'tech_lead': {
    file: 'AGENTE_09_TECH_LEAD.md',
    nivel: 2,
    nome: 'Ricardo Henrique Souza'
  },
  'backend_senior': {
    file: 'AGENTE_01_BACKEND_SENIOR.md',
    nivel: 3,
    nome: 'Rafael Mendes Costa'
  },
  'devops': {
    file: 'AGENTE_02_DEVOPS.md',
    nivel: 3,
    nome: 'Carolina Mendes'
  },
  'ios_senior': {
    file: 'AGENTE_03_IOS_SENIOR.md',
    nivel: 3,
    nome: 'Lucas Oliveira'
  },
  'android_senior': {
    file: 'AGENTE_04_ANDROID_SENIOR.md',
    nivel: 3,
    nome: 'Marina Ferreira'
  },
  'mobile_pleno': {
    file: 'AGENTE_05_MOBILE_PLENO.md',
    nivel: 4,
    nome: 'Pedro Lima'
  },
  'frontend': {
    file: 'AGENTE_06_FRONTEND.md',
    nivel: 4,
    nome: 'Juliana Ribeiro'
  },
  'designer': {
    file: 'AGENTE_07_DESIGNER.md',
    nivel: 4,
    nome: 'Beatriz Santos'
  },
  'qa': {
    file: 'AGENTE_08_QA.md',
    nivel: 4,
    nome: 'Carlos Martins'
  }
};

// ===== FUNÇÕES AUXILIARES =====

/**
 * Faz requisição HTTP para API do Qdrant
 */
async function qdrantRequest(endpoint, method = 'GET', body = null) {
  const url = `${QDRANT_URL}${endpoint}`;
  const headers = {
    'Content-Type': 'application/json',
    'api-key': QDRANT_API_KEY
  };

  const options = {
    method,
    headers
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(`Qdrant API Error: ${JSON.stringify(data)}`);
    }

    return data;
  } catch (error) {
    console.error(`Erro ao fazer requisição para ${endpoint}:`, error.message);
    throw error;
  }
}

/**
 * Verifica se a collection existe
 */
async function collectionExists() {
  try {
    await qdrantRequest(`/collections/${COLLECTION_NAME}`);
    return true;
  } catch (error) {
    return false;
  }
}

/**
 * Cria a collection no Qdrant
 */
async function createCollection() {
  const config = {
    vectors: {
      size: VECTOR_SIZE,
      distance: 'Cosine'
    }
  };

  await qdrantRequest(`/collections/${COLLECTION_NAME}`, 'PUT', config);
  console.log(`✅ Collection "${COLLECTION_NAME}" criada com sucesso`);
}

/**
 * Gera um embedding dummy (substituir por embedding real de AWS Bedrock ou OpenAI)
 *
 * IMPORTANTE: Em produção, use um serviço real de embeddings como:
 * - AWS Bedrock Titan Embeddings
 * - OpenAI text-embedding-ada-002
 * - Cohere Embeddings
 */
function generateDummyEmbedding(text) {
  // Gera vetor aleatório normalizado
  const vector = Array(VECTOR_SIZE).fill(0).map(() => Math.random() - 0.5);

  // Normaliza o vetor
  const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return vector.map(val => val / magnitude);
}

/**
 * Processa um arquivo Markdown e retorna seções
 */
function processMarkdownFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Divide por headers de nível 2 (##)
  const sections = [];
  const lines = content.split('\n');
  let currentSection = { title: 'Introdução', content: [] };

  for (const line of lines) {
    if (line.startsWith('## ')) {
      // Salva seção anterior
      if (currentSection.content.length > 0) {
        sections.push({
          title: currentSection.title,
          content: currentSection.content.join('\n').trim()
        });
      }

      // Inicia nova seção
      currentSection = {
        title: line.replace('## ', '').trim(),
        content: []
      };
    } else {
      currentSection.content.push(line);
    }
  }

  // Adiciona última seção
  if (currentSection.content.length > 0) {
    sections.push({
      title: currentSection.title,
      content: currentSection.content.join('\n').trim()
    });
  }

  return sections;
}

/**
 * Insere pontos no Qdrant
 */
async function upsertPoints(points) {
  await qdrantRequest(
    `/collections/${COLLECTION_NAME}/points`,
    'PUT',
    { points }
  );
}

/**
 * Cria um slug a partir de um texto
 */
function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9]+/g, '_')     // Substitui caracteres especiais por _
    .replace(/^_|_$/g, '');          // Remove _ do início/fim
}

// ===== FUNÇÃO PRINCIPAL =====

async function main() {
  console.log('🚀 Iniciando população do Qdrant Vector Store\n');

  // 1. Verificar/Criar Collection
  console.log('📦 Verificando collection...');
  const exists = await collectionExists();

  if (exists) {
    console.log(`✅ Collection "${COLLECTION_NAME}" já existe`);
    const answer = await new Promise(resolve => {
      const readline = require('readline').createInterface({
        input: process.stdin,
        output: process.stdout
      });
      readline.question('Deseja recriar a collection? (s/N): ', answer => {
        readline.close();
        resolve(answer.toLowerCase());
      });
    });

    if (answer === 's' || answer === 'sim') {
      console.log('🗑️  Deletando collection existente...');
      await qdrantRequest(`/collections/${COLLECTION_NAME}`, 'DELETE');
      await createCollection();
    }
  } else {
    await createCollection();
  }

  console.log('');

  // 2. Processar cada agente
  const agentsDir = path.join(__dirname, '..', 'agents');
  let totalPoints = 0;

  for (const [agentKey, config] of Object.entries(AGENTS_CONFIG)) {
    console.log(`\n📄 Processando agente: ${config.nome} (${agentKey})`);
    console.log(`   Arquivo: ${config.file}`);

    const filePath = path.join(agentsDir, config.file);

    if (!fs.existsSync(filePath)) {
      console.log(`   ⚠️  Arquivo não encontrado: ${filePath}`);
      continue;
    }

    // Processar arquivo
    const sections = processMarkdownFile(filePath);
    console.log(`   📝 Encontradas ${sections.length} seções`);

    // Criar pontos para cada seção
    const points = [];

    for (let i = 0; i < sections.length; i++) {
      const section = sections[i];
      const pointId = `${agentKey}-${slugify(section.title)}-${i}`;

      // Gerar embedding (SUBSTITUIR por embedding real em produção)
      const vector = generateDummyEmbedding(section.content);

      const point = {
        id: pointId,
        vector: vector,
        payload: {
          text: section.content,
          title: section.title,
          agente: agentKey,
          agente_nome: config.nome,
          nivel: config.nivel,
          tipo: 'perfil',
          arquivo: config.file
        }
      };

      points.push(point);
    }

    // Inserir pontos em lotes de 100
    const batchSize = 100;
    for (let i = 0; i < points.length; i += batchSize) {
      const batch = points.slice(i, i + batchSize);
      await upsertPoints(batch);
      console.log(`   ✅ Inseridos ${batch.length} pontos (lote ${Math.floor(i / batchSize) + 1})`);
    }

    totalPoints += points.length;
  }

  // 3. Verificar collection
  console.log('\n\n📊 Verificando collection...');
  const collectionInfo = await qdrantRequest(`/collections/${COLLECTION_NAME}`);

  console.log(`\n✅ População concluída com sucesso!`);
  console.log(`📊 Total de pontos inseridos: ${totalPoints}`);
  console.log(`📦 Pontos na collection: ${collectionInfo.result.points_count}`);
  console.log(`\n🎉 Qdrant Vector Store pronto para uso!`);
  console.log(`\n🔗 URL: ${QDRANT_URL}`);
  console.log(`📁 Collection: ${COLLECTION_NAME}`);
}

// ===== EXECUÇÃO =====

// Verificar se Node.js >= 18 (para fetch nativo)
const nodeVersion = process.versions.node.split('.')[0];
if (parseInt(nodeVersion) < 18) {
  console.error('❌ Este script requer Node.js >= 18 (para suporte a fetch)');
  console.error('   Sua versão:', process.version);
  process.exit(1);
}

main().catch(error => {
  console.error('\n❌ Erro durante execução:', error);
  process.exit(1);
});
