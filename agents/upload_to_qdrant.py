"""
Script para fazer upload dos documentos dos agentes para o Qdrant Vector Database
Autor: Sistema de Agentes - Projeto Cirurgião
Data: 2025-01-07
"""

import os
import json
from pathlib import Path
from typing import List, Dict
import requests
from sentence_transformers import SentenceTransformer

# Configurações
QDRANT_URL = "http://qdrant.agencia.bot:6333"
COLLECTION_NAME = "agentes_cirurgiao"
EMBEDDING_MODEL = "sentence-transformers/all-MiniLM-L6-v2"  # Modelo leve e eficiente

class QdrantUploader:
    def __init__(self, qdrant_url: str, collection_name: str):
        self.qdrant_url = qdrant_url
        self.collection_name = collection_name
        self.model = SentenceTransformer(EMBEDDING_MODEL)
        self.vector_size = 384  # Tamanho do vetor do modelo all-MiniLM-L6-v2
        
    def create_collection(self):
        """Cria a collection no Qdrant se não existir"""
        url = f"{self.qdrant_url}/collections/{self.collection_name}"
        
        # Verifica se collection já existe
        response = requests.get(url)
        if response.status_code == 200:
            print(f"✅ Collection '{self.collection_name}' já existe")
            return True
        
        # Cria nova collection
        payload = {
            "vectors": {
                "size": self.vector_size,
                "distance": "Cosine"
            }
        }
        
        response = requests.put(url, json=payload)
        if response.status_code in [200, 201]:
            print(f"✅ Collection '{self.collection_name}' criada com sucesso")
            return True
        else:
            print(f"❌ Erro ao criar collection: {response.text}")
            return False
    
    def chunk_text(self, text: str, chunk_size: int = 1000, overlap: int = 200) -> List[str]:
        """Divide o texto em chunks menores com overlap"""
        chunks = []
        start = 0
        text_length = len(text)
        
        while start < text_length:
            end = start + chunk_size
            chunk = text[start:end]
            chunks.append(chunk)
            start = end - overlap
        
        return chunks
    
    def read_markdown_file(self, file_path: str) -> Dict:
        """Lê arquivo markdown e extrai metadados"""
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Extrai nome do agente do nome do arquivo
        filename = Path(file_path).stem
        
        # Tenta extrair informações do conteúdo
        lines = content.split('\n')
        agent_name = ""
        agent_role = ""
        
        for line in lines[:20]:  # Procura nas primeiras 20 linhas
            if "Nome:" in line:
                agent_name = line.split("Nome:")[-1].strip().replace("**", "")
            elif "Codinome:" in line:
                agent_role = line.split("Codinome:")[-1].strip().replace("**", "")
        
        return {
            "filename": filename,
            "agent_name": agent_name,
            "agent_role": agent_role,
            "content": content,
            "file_path": file_path
        }
    
    def upload_document(self, doc_data: Dict, doc_id: int):
        """Faz upload de um documento para o Qdrant"""
        content = doc_data["content"]
        chunks = self.chunk_text(content)
        
        print(f"\n📄 Processando: {doc_data['filename']}")
        print(f"   Agente: {doc_data['agent_name']}")
        print(f"   Chunks: {len(chunks)}")
        
        points = []
        for i, chunk in enumerate(chunks):
            # Gera embedding
            embedding = self.model.encode(chunk).tolist()
            
            # Cria ponto
            point = {
                "id": doc_id * 1000 + i,  # ID único para cada chunk
                "vector": embedding,
                "payload": {
                    "filename": doc_data["filename"],
                    "agent_name": doc_data["agent_name"],
                    "agent_role": doc_data["agent_role"],
                    "chunk_index": i,
                    "total_chunks": len(chunks),
                    "content": chunk,
                    "file_path": doc_data["file_path"]
                }
            }
            points.append(point)
        
        # Upload em batch
        url = f"{self.qdrant_url}/collections/{self.collection_name}/points"
        payload = {"points": points}
        
        response = requests.put(url, json=payload)
        if response.status_code in [200, 201]:
            print(f"   ✅ {len(points)} chunks enviados com sucesso")
            return True
        else:
            print(f"   ❌ Erro ao enviar chunks: {response.text}")
            return False
    
    def upload_all_documents(self, directory: str):
        """Faz upload de todos os documentos markdown do diretório"""
        directory_path = Path(directory)
        markdown_files = list(directory_path.glob("*.md"))
        
        if not markdown_files:
            print(f"❌ Nenhum arquivo .md encontrado em {directory}")
            return
        
        print(f"\n🚀 Iniciando upload de {len(markdown_files)} documentos...")
        print(f"📍 Qdrant URL: {self.qdrant_url}")
        print(f"📦 Collection: {self.collection_name}")
        
        # Cria collection
        if not self.create_collection():
            return
        
        # Upload de cada documento
        success_count = 0
        for idx, file_path in enumerate(markdown_files, 1):
            try:
                doc_data = self.read_markdown_file(str(file_path))
                if self.upload_document(doc_data, idx):
                    success_count += 1
            except Exception as e:
                print(f"❌ Erro ao processar {file_path.name}: {str(e)}")
        
        print(f"\n✅ Upload concluído!")
        print(f"   Sucesso: {success_count}/{len(markdown_files)} documentos")
    
    def test_search(self, query: str, limit: int = 3):
        """Testa a busca no Qdrant"""
        print(f"\n🔍 Testando busca: '{query}'")
        
        # Gera embedding da query
        query_vector = self.model.encode(query).tolist()
        
        # Busca no Qdrant
        url = f"{self.qdrant_url}/collections/{self.collection_name}/points/search"
        payload = {
            "vector": query_vector,
            "limit": limit,
            "with_payload": True
        }
        
        response = requests.post(url, json=payload)
        if response.status_code == 200:
            results = response.json()["result"]
            print(f"\n📊 Resultados encontrados: {len(results)}")
            for i, result in enumerate(results, 1):
                print(f"\n{i}. Score: {result['score']:.4f}")
                print(f"   Agente: {result['payload']['agent_name']}")
                print(f"   Arquivo: {result['payload']['filename']}")
                print(f"   Chunk: {result['payload']['chunk_index'] + 1}/{result['payload']['total_chunks']}")
                print(f"   Preview: {result['payload']['content'][:200]}...")
        else:
            print(f"❌ Erro na busca: {response.text}")


def main():
    """Função principal"""
    print("=" * 80)
    print("🎼 UPLOAD DE AGENTES PARA QDRANT VECTOR DATABASE")
    print("=" * 80)
    
    # Configuração
    agents_dir = Path(__file__).parent  # Diretório atual (agents/)
    
    # Cria uploader
    uploader = QdrantUploader(QDRANT_URL, COLLECTION_NAME)
    
    # Faz upload de todos os documentos
    uploader.upload_all_documents(str(agents_dir))
    
    # Testes de busca
    print("\n" + "=" * 80)
    print("🧪 TESTES DE BUSCA")
    print("=" * 80)
    
    test_queries = [
        "Como implementar autenticação no backend?",
        "Qual a responsabilidade do iOS Senior?",
        "Como fazer deploy na AWS?",
        "Quem cuida do design system?"
    ]
    
    for query in test_queries:
        uploader.test_search(query, limit=2)
    
    print("\n" + "=" * 80)
    print("✅ PROCESSO CONCLUÍDO!")
    print("=" * 80)


if __name__ == "__main__":
    main()
