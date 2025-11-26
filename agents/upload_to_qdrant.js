/**
 * Script para fazer upload dos documentos dos agentes para o Qdrant Vector Database
 * Versão Node.js - Não requer Python!
 * Autor: Sistema de Agentes - Projeto Cirurgião
 * Data: 2025-01-07
 */

const fs = require('fs').promises;
const path = require('path');
const axios = require('axios');

// Configurações
const QDRANT_URL = 'http://qdrant.agencia.bot:6333';
const COLLECTION_NAME = 'agentes_cirurgiao';
const VECTOR_SIZE = 384; // Tamanho padrão para embeddings

class QdrantUploader {
  constructor(qdrantUrl, collectionName) {
    this.qdrantUrl = qdrantUrl;
    this.collectionName = collectionName;
  }

  async createCollection() {
    const url = `${this.qdrantUrl}/collections/${this.collectionName}`;
    
    try {
      // Verifica se collection já existe
      const response = await axios.get(url);
      console.log(`✅ Collection '${this.collectionName}' já existe`);
      return true;
    } catch (error) {
      if (error.response && error.response.status === 404) {
        // Collection não existe, criar nova
        try {
          await axios.put(url, {
            vectors: {
              size: VECTOR_SIZE,
              distance: 'Cosine'
            }
          });
          console.log(`✅ Collection '${this.collectionName}' criada com sucesso`);
          return true;
        } catch (createError) {
          console.error(`❌ Erro ao criar collection: ${createError.message}`);
          return false;
        }
      } else {
        console.error(`❌ Erro ao verificar collection: ${error.message}`);
        return false;
      }
    }
  }

  chunkText(text, chunkSize = 1000, overlap = 200) {
    const chunks = [];
    let start = 0;
    const textLength = text.length;
    
    while (start < textLength) {
      const end = start + chunkSize;
      const chunk = text.substring(start, end);
      chunks.push(chunk);
      start = end - overlap;
    }
    
    return chunks;
  }

  async readMarkdownFile(filePath) {
    const content = await fs.readFile(filePath, 'utf-8');
    const filename = path.basename(filePath, '.md');
    
    // Extrai informações do conteúdo
    const lines = content.split('\n');
    let agentName = '';
    let agentRole = '';
    
    for (let i = 0; i < Math.min(20, lines.length); i++) {
      const line = lines[i];
      if (line.includes('Nome:')) {
        agentName = line.split('Nome:')[1].trim().replace(/\*\*/g, '');
      } else if (line.includes('Codinome:')) {
        agentRole = line.split('Codinome:')[1].trim().replace(/\*\*/g, '');
      }
    }
    
    return {
      filename,
      agentName,
      agentRole,
      content,
      filePath
    };
  }

  // Função simples para gerar embeddings (usando hash como aproximação)
  // NOTA: Para produção, use uma API de embeddings real (OpenAI, Cohere, etc)
  generateSimpleEmbedding(text) {
    // Esta é uma implementação simplificada
    // Para produção, use uma API de embeddings real
    const vector = new Array(VECTOR_SIZE).fill(0);
    
    // Gera um vetor baseado no hash do texto
    for (let i = 0; i < text.length; i++) {
      const charCode = text.charCodeAt(i);
      const index = (charCode * i) % VECTOR_SIZE;
      vector[index] += charCode / 1000;
    }
    
    // Normaliza o vetor
    const magnitude = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
    return vector.map(val => val / (magnitude || 1));
  }

  async uploadDocument(docData, docId) {
    const { content, filename, agentName, agentRole, filePath } = docData;
    const chunks = this.chunkText(content);
    
    console.log(`\n📄 Processando: ${filename}`);
    console.log(`   Agente: ${agentName}`);
    console.log(`   Chunks: ${chunks.length}`);
    
    const points = [];
    for (let i = 0; i < chunks.length; i++) {
      const chunk = chunks[i];
      const embedding = this.generateSimpleEmbedding(chunk);
      
      const point = {
        id: docId * 1000 + i,
        vector: embedding,
        payload: {
          filename,
          agent_name: agentName,
          agent_role: agentRole,
          chunk_index: i,
          total_chunks: chunks.length,
          content: chunk,
          file_path: filePath
        }
      };
      points.push(point);
    }
    
    // Upload em batch
    try {
      const url = `${this.qdrantUrl}/collections/${this.collectionName}/points`;
      await axios.put(url, { points });
      console.log(`   ✅ ${points.length} chunks enviados com sucesso`);
      return true;
    } catch (error) {
      console.error(`   ❌ Erro ao enviar chunks: ${error.message}`);
      return false;
    }
  }

  async uploadAllDocuments(directory) {
    try {
      const files = await fs.readdir(directory);
      const markdownFiles = files.filter(file => file.endsWith('.md'));
      
      if (markdownFiles.length === 0) {
        console.log(`❌ Nenhum arquivo .md encontrado em ${directory}`);
        return;
      }
      
      console.log(`\n🚀 Iniciando upload de ${markdownFiles.length} documentos...`);
      console.log(`📍 Qdrant URL: ${this.qdrantUrl}`);
      console.log(`📦 Collection: ${this.collectionName}`);
      
      // Cria collection
      if (!await this.createCollection()) {
        return;
      }
      
      // Upload de cada documento
      let successCount = 0;
      for (let idx = 0; idx < markdownFiles.length; idx++) {
        try {
          const filePath = path.join(directory, markdownFiles[idx]);
          const docData = await this.readMarkdownFile(filePath);
          if (await this.uploadDocument(docData, idx + 1)) {
            successCount++;
          }
        } catch (error) {
          console.error(`❌ Erro ao processar ${markdownFiles[idx]}: ${error.message}`);
        }
      }
      
      console.log(`\n✅ Upload concluído!`);
      console.log(`   Sucesso: ${successCount}/${markdownFiles.length} documentos`);
    } catch (error) {
      console.error(`❌ Erro ao ler diretório: ${error.message}`);
    }
  }

  async testSearch(query, limit = 3) {
    console.log(`\n🔍 Testando busca: '${query}'`);
    
    // Gera embedding da query
    const queryVector = this.generateSimpleEmbedding(query);
    
    try {
      const url = `${this.qdrantUrl}/collections/${this.collectionName}/points/search`;
      const response = await axios.post(url, {
        vector: queryVector,
        limit,
        with_payload: true
      });
      
      const results = response.data.result;
      console.log(`\n📊 Resultados encontrados: ${results.length}`);
      
      results.forEach((result, i) => {
        console.log(`\n${i + 1}. Score: ${result.score.toFixed(4)}`);
        console.log(`   Agente: ${result.payload.agent_name}`);
        console.log(`   Arquivo: ${result.payload.filename}`);
        console.log(`   Chunk: ${result.payload.chunk_index + 1}/${result.payload.total_chunks}`);
        console.log(`   Preview: ${result.payload.content.substring(0, 200)}...`);
      });
    } catch (error) {
      console.error(`❌ Erro na busca: ${error.message}`);
    }
  }
}

async function main() {
  console.log('='.repeat(80));
  console.log('🎼 UPLOAD DE AGENTES PARA QDRANT VECTOR DATABASE (Node.js)');
  console.log('='.repeat(80));
  
  // Configuração
  const agentsDir = __dirname; // Diretório atual (agents/)
  
  // Cria uploader
  const uploader = new QdrantUploader(QDRANT_URL, COLLECTION_NAME);
  
  // Faz upload de todos os documentos
  await uploader.uploadAllDocuments(agentsDir);
  
  // Testes de busca
  console.log('\n' + '='.repeat(80));
  console.log('🧪 TESTES DE BUSCA');
  console.log('='.repeat(80));
  
  const testQueries = [
    'Como implementar autenticação no backend?',
    'Qual a responsabilidade do iOS Senior?',
    'Como fazer deploy na AWS?',
    'Quem cuida do design system?'
  ];
  
  for (const query of testQueries) {
    await uploader.testSearch(query, 2);
  }
  
  console.log('\n' + '='.repeat(80));
  console.log('✅ PROCESSO CONCLUÍDO!');
  console.log('='.repeat(80));
  console.log('\n⚠️  NOTA IMPORTANTE:');
  console.log('Este script usa embeddings simplificados baseados em hash.');
  console.log('Para produção, use uma API de embeddings real (OpenAI, Cohere, etc).');
  console.log('Veja o arquivo README_QDRANT.md para mais informações.');
}

// Executa o script
main().catch(error => {
  console.error('❌ Erro fatal:', error);
  process.exit(1);
});
