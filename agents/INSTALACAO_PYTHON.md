# 🐍 Guia de Instalação do Python no Windows

## ⚠️ Python Não Encontrado

O erro indica que Python não está instalado ou não está no PATH do Windows.

## 📥 OPÇÃO 1: Instalar Python (Recomendado)

### 1. Download do Python

Baixe a versão mais recente do Python:
- **Link:** https://www.python.org/downloads/
- **Versão recomendada:** Python 3.11 ou 3.12

### 2. Instalação

1. Execute o instalador baixado
2. ⚠️ **IMPORTANTE:** Marque a opção **"Add Python to PATH"**
3. Clique em "Install Now"
4. Aguarde a instalação

### 3. Verificar Instalação

Abra um **novo** PowerShell e execute:

```powershell
python --version
pip --version
```

Deve mostrar algo como:
```
Python 3.11.x
pip 23.x.x
```

### 4. Instalar Dependências

```powershell
cd D:\dashboard\next-shadcn-admin-dashboard-main\agents
pip install -r requirements.txt
```

### 5. Executar Script

```powershell
python upload_to_qdrant.py
```

---

## 🚀 OPÇÃO 2: Usar Node.js (Alternativa)

Como você já tem Node.js instalado, criei uma versão alternativa do script em JavaScript!

### Vantagens:
- ✅ Não precisa instalar Python
- ✅ Usa ferramentas que você já tem
- ✅ Mais rápido para começar

### Como usar:

```powershell
cd D:\dashboard\next-shadcn-admin-dashboard-main\agents
npm install
node upload_to_qdrant.js
```

Veja o arquivo `upload_to_qdrant.js` que criei para você!

---

## 🔧 OPÇÃO 3: Usar Python Portable (Sem Instalação)

Se não quiser instalar Python no sistema:

1. Baixe Python Portable: https://www.python.org/ftp/python/3.11.0/python-3.11.0-embed-amd64.zip
2. Extraia para uma pasta (ex: `C:\Python311`)
3. Use o caminho completo:

```powershell
C:\Python311\python.exe -m pip install -r requirements.txt
C:\Python311\python.exe upload_to_qdrant.py
```

---

## 🐛 Troubleshooting

### Erro: "pip não é reconhecido"

Mesmo após instalar Python, se `pip` não funcionar:

```powershell
python -m pip install -r requirements.txt
python -m pip --version
```

### Erro: "Acesso negado"

Execute PowerShell como Administrador:
1. Clique com botão direito no PowerShell
2. "Executar como administrador"
3. Tente novamente

### Python instalado mas não funciona

Reinicie o computador após instalar Python para atualizar o PATH.

---

## ✅ Recomendação

**Use a OPÇÃO 2 (Node.js)** - É mais rápido e você já tem tudo instalado!

Veja o arquivo `upload_to_qdrant.js` que criei.
