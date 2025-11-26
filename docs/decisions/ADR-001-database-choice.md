# ADR-001: Escolha de Banco de Dados

## Status
✅ **APROVADO** - 09/11/2025

## Contexto

O Projeto Cirurgião é uma plataforma educacional que precisa armazenar:
- Dados de usuários e autenticação
- Cursos, módulos e vídeos
- Progresso dos alunos
- Sistema de gamificação (XP, conquistas, desafios)
- Fórum (posts, respostas, votos)
- Notificações
- Analytics e métricas

### Requisitos Principais
1. **Transações ACID**: Necessário para integridade de dados (pagamentos, progresso)
2. **Relações Complexas**: Muitos relacionamentos entre entidades (usuários, cursos, progresso)
3. **Escalabilidade**: Suporte para crescimento de 1K → 100K+ usuários
4. **Performance**: Queries rápidas (< 100ms p95)
5. **Backup e Recovery**: Dados críticos de usuários
6. **Compatibilidade GCP**: Integração nativa com Google Cloud Platform

## Decisão

**Escolhemos PostgreSQL 15 como banco de dados principal.**

### Justificativa

#### ✅ Vantagens do PostgreSQL

1. **ACID Compliant**
   - Transações robustas para operações críticas
   - Integridade referencial garantida
   - Isolamento de transações

2. **Relações Complexas**
   - Suporte nativo a JOINs complexos
   - Foreign keys e constraints
   - Índices avançados (B-tree, GiST, GIN)

3. **Tipos de Dados Avançados**
   - JSONB para dados flexíveis (configurações, metadata)
   - Arrays para tags e listas
   - Full-text search nativo

4. **Performance**
   - Otimizador de queries maduro
   - Suporte a particionamento
   - Índices parciais e expressões

5. **Ecossistema**
   - Excelente suporte no GCP (Cloud SQL)
   - ORMs maduros (Prisma, TypeORM)
   - Ferramentas de monitoramento

6. **Custo-Benefício**
   - Open source (sem licenças)
   - Managed service no GCP
   - Escalabilidade vertical e horizontal

#### ❌ Alternativas Consideradas

**MySQL/MariaDB**
- ❌ Menos recursos avançados (JSONB, full-text search)
- ❌ Transações menos robustas
- ✅ Mais popular, mas não oferece vantagens significativas

**MongoDB**
- ❌ Sem transações ACID completas (até recentemente)
- ❌ Relações complexas são difíceis
- ❌ Não adequado para dados financeiros
- ✅ Bom para dados não estruturados (não é nosso caso)

**Cloud Spanner**
- ❌ Custo muito alto para início
- ❌ Complexidade desnecessária
- ✅ Escalabilidade global (não precisamos ainda)

## Arquitetura de Dados

### Estrutura Principal

```
┌─────────────────────────────────────────────────┐
│           PostgreSQL 15 (Cloud SQL)             │
├─────────────────────────────────────────────────┤
│                                                 │
│  ┌──────────────┐  ┌──────────────┐            │
│  │   Users      │  │   Courses    │            │
│  │   Auth       │  │   Modules    │            │
│  │   Profiles   │  │   Videos     │            │
│  └──────────────┘  └──────────────┘            │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐            │
│  │ Gamification │  │    Forum     │            │
│  │   Progress   │  │    Posts     │            │
│  │ Achievements │  │   Replies    │            │
│  └──────────────┘  └──────────────┘            │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐            │
│  │Notifications │  │Subscriptions │            │
│  │   Devices    │  │   Payments   │            │
│  └──────────────┘  └──────────────┘            │
│                                                 │
└─────────────────────────────────────────────────┘
```

### Estratégia de Escalabilidade

**Fase 1 (0-10K usuários):**
- Single instance PostgreSQL
- Vertical scaling (CPU/RAM)
- Índices otimizados

**Fase 2 (10K-50K usuários):**
- Read replicas (1-2)
- Connection pooling (PgBouncer)
- Query optimization

**Fase 3 (50K-100K+ usuários):**
- Multiple read replicas (3-5)
- Particionamento de tabelas grandes
- Caching agressivo (Redis)

## Configuração GCP

### Cloud SQL PostgreSQL

```yaml
Tier: db-custom-2-7680 (2 vCPU, 7.5 GB RAM)
Storage: 100 GB SSD (auto-resize enabled)
Backups: Automated daily + point-in-time recovery
High Availability: Enabled (regional)
Maintenance Window: Sunday 2-6 AM (BRT)
```

### Custos Estimados

| Fase | Usuários | Configuração | Custo/mês |
|------|----------|--------------|-----------|
| MVP | 0-1K | db-f1-micro | $10 |
| Beta | 1K-10K | db-custom-2-7680 | $150 |
| Launch | 10K-50K | db-custom-4-15360 + 2 replicas | $500 |
| Scale | 50K+ | db-custom-8-30720 + 5 replicas | $1,500 |

## ORM e Migrations

### Prisma como ORM Principal

**Vantagens:**
- Type-safe queries
- Auto-generated types
- Migrations automáticas
- Excelente DX (Developer Experience)
- Suporte a PostgreSQL avançado

**Exemplo de Schema:**

```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password      String
  name          String
  role          UserRole @default(STUDENT)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  progress      Progress[]
  achievements  Achievement[]
  forumPosts    ForumPost[]
  
  @@map("users")
  @@index([email])
}

model Course {
  id          String   @id @default(uuid())
  title       String
  description String
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
  
  modules  Module[]
  progress Progress[]
  
  @@map("courses")
  @@index([isPublished])
}
```

## Backup e Recovery

### Estratégia de Backup

1. **Automated Backups**
   - Daily full backups (retained 30 days)
   - Point-in-time recovery (7 days)
   - Stored in multi-region GCS bucket

2. **Manual Backups**
   - Before major migrations
   - Before production deploys
   - Retained 90 days

3. **Disaster Recovery**
   - RTO (Recovery Time Objective): < 1 hour
   - RPO (Recovery Point Objective): < 5 minutes
   - Automated failover to standby instance

## Monitoramento

### Métricas Principais

- **Performance**
  - Query execution time (p50, p95, p99)
  - Connection pool usage
  - Cache hit ratio
  - Index usage

- **Disponibilidade**
  - Uptime
  - Replication lag
  - Failed connections

- **Recursos**
  - CPU usage
  - Memory usage
  - Disk I/O
  - Storage usage

### Alertas

```yaml
Critical:
  - CPU > 80% for 5 minutes
  - Disk > 90% full
  - Replication lag > 30 seconds
  - Connection pool exhausted

Warning:
  - CPU > 60% for 10 minutes
  - Slow queries > 1 second
  - Failed connections > 10/minute
```

## Segurança

### Medidas de Segurança

1. **Network**
   - Private IP only
   - VPC peering com GKE
   - SSL/TLS obrigatório

2. **Autenticação**
   - IAM authentication
   - Passwords fortes (rotação 90 dias)
   - Least privilege principle

3. **Encryption**
   - At rest: Google-managed keys
   - In transit: TLS 1.3
   - Backups encrypted

4. **Auditoria**
   - Query logs enabled
   - Connection logs
   - Admin activity logs

## Consequências

### ✅ Positivas

1. **Confiabilidade**: ACID garante integridade de dados
2. **Performance**: Queries otimizadas e índices avançados
3. **Escalabilidade**: Suporte a read replicas e particionamento
4. **Ecossistema**: Ferramentas maduras e comunidade ativa
5. **Custo**: Open source, sem licenças

### ⚠️ Negativas

1. **Complexidade**: Requer conhecimento de SQL avançado
2. **Escalabilidade Horizontal**: Mais difícil que NoSQL
3. **Schema Rígido**: Migrations necessárias para mudanças
4. **Custo de Escala**: Read replicas aumentam custo

### 🔄 Mitigações

1. **Complexidade**: Usar Prisma para abstrair SQL
2. **Escalabilidade**: Implementar caching (Redis) agressivo
3. **Schema**: Usar JSONB para dados flexíveis
4. **Custo**: Monitorar uso e otimizar queries

## Implementação

### Fase 1: Setup Inicial (Semana 1)

```bash
# Criar instância Cloud SQL
gcloud sql instances create cirurgiao-db \
  --database-version=POSTGRES_15 \
  --tier=db-custom-2-7680 \
  --region=us-central1 \
  --backup \
  --enable-bin-log

# Criar banco de dados
gcloud sql databases create cirurgiao_prod \
  --instance=cirurgiao-db

# Configurar usuário
gcloud sql users create app_user \
  --instance=cirurgiao-db \
  --password=<secure-password>
```

### Fase 2: Prisma Setup (Semana 1-2)

```bash
# Instalar Prisma
npm install @prisma/client
npm install -D prisma

# Inicializar Prisma
npx prisma init

# Criar schema inicial
# (ver exemplo acima)

# Gerar migration
npx prisma migrate dev --name init

# Gerar client
npx prisma generate
```

## Revisão e Aprovação

- **Autor**: TECH-LEAD-01 (Ricardo)
- **Revisores**: BACKEND-SENIOR-01 (Rafael), DEVOPS-01 (Carolina)
- **Aprovador**: PO-01 (Ana Paula)
- **Data de Aprovação**: 09/11/2025

## Referências

- [PostgreSQL Documentation](https://www.postgresql.org/docs/15/)
- [GCP Cloud SQL](https://cloud.google.com/sql/docs/postgres)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Database Scaling Patterns](https://martinfowler.com/articles/patterns-of-distributed-systems/)

---

**Próxima Revisão**: Semana 12 (após 10K usuários)
