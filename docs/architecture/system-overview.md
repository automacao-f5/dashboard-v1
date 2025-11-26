# 📐 Arquitetura Geral do Sistema - Projeto Cirurgião

## Status
✅ **APROVADO** - 09/11/2025

## Visão Geral

O Projeto Cirurgião é uma plataforma educacional multi-plataforma (Web, iOS, Android) para ensino de cirurgia através de vídeos, gamificação e comunidade.

### Princípios Arquiteturais

1. **Cloud-Native**: Infraestrutura 100% em cloud (GCP + Cloudflare)
2. **API-First**: Backend expõe APIs RESTful para todos os clientes
3. **Microservices-Ready**: Arquitetura modular preparada para evolução
4. **Scalable**: Projetado para escalar de 1K → 100K+ usuários
5. **Secure**: Segurança em todas as camadas
6. **Observable**: Monitoramento e logging completos

## Arquitetura de Alto Nível

```
┌─────────────────────────────────────────────────────────────────┐
│                        PROJETO CIRURGIÃO                         │
│                    ARQUITETURA DE ALTO NÍVEL                     │
└─────────────────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────────────────┐
│                         CAMADA DE CLIENTES                        │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐         │
│  │   Web App   │    │   iOS App   │    │ Android App │         │
│  │  (Next.js)  │    │   (Swift)   │    │  (Kotlin)   │         │
│  │             │    │             │    │             │         │
│  │  - React    │    │  - SwiftUI  │    │  - Compose  │         │
│  │  - Tailwind │    │  - MVVM     │    │  - MVVM     │         │
│  │  - shadcn   │    │  - Combine  │    │  - Flow     │         │
│  └─────────────┘    └─────────────┘    └─────────────┘         │
│                                                                   │
└───────────────────────────┬───────────────────────────────────────┘
                            │
                            │ HTTPS / REST API
                            │
┌───────────────────────────▼───────────────────────────────────────┐
│                         CAMADA DE API                             │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │              Backend API (Node.js + NestJS)                │  │
│  │                                                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │  │
│  │  │   Auth   │  │  Courses │  │  Videos  │  │  Users   │ │  │
│  │  │  Module  │  │  Module  │  │  Module  │  │  Module  │ │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │  │
│  │                                                            │  │
│  │  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │  │
│  │  │Gamifica- │  │  Forum   │  │Analytics │  │  Notif.  │ │  │
│  │  │   tion   │  │  Module  │  │  Module  │  │  Module  │ │  │
│  │  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │  │
│  │                                                            │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │           Shared Services & Utilities              │  │  │
│  │  │  - Validation  - Logging  - Error Handling         │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
└───────────────────────────┬───────────────────────────────────────┘
                            │
                            │
┌───────────────────────────▼───────────────────────────────────────┐
│                    CAMADA DE SERVIÇOS EXTERNOS                    │
├──────────────────────────────────────────────────────────────────┤
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │   Cloudflare     │  │   Google Cloud   │  │    Redis      │  │
│  │                  │  │    Platform      │  │               │  │
│  │  - Stream        │  │  - Cloud SQL     │  │  - Cache      │  │
│  │  - R2 Storage    │  │  - BigQuery      │  │  - Sessions   │  │
│  │  - CDN           │  │  - Cloud Run     │  │  - Realtime   │  │
│  │  - Analytics     │  │  - Secret Mgr    │  │               │  │
│  └──────────────────┘  └──────────────────┘  └───────────────┘  │
│                                                                   │
│  ┌──────────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │    Firebase      │  │     OpenAI       │  │    Stripe     │  │
│  │                  │  │                  │  │               │  │
│  │  - FCM (Push)    │  │  - GPT-4         │  │  - Payments   │  │
│  │  - Crashlytics   │  │  - Embeddings    │  │  - Billing    │  │
│  │  - Analytics     │  │  - Moderation    │  │               │  │
│  └──────────────────┘  └──────────────────┘  └───────────────┘  │
│                                                                   │
└──────────────────────────────────────────────────────────────────┘
```

## Stack Tecnológico Completo

### Backend

```yaml
Runtime: Node.js 20 LTS
Framework: NestJS 10
Language: TypeScript 5

Database:
  Primary: PostgreSQL 15 (Cloud SQL)
  Cache: Redis 7 (Memorystore)
  Analytics: BigQuery

ORM: Prisma 5
Validation: class-validator + class-transformer
Authentication: JWT + Passport
API Documentation: Swagger/OpenAPI

Testing:
  Unit: Jest
  Integration: Supertest
  E2E: Playwright

Monitoring:
  Logging: Winston + Cloud Logging
  Metrics: Prometheus
  Tracing: OpenTelemetry
  APM: Cloud Trace
```

### Frontend Web

```yaml
Framework: Next.js 14 (App Router)
Language: TypeScript 5
UI Library: React 18

Styling:
  Framework: Tailwind CSS 3
  Components: shadcn/ui
  Icons: Lucide React

State Management:
  Global: Zustand
  Server: React Query (TanStack Query)
  Forms: React Hook Form + Zod

Testing:
  Unit: Jest + React Testing Library
  E2E: Playwright
  Visual: Chromatic (Storybook)

Build:
  Bundler: Turbopack
  Deployment: Vercel / Cloud Run
```

### Mobile iOS

```yaml
Language: Swift 5.9
UI Framework: SwiftUI
Architecture: MVVM + Combine

Networking:
  HTTP: URLSession + Async/Await
  WebSocket: Starscream

Storage:
  Local: SwiftData
  Secure: Keychain
  Cache: NSCache

Dependencies: Swift Package Manager

Testing:
  Unit: XCTest
  UI: XCUITest
  Snapshot: SnapshotTesting

Analytics:
  Firebase Analytics
  Firebase Crashlytics
```

### Mobile Android

```yaml
Language: Kotlin 1.9
UI Framework: Jetpack Compose
Architecture: MVVM + Flow

Networking:
  HTTP: Retrofit + OkHttp
  Serialization: Kotlinx Serialization

Storage:
  Local: Room
  Secure: EncryptedSharedPreferences
  Cache: DataStore

Dependencies: Gradle + Version Catalogs

Testing:
  Unit: JUnit + Mockk
  UI: Compose Testing
  Integration: Espresso

Analytics:
  Firebase Analytics
  Firebase Crashlytics
```

### DevOps & Infrastructure

```yaml
Cloud Provider: Google Cloud Platform
CDN: Cloudflare

CI/CD:
  Platform: GitHub Actions
  Container Registry: Artifact Registry
  Deployment: Cloud Run

Infrastructure as Code:
  Tool: Terraform
  State: GCS Backend

Monitoring:
  Metrics: Cloud Monitoring + Grafana
  Logs: Cloud Logging
  Alerts: Cloud Alerting
  Uptime: Cloud Monitoring

Security:
  Secrets: Secret Manager
  SSL/TLS: Cloudflare + Let's Encrypt
  WAF: Cloudflare WAF
  DDoS: Cloudflare DDoS Protection
```

## Fluxo de Dados

### 1. Autenticação

```
┌─────────┐                                    ┌─────────┐
│ Cliente │                                    │   API   │
└────┬────┘                                    └────┬────┘
     │                                              │
     │  1. POST /auth/login                        │
     │  { email, password }                        │
     ├────────────────────────────────────────────>│
     │                                              │
     │                                              │  2. Validate
     │                                              │     credentials
     │                                              │
     │                                              │  3. Generate
     │                                              │     JWT tokens
     │                                              │
     │  4. { accessToken, refreshToken, user }     │
     │<────────────────────────────────────────────┤
     │                                              │
     │  5. Store tokens                            │
     │     (localStorage/Keychain/DataStore)       │
     │                                              │
     │  6. Subsequent requests                     │
     │     Authorization: Bearer {accessToken}     │
     ├────────────────────────────────────────────>│
     │                                              │
     │  7. Validate token                          │
     │                                              │
     │  8. Response                                │
     │<────────────────────────────────────────────┤
     │                                              │
```

### 2. Upload e Streaming de Vídeo

```
┌───────┐         ┌─────┐         ┌────────────┐         ┌──────────┐
│ Admin │         │ API │         │ Cloudflare │         │ Database │
└───┬───┘         └──┬──┘         │   Stream   │         └────┬─────┘
    │                │             └─────┬──────┘              │
    │ 1. Upload      │                   │                     │
    │    video       │                   │                     │
    ├───────────────>│                   │                     │
    │                │                   │                     │
    │                │ 2. Upload to      │                     │
    │                │    Cloudflare     │                     │
    │                ├──────────────────>│                     │
    │                │                   │                     │
    │                │                   │ 3. Transcode        │
    │                │                   │    (async)          │
    │                │                   │                     │
    │                │ 4. Save metadata  │                     │
    │                ├─────────────────────────────────────────>│
    │                │                   │                     │
    │ 5. Return      │                   │                     │
    │    video ID    │                   │                     │
    │<───────────────┤                   │                     │
    │                │                   │                     │
    │                │ 6. Webhook:       │                     │
    │                │    ready          │                     │
    │                │<──────────────────┤                     │
    │                │                   │                     │
    │                │ 7. Update status  │                     │
    │                ├─────────────────────────────────────────>│
    │                │                   │                     │
```

### 3. Visualização de Vídeo

```
┌────────┐         ┌─────┐         ┌────────────┐
│ Client │         │ API │         │ Cloudflare │
└───┬────┘         └──┬──┘         │   Stream   │
    │                 │             └─────┬──────┘
    │ 1. Request      │                   │
    │    video        │                   │
    ├────────────────>│                   │
    │                 │                   │
    │                 │ 2. Generate       │
    │                 │    signed URL     │
    │                 ├──────────────────>│
    │                 │                   │
    │                 │ 3. Signed URL     │
    │                 │<──────────────────┤
    │                 │                   │
    │ 4. Return URL   │                   │
    │<────────────────┤                   │
    │                 │                   │
    │ 5. Stream video │                   │
    │    (HLS)        │                   │
    ├─────────────────────────────────────>│
    │                 │                   │
    │ 6. Video chunks │                   │
    │<─────────────────────────────────────┤
    │                 │                   │
    │ 7. Track        │                   │
    │    progress     │                   │
    ├────────────────>│                   │
    │                 │                   │
```

## Segurança

### Camadas de Segurança

```
┌─────────────────────────────────────────────────────────┐
│                    CAMADA 1: REDE                        │
│  - Cloudflare WAF                                        │
│  - DDoS Protection                                       │
│  - Rate Limiting                                         │
│  - SSL/TLS 1.3                                           │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                 CAMADA 2: APLICAÇÃO                      │
│  - JWT Authentication                                    │
│  - RBAC (Role-Based Access Control)                     │
│  - Input Validation (Zod)                               │
│  - SQL Injection Prevention (Prisma)                    │
│  - XSS Protection                                        │
│  - CSRF Protection                                       │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                   CAMADA 3: DADOS                        │
│  - Encryption at Rest (Google-managed keys)             │
│  - Encryption in Transit (TLS)                          │
│  - Database Access Control (IAM)                        │
│  - Secrets Management (Secret Manager)                  │
│  - Backup Encryption                                     │
└─────────────────────────────────────────────────────────┘
                            │
┌─────────────────────────────────────────────────────────┐
│                CAMADA 4: MONITORAMENTO                   │
│  - Audit Logs                                            │
│  - Security Alerts                                       │
│  - Anomaly Detection                                     │
│  - Compliance Monitoring (LGPD)                         │
└─────────────────────────────────────────────────────────┘
```

### Autenticação e Autorização

```typescript
// JWT Payload
interface JWTPayload {
  sub: string; // User ID
  email: string;
  role: 'ADMIN' | 'INSTRUCTOR' | 'STUDENT';
  iat: number; // Issued at
  exp: number; // Expires at
}

// Access Token: 15 minutos
// Refresh Token: 7 dias

// RBAC Permissions
const permissions = {
  ADMIN: [
    'courses:create',
    'courses:update',
    'courses:delete',
    'users:manage',
    'analytics:view',
  ],
  INSTRUCTOR: [
    'courses:create',
    'courses:update',
    'analytics:view',
  ],
  STUDENT: [
    'courses:view',
    'progress:update',
  ],
};
```

## Escalabilidade

### Estratégia de Escalabilidade

```
┌─────────────────────────────────────────────────────────┐
│                    FASE 1: 0-10K USUÁRIOS                │
│                                                           │
│  Backend:      1 instância Cloud Run (2 vCPU, 4GB)      │
│  Database:     db-custom-2-7680 (single instance)       │
│  Redis:        1GB instance                              │
│  Cloudflare:   Padrão                                    │
│                                                           │
│  Custo/mês:    ~$300                                     │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                  FASE 2: 10K-50K USUÁRIOS                │
│                                                           │
│  Backend:      Auto-scaling (2-5 instâncias)            │
│  Database:     db-custom-4-15360 + 2 read replicas      │
│  Redis:        5GB instance                              │
│  Cloudflare:   Pro plan                                  │
│                                                           │
│  Custo/mês:    ~$1,500                                   │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                 FASE 3: 50K-100K+ USUÁRIOS               │
│                                                           │
│  Backend:      Auto-scaling (5-20 instâncias)           │
│  Database:     db-custom-8-30720 + 5 read replicas      │
│  Redis:        Redis Cluster (20GB)                      │
│  Cloudflare:   Business plan                             │
│  CDN:          Cloudflare + GCP CDN                      │
│                                                           │
│  Custo/mês:    ~$5,000                                   │
└─────────────────────────────────────────────────────────┘
```

### Pontos de Escalabilidade

1. **Backend API**
   - Stateless (permite horizontal scaling)
   - Auto-scaling baseado em CPU/Memory
   - Load balancing automático (Cloud Run)

2. **Database**
   - Read replicas para queries de leitura
   - Connection pooling (PgBouncer)
   - Query optimization e índices

3. **Cache**
   - Redis para dados frequentes
   - CDN para assets estáticos
   - Browser caching

4. **Storage**
   - Cloudflare R2 (ilimitado)
   - CDN global (300+ localizações)

## Performance

### Targets de Performance

| Métrica | Target | Medição |
|---------|--------|---------|
| API Response Time (p95) | < 100ms | Cloud Monitoring |
| Page Load Time | < 2s | Lighthouse |
| Video Start Time | < 3s | Cloudflare Analytics |
| Database Query Time (p95) | < 50ms | Prisma Metrics |
| Cache Hit Rate | > 80% | Redis INFO |

### Otimizações

1. **Backend**
   - Query optimization (índices, joins)
   - N+1 query prevention
   - Response compression (gzip)
   - API pagination

2. **Frontend**
   - Code splitting
   - Lazy loading
   - Image optimization (Next.js Image)
   - Bundle size optimization

3. **Mobile**
   - Image caching
   - Offline support
   - Background sync
   - Battery optimization

4. **Database**
   - Índices estratégicos
   - Materialized views
   - Particionamento (futuro)
   - Query caching

## Monitoramento e Observabilidade

### Stack de Observabilidade

```
┌─────────────────────────────────────────────────────────┐
│                         LOGS                             │
│  - Cloud Logging (GCP)                                   │
│  - Structured logging (JSON)                             │
│  - Log levels: ERROR, WARN, INFO, DEBUG                 │
│  - Retention: 30 days                                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                       METRICS                            │
│  - Cloud Monitoring (GCP)                                │
│  - Prometheus (custom metrics)                           │
│  - Grafana dashboards                                    │
│  - Real-time alerting                                    │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                       TRACING                            │
│  - Cloud Trace (GCP)                                     │
│  - OpenTelemetry                                         │
│  - Distributed tracing                                   │
│  - Performance profiling                                 │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│                    ERROR TRACKING                        │
│  - Sentry (Backend + Frontend)                           │
│  - Firebase Crashlytics (Mobile)                         │
│  - Error aggregation                                     │
│  - Source maps                                           │
└─────────────────────────────────────────────────────────┘
```

### Dashboards Principais

1. **System Health**
   - Uptime
   - Error rate
   - Response time
   - Request rate

2. **Business Metrics**
   - DAU/MAU
   - Video views
   - Completion rate
   - Revenue (MRR)

3. **Infrastructure**
   - CPU/Memory usage
   - Database connections
   - Cache hit rate
   - Storage usage

## Disaster Recovery

### Estratégia de Backup

```yaml
Database (PostgreSQL):
  Automated Backups: Daily
  Retention: 30 days
  Point-in-Time Recovery: 7 days
  Manual Backups: Before major changes
  
Storage (Cloudflare R2):
  Versioning: Enabled
  Replication: Multi-region
  Retention: Indefinite
  
Redis:
  Snapshots: Every 6 hours
  Retention: 7 days
  AOF: Enabled
```

### Recovery Objectives

- **RTO (Recovery Time Objective)**: < 1 hora
- **RPO (Recovery Point Objective)**: < 5 minutos

### Plano de Disaster Recovery

1. **Database Failure**
   - Automatic failover to standby (< 1 min)
   - Restore from backup (< 30 min)

2. **Application Failure**
   - Auto-healing (Cloud Run)
   - Rollback to previous version (< 5 min)

3. **Region Failure**
   - Failover to secondary region (manual)
   - DNS update (< 10 min)

## Conformidade e Privacidade

### LGPD Compliance

1. **Consentimento**
   - Opt-in explícito
   - Termos de uso claros
   - Política de privacidade

2. **Direitos do Usuário**
   - Acesso aos dados
   - Correção de dados
   - Exclusão de dados (direito ao esquecimento)
   - Portabilidade de dados

3. **Segurança**
   - Encryption at rest
   - Encryption in transit
   - Access control
   - Audit logs

4. **Retenção de Dados**
   - Dados de usuário: Até exclusão da conta
   - Logs: 30 dias
   - Analytics: 2 anos
   - Backups: 30 dias

## Próximos Passos

### Semana 1 (Atual)
- ✅ Definir arquitetura
- ✅ Criar ADRs
- ✅ Documentar stack
- [ ] Setup de repositórios
- [ ] Configurar CI/CD básico

### Semana 2
- [ ] Implementar autenticação
- [ ] Setup de banco de dados
- [ ] Criar telas de login

### Semanas 3-4
- [ ] Integrar Cloudflare Stream
- [ ] Implementar upload de vídeos
- [ ] Criar dashboard admin

## Revisão e Aprovação

- **Autor**: TECH-LEAD-01 (Ricardo)
- **Revisores**: BACKEND-SENIOR-01 (Rafael), DEVOPS-01 (Carolina), PO-01 (Ana Paula)
- **Data de Aprovação**: 09/11/2025

## Referências

- [ADR-001: Database Choice](../decisions/ADR-001-database-choice.md)
- [ADR-002: Analytics Strategy](../decisions/ADR-002-analytics-strategy.md)
- [ADR-003: Video Streaming Strategy](../decisions/ADR-003-video-streaming-strategy.md)
- [The Twelve-Factor App](https://12factor.net/)
- [Google Cloud Architecture Framework](https://cloud.google.com/architecture/framework)

---

**Última Atualização**: 09/11/2025  
**Versão**: 1.0
