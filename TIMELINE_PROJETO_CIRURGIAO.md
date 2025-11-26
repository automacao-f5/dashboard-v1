# 📅 TIMELINE DETALHADA - PROJETO CIRURGIÃO

## 📊 VISÃO GERAL DO PROJETO

### Informações Gerais
- **Duração Total:** 28 semanas (~7 meses)
- **Equipe:** 10 agentes especializados
- **Plataformas:** iOS, Android, Web (desenvolvimento simultâneo)
- **Metodologia:** Scrum com sprints de 2 semanas

### Fases do Projeto
```
FASE 1: FUNDAÇÃO (Semanas 1-6)
├─ Setup de infraestrutura
├─ Arquitetura base
├─ Design system
└─ Autenticação e permissões

FASE 2: DESENVOLVIMENTO CORE (Semanas 7-14)
├─ Sistema de cursos e módulos
├─ Integração Cloudflare Stream/R2
├─ Dashboard administrativo
└─ Sistema de progresso

FASE 3: RECURSOS AVANÇADOS (Semanas 15-20)
├─ Gamificação com IA
├─ Fórum e comunidade
├─ Sistema de notificações push
└─ Analytics

FASE 4: IA E PREMIUM (Semanas 21-24)
├─ Chatbot IA avançado
├─ Recomendações personalizadas
├─ Sistema de pagamentos
└─ Recursos premium

FASE 5: TESTES E LANÇAMENTO (Semanas 25-28)
├─ Testes de carga e performance
├─ Beta testing
├─ Correções finais
└─ Deploy produção
```

### Features MUST-HAVE (Prioridade Máxima)
1. ✅ **Cloudflare Stream/CDN** - Hospedagem e streaming de vídeos
2. ✅ **Analytics** - Cloudflare Analytics + GCP (BigQuery)
3. ✅ **Login/Permissões** - Admin vs Usuário
4. ✅ **Gamificação IA** - Sistema estilo Duolingo
5. ✅ **Dashboard Admin** - Upload de aulas e gestão
6. ✅ **Módulos/Cursos** - Estrutura estilo Coursera
7. ✅ **Fórum** - Interação entre alunos
8. ✅ **Push Notifications** - Sistema de notificações

---

## 🎯 FASE 1: FUNDAÇÃO (SEMANAS 1-6)

### 🎯 Objetivos da Fase
- Estabelecer arquitetura base do projeto
- Configurar infraestrutura (GCP + Cloudflare)
- Criar design system completo
- Implementar autenticação e sistema de permissões
- Setup de repositórios e CI/CD

---

### 📅 SEMANA 1: KICKOFF E PLANEJAMENTO

#### **PO-01 (Ana Paula) - Product Owner**
**Carga:** 40h | **Prioridade:** 🔴 Crítica

**Tarefas:**
- [ ] Criar product vision document
- [ ] Definir roadmap detalhado de 28 semanas
- [ ] Priorizar features MUST-HAVE
- [ ] Criar user stories iniciais (50+ stories)
- [ ] Definir critérios de aceitação para MVP
- [ ] Alinhar expectativas com stakeholders

**Entregas:**
```
/docs/product/
├── product-vision.md
├── roadmap-28-weeks.md
├── user-stories-sprint-01.md
├── acceptance-criteria.md
└── stakeholder-alignment.md
```

**Critérios de Conclusão:**
- ✅ Roadmap aprovado por stakeholders
- ✅ 50+ user stories criadas e priorizadas
- ✅ Critérios de aceitação definidos

---

#### **TECH-LEAD-01 (Ricardo) - Tech Lead**
**Carga:** 40h | **Prioridade:** 🔴 Crítica

**Tarefas:**
- [ ] Definir arquitetura geral do sistema
- [ ] Escolher stack tecnológico
- [ ] Criar ADRs (Architecture Decision Records)
- [ ] Definir estrutura de repositórios
- [ ] Estabelecer padrões de código
- [ ] Planejar estratégia de testes
- [ ] Definir estratégia de analytics (Cloudflare vs GCP)

**Entregas:**
```
/docs/architecture/
├── system-overview.md
├── tech-stack.md
├── ADR-001-database-choice.md
├── ADR-002-analytics-strategy.md
├── ADR-003-video-streaming.md
├── repository-structure.md
├── coding-standards.md
└── testing-strategy.md
```

**Decisões Arquiteturais:**
```markdown
# ADR-002: Estratégia de Analytics

## Decisão
Usar Cloudflare Media Analytics para vídeos + GCP BigQuery para analytics customizado

## Rationale
- Cloudflare: Analytics de vídeo nativo (views, engagement, buffering)
- BigQuery: Analytics de negócio (progresso, gamificação, comportamento)
- Custo otimizado: Cloudflare incluído no plano, BigQuery pay-as-you-go

## Implementação
- Cloudflare Analytics API para métricas de vídeo
- Event streaming para BigQuery (user actions, progress, achievements)
- Dashboard unificado no admin panel
```

**Critérios de Conclusão:**
- ✅ Arquitetura documentada e aprovada
- ✅ Stack tecnológico definido
- ✅ 5+ ADRs criados
- ✅ Padrões de código estabelecidos

---

#### **DESIGNER-01 (Beatriz) - UX/UI Designer**
**Carga:** 40h | **Prioridade:** 🔴 Crítica

**Tarefas:**
- [ ] Criar design system base
- [ ] Definir paleta de cores e tipografia
- [ ] Criar componentes UI fundamentais
- [ ] Wireframes de telas principais
- [ ] Protótipo navegável (Figma)
- [ ] Guia de acessibilidade

**Entregas:**
```
/design/
├── design-system/
│   ├── colors.md
│   ├── typography.md
│   ├── spacing.md
│   ├── components/
│   │   ├── buttons.fig
│   │   ├── inputs.fig
│   │   ├── cards.fig
│   │   └── navigation.fig
├── wireframes/
│   ├── login-screen.fig
│   ├── dashboard-admin.fig
│   ├── course-list.fig
│   ├── video-player.fig
│   └── forum.fig
├── prototype-v1.fig
└── accessibility-guide.md
```

**Critérios de Conclusão:**
- ✅ Design system com 20+ componentes
- ✅ Wireframes de 15+ telas principais
- ✅ Protótipo navegável aprovado pelo PO

---

#### **DEVOPS-01 (Carolina) - DevOps Engineer**
**Carga:** 40h | **Prioridade:** 🔴 Crítica

**Tarefas:**
- [ ] Setup de conta GCP
- [ ] Setup de conta Cloudflare
- [ ] Configurar repositórios Git
- [ ] Setup CI/CD inicial (GitHub Actions)
- [ ] Criar ambientes (dev, staging, prod)
- [ ] Configurar monitoramento básico

**Entregas:**
```
/infrastructure/
├── gcp/
│   ├── terraform/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── outputs.tf
│   └── setup-guide.md
├── cloudflare/
│   ├── stream-config.md
│   ├── r2-config.md
│   └── analytics-config.md
├── ci-cd/
│   ├── .github/workflows/
│   │   ├── backend-ci.yml
│   │   ├── frontend-ci.yml
│   │   ├── ios-ci.yml
│   │   └── android-ci.yml
└── monitoring/
    ├── prometheus-config.yml
    └── grafana-dashboards.json
```

**Comandos Executados:**
```bash
# Setup GCP
gcloud init
gcloud projects create projeto-cirurgiao
gcloud config set project projeto-cirurgiao

# Setup Cloudflare
# (Via dashboard web)

# Setup repositórios
git init backend-api
git init frontend-web
git init ios-app
git init android-app

# Setup CI/CD
# (Configurar GitHub Actions)
```

**Critérios de Conclusão:**
- ✅ GCP e Cloudflare configurados
- ✅ 4 repositórios criados e configurados
- ✅ CI/CD básico funcionando
- ✅ 3 ambientes criados (dev, staging, prod)

---

#### **BACKEND-SENIOR-01 (Rafael) - Backend Developer**
**Carga:** 40h | **Prioridade:** 🟡 Alta

**Tarefas:**
- [ ] Setup inicial do projeto backend
- [ ] Configurar estrutura de pastas
- [ ] Setup de banco de dados (PostgreSQL)
- [ ] Configurar ORM (Prisma/TypeORM)
- [ ] Criar migrations iniciais
- [ ] Setup de testes unitários

**Entregas:**
```
/backend-api/
├── package.json
├── tsconfig.json
├── .env.example
├── src/
│   ├── config/
│   │   ├── database.ts
│   │   ├── cloudflare.ts
│   │   └── app.ts
│   ├── modules/
│   │   └── (vazio por enquanto)
│   ├── shared/
│   │   ├── interfaces/
│   │   ├── utils/
│   │   └── constants/
│   └── main.ts
├── prisma/
│   ├── schema.prisma
│   └── migrations/
└── tests/
    └── setup.ts
```

**Comandos Executados:**
```bash
# Criar projeto
mkdir backend-api && cd backend-api
npm init -y
npm install express typescript @types/node @types/express
npm install prisma @prisma/client
npm install jest @types/jest ts-jest

# Setup Prisma
npx prisma init

# Setup TypeScript
npx tsc --init
```

**Critérios de Conclusão:**
- ✅ Projeto backend inicializado
- ✅ Banco de dados configurado
- ✅ Estrutura de pastas estabelecida
- ✅ Testes unitários configurados

---

#### **IOS-SENIOR-01 (Lucas) - iOS Developer**
**Carga:** 40h | **Prioridade:** 🟡 Alta

**Tarefas:**
- [ ] Criar projeto iOS (Swift + SwiftUI)
- [ ] Configurar estrutura MVVM
- [ ] Setup de dependências (SPM)
- [ ] Configurar Firebase (Analytics + Push)
- [ ] Setup de testes unitários (XCTest)

**Entregas:**
```
/ios-app/
├── CirurgiaoApp.xcodeproj
├── CirurgiaoApp/
│   ├── App/
│   │   ├── CirurgiaoAppApp.swift
│   │   └── AppDelegate.swift
│   ├── Core/
│   │   ├── Network/
│   │   ├── Storage/
│   │   └── Utils/
│   ├── Features/
│   │   └── (vazio por enquanto)
│   ├── Resources/
│   │   ├── Assets.xcassets
│   │   └── Info.plist
│   └── Config/
│       ├── Development.xcconfig
│       ├── Staging.xcconfig
│       └── Production.xcconfig
├── CirurgiaoAppTests/
└── Podfile (ou Package.swift)
```

**Critérios de Conclusão:**
- ✅ Projeto iOS criado e compilando
- ✅ Estrutura MVVM estabelecida
- ✅ Firebase configurado
- ✅ Testes unitários configurados

---

#### **ANDROID-SENIOR-01 (Marina) - Android Developer**
**Carga:** 40h | **Prioridade:** 🟡 Alta

**Tarefas:**
- [ ] Criar projeto Android (Kotlin + Jetpack Compose)
- [ ] Configurar arquitetura MVVM
- [ ] Setup de dependências (Gradle)
- [ ] Configurar Firebase (Analytics + Push)
- [ ] Setup de testes unitários (JUnit)

**Entregas:**
```
/android-app/
├── app/
│   ├── build.gradle
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/cirurgiao/
│   │   │   │   ├── CirurgiaoApplication.kt
│   │   │   │   ├── core/
│   │   │   │   │   ├── network/
│   │   │   │   │   ├── storage/
│   │   │   │   │   └── utils/
│   │   │   │   ├── features/
│   │   │   │   │   └── (vazio por enquanto)
│   │   │   │   └── ui/
│   │   │   │       └── theme/
│   │   │   ├── res/
│   │   │   └── AndroidManifest.xml
│   │   └── test/
│   └── google-services.json
├── build.gradle
└── settings.gradle
```

**Critérios de Conclusão:**
- ✅ Projeto Android criado e compilando
- ✅ Arquitetura MVVM estabelecida
- ✅ Firebase configurado
- ✅ Testes unitários configurados

---

#### **FRONTEND-01 (Juliana) - Frontend Developer**
**Carga:** 40h | **Prioridade:** 🟡 Alta

**Tarefas:**
- [ ] Criar projeto Next.js 14
- [ ] Configurar TypeScript
- [ ] Setup Tailwind CSS + shadcn/ui
- [ ] Configurar estrutura de pastas
- [ ] Setup de testes (Jest + React Testing Library)

**Entregas:**
```
/frontend-web/
├── package.json
├── tsconfig.json
├── next.config.js
├── tailwind.config.js
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── globals.css
│   ├── components/
│   │   ├── ui/ (shadcn components)
│   │   └── shared/
│   ├── lib/
│   │   ├── api/
│   │   ├── utils/
│   │   └── constants/
│   ├── hooks/
│   └── types/
└── tests/
    └── setup.ts
```

**Comandos Executados:**
```bash
# Criar projeto
npx create-next-app@latest frontend-web --typescript --tailwind --app

# Instalar shadcn/ui
npx shadcn-ui@latest init

# Instalar dependências de teste
npm install -D jest @testing-library/react @testing-library/jest-dom
```

**Critérios de Conclusão:**
- ✅ Projeto Next.js criado e rodando
- ✅ Tailwind + shadcn/ui configurados
- ✅ Estrutura de pastas estabelecida
- ✅ Testes configurados

---

#### **MOBILE-PLENO-01 (Pedro) - Mobile Developer**
**Carga:** 20h | **Prioridade:** 🟢 Média

**Tarefas:**
- [ ] Estudar arquitetura iOS (com IOS-SENIOR-01)
- [ ] Estudar arquitetura Android (com ANDROID-SENIOR-01)
- [ ] Setup de ambiente de desenvolvimento
- [ ] Familiarizar-se com Firebase

**Entregas:**
- Ambiente de desenvolvimento configurado
- Conhecimento básico das arquiteturas

**Critérios de Conclusão:**
- ✅ Ambiente iOS configurado
- ✅ Ambiente Android configurado
- ✅ Capaz de compilar ambos os projetos

---

#### **QA-01 (Carlos) - QA Engineer**
**Carga:** 20h | **Prioridade:** 🟢 Média

**Tarefas:**
- [ ] Criar estratégia de testes
- [ ] Definir test cases para features MUST-HAVE
- [ ] Setup de ferramentas de teste
- [ ] Criar templates de bug report

**Entregas:**
```
/docs/qa/
├── testing-strategy.md
├── test-cases/
│   ├── authentication.md
│   ├── video-streaming.md
│   ├── gamification.md
│   └── forum.md
├── bug-report-template.md
└── tools-setup.md
```

**Critérios de Conclusão:**
- ✅ Estratégia de testes documentada
- ✅ 50+ test cases criados
- ✅ Ferramentas de teste configuradas

---

### 📊 CHECKPOINT SEMANA 1

**Reunião de Sincronização:**
- **Quando:** Sexta-feira, 16h
- **Duração:** 2h
- **Participantes:** Todos os 10 agentes
- **Objetivo:** Alinhar progresso e resolver bloqueios

**Entregas Esperadas:**
- ✅ Arquitetura definida e documentada
- ✅ Design system inicial criado
- ✅ Infraestrutura base configurada
- ✅ 4 projetos inicializados (backend, frontend, iOS, Android)
- ✅ Roadmap de 28 semanas aprovado

**Bloqueios Comuns:**
- Credenciais GCP/Cloudflare pendentes
- Decisões arquiteturais em discussão
- Dependências entre times

**Próximos Passos:**
- Semana 2: Implementar autenticação
- Semana 2: Criar telas de login
- Semana 2: Setup de banco de dados

---

### 📅 SEMANA 2: AUTENTICAÇÃO E PERMISSÕES

#### **BACKEND-SENIOR-01 (Rafael) - Backend Developer**
**Carga:** 40h | **Prioridade:** 🔴 Crítica | **Depende de:** TECH-LEAD-01 (ADRs)

**Tarefas:**
- [ ] Implementar sistema de autenticação JWT
- [ ] Criar módulo de usuários
- [ ] Implementar sistema de permissões (RBAC)
- [ ] Criar endpoints de auth
- [ ] Implementar refresh tokens
- [ ] Adicionar rate limiting

**Entregas:**
```
/backend-api/src/modules/
├── auth/
│   ├── auth.controller.ts
│   ├── auth.service.ts
│   ├── auth.module.ts
│   ├── dto/
│   │   ├── login.dto.ts
│   │   ├── register.dto.ts
│   │   └── refresh-token.dto.ts
│   ├── guards/
│   │   ├── jwt-auth.guard.ts
│   │   └── roles.guard.ts
│   ├── strategies/
│   │   └── jwt.strategy.ts
│   └── tests/
│       ├── auth.controller.spec.ts
│       └── auth.service.spec.ts
├── users/
│   ├── users.controller.ts
│   ├── users.service.ts
│   ├── users.repository.ts
│   ├── users.module.ts
│   ├── entities/
│   │   └── user.entity.ts
│   ├── dto/
│   │   ├── create-user.dto.ts
│   │   └── update-user.dto.ts
│   └── tests/
└── permissions/
    ├── permissions.service.ts
    ├── decorators/
    │   └── roles.decorator.ts
    └── enums/
        └── user-role.enum.ts
```

**Endpoints Criados:**
```typescript
POST   /api/v1/auth/register
POST   /api/v1/auth/login
POST   /api/v1/auth/refresh
POST   /api/v1/auth/logout
GET    /api/v1/auth/me
GET    /api/v1/users
GET    /api/v1/users/:id
PUT    /api/v1/users/:id
DELETE /api/v1/users/:id
```

**Schema de Banco de Dados:**
```prisma
model User {
  id            String   @id @default(uuid())
  email         String   @unique
  password      String
  name          String
  role          UserRole @default(STUDENT)
  avatar        String?
  isActive      Boolean  @default(true)
  emailVerified Boolean  @default(false)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  refreshTokens RefreshToken[]
  progress      Progress[]
  achievements  Achievement[]
  forumPosts    ForumPost[]
  
  @@map("users")
}

enum UserRole {
  ADMIN
  INSTRUCTOR
  STUDENT
}

model RefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  userId    String
  expiresAt DateTime
  createdAt DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("refresh_tokens")
}
```

**Testes:**
```typescript
// auth.service.spec.ts
describe('AuthService', () => {
  it('should register a new user', async () => {
    // Test implementation
  });
  
  it('should login with valid credentials', async () => {
    // Test implementation
  });
  
  it('should reject invalid credentials', async () => {
    // Test implementation
  });
  
  it('should refresh access token', async () => {
    // Test implementation
  });
});
```

**Critérios de Conclusão:**
- ✅ Autenticação JWT funcionando
- ✅ Sistema de permissões implementado
- ✅ 8 endpoints criados e testados
- ✅ Cobertura de testes > 80%
- ✅ Documentação Swagger completa

---

#### **DESIGNER-01 (Beatriz) - UX/UI Designer**
**Carga:** 40h | **Prioridade:** 🔴 Crítica

**Tarefas:**
- [ ] Criar designs de telas de login/registro
- [ ] Criar designs de dashboard admin
- [ ] Criar designs de dashboard aluno
- [ ] Definir fluxo de onboarding
- [ ] Criar componentes de formulário

**Entregas:**
```
/design/screens/
├── auth/
│   ├── login.fig
│   ├── register.fig
│   ├── forgot-password.fig
│   └── email-verification.fig
├── dashboard/
│   ├── admin-dashboard.fig
│   ├── student-dashboard.fig
│   └── instructor-dashboard.fig
├── onboarding/
│   ├── welcome.fig
│   ├── profile-setup.fig
│   └── preferences.fig
└── components/
    ├── form-inputs.fig
    ├── buttons-states.fig
    └── error-messages.fig
```

**Specs para Desenvolvedores:**
```
/design/specs/
├── auth-screens-specs.md
├── dashboard-specs.md
├── component-library.md
└── interaction-patterns.md
```

**Critérios de Conclusão:**
- ✅ 10+ telas desenhadas
- ✅ Fluxo de onboarding definido
- ✅ Specs entregues para desenvolvedores
- ✅ Aprovação do PO-01

---

#### **FRONTEND-01 (Juliana) - Frontend Developer**
**Carga:** 40h | **Prioridade:** 🔴 Crítica | **Depende de:** DESIGNER-01, BACKEND-SENIOR-01

**Tarefas:**
- [ ] Implementar telas de login/registro
- [ ] Criar componentes de formulário
- [ ] Integrar com API de autenticação
- [ ] Implementar gerenciamento de estado (Zustand)
- [ ] Adicionar validação de formulários (Zod)
- [ ] Implementar proteção de rotas

**Entregas:**
```
/frontend-web/src/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── register/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   ├── (dashboard)/
│   │   ├── admin/
│   │   │   └── page.tsx
│   │   ├── student/
│   │   │   └── page.tsx
│   │   └── layout.tsx
├── components/
│   ├── auth/
│   │   ├── login-form.tsx
│   │   ├── register-form.tsx
│   │   └── auth-provider.tsx
│   └── ui/
│       ├── input.tsx
│       ├── button.tsx
│       └── form.tsx
├── lib/
│   ├── api/
│   │   └── auth.ts
│   ├── stores/
│   │   └── auth-store.ts
│   └── schemas/
│       └── auth-schemas.ts
└── middleware.ts
```

**Implementação de Autenticação:**
```typescript
// lib/api/auth.ts
export const authApi = {
  login: async (credentials: LoginDto) => {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
    return response.json();
  },
  
  register: async (data: RegisterDto) => {
    const response = await fetch('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response.json();
  },
};

// lib/stores/auth-store.ts
export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  login: async (credentials) => {
    const { user, token } = await authApi.login(credentials);
    set({ user, token });
  },
  logout: () => set({ user: null, token: null }),
}));
```

**Critérios de Conclusão:**
- ✅ Telas de login/registro funcionando
- ✅ Integração com backend completa
- ✅ Validação de formulários implementada
- ✅ Proteção de rotas funcionando
- ✅ Testes E2E passando

---

#### **IOS-SENIOR-01 (Lucas) - iOS Developer**
**Carga:** 40h | **Prioridade:** 🔴 Crítica | **Depende de:** DESIGNER-01, BACKEND-SENIOR-01

**Tarefas:**
- [ ] Implementar telas de login/registro
- [ ] Criar serviço de autenticação
- [ ] Implementar Keychain para tokens
- [ ] Adicionar validação de formulários
- [ ] Implementar navegação condicional

**Entregas:**
```
/ios-app/CirurgiaoApp/Features/
├── Auth/
│   ├── Views/
│   │   ├── LoginView.swift
│   │   ├── RegisterView.swift
│   │   └── ForgotPasswordView.swift
│   ├── ViewModels/
│   │   ├── LoginViewModel.swift
│   │   └── RegisterViewModel.swift
│   ├── Models/
│   │   ├── User.swift
│   │   └── AuthResponse.swift
│   └── Services/
│       └── AuthService.swift
├── Dashboard/
│   ├── Views/
│   │   ├── AdminDashboardView.swift
│   │   └── StudentDashboardView.swift
│   └── ViewModels/
└── Core/
    ├── Network/
    │   ├── APIClient.swift
    │   └── APIEndpoints.swift
    ├── Storage/
    │   └── KeychainManager.swift
    └── Navigation/
        └── AppCoordinator.swift
```

**Implementação de Autenticação:**
```swift
// AuthService.swift
class AuthService {
    func login(email: String, password: String) async throws -> AuthResponse {
        let endpoint = APIEndpoints.login
        let body = ["email": email, "password": password]
        return try await APIClient.shared.request(endpoint, method: .post, body: body)
    }
    
    func saveToken(_ token: String) {
        KeychainManager.shared.save(token, forKey: "access_token")
    }
}

// LoginViewModel.swift
@MainActor
class LoginViewModel: ObservableObject {
    @Published var email = ""
    @Published var password = ""
    @Published var isLoading = false
    @Published var errorMessage: String?
    
    private let authService = AuthService()
    
    func login() async {
        isLoading = true
        do {
            let response = try await authService.login(email: email, password: password)
            authService.saveToken(response.token)
            // Navigate to dashboard
        } catch {
            errorMessage = error.localizedDescription
        }
        isLoading = false
    }
}
```

**Critérios de Conclusão:**
- ✅ Telas de login/registro funcionando
- ✅ Integração com backend completa
- ✅ Tokens salvos no Keychain
- ✅ Navegação condicional implementada
- ✅ Testes unitários passando

---

#### **ANDROID-SENIOR-01 (Marina) - Android Developer**
**Carga:** 40h | **Prioridade:** 🔴 Crítica | **Depende de:** DESIGNER-01, BACKEND-SENIOR-01

**Tarefas:**
- [ ] Implementar telas de login/registro
- [ ] Criar serviço de autenticação
- [ ] Implementar DataStore para tokens
- [ ] Adicionar validação de formulários
- [ ] Implementar navegação condicional

**Entregas:**
```
/android-app/app/src/main/java/com/cirurgiao/
├── features/
│   ├── auth/
│   │   ├── presentation/
│   │   │   ├── login/
│   │   │   │   ├── LoginScreen.kt
│   │   │   │   └── LoginViewModel.kt
│   │   │   ├── register/
│   │   │   │   ├── RegisterScreen.kt
│   │   │   │   └── RegisterViewModel.kt
│   │   ├── domain/
│   │   │   ├── model/
│   │   │   │   └── User.kt
│   │   │   └── repository/
│   │   │       └── AuthRepository.kt
│   │   └── data/
│   │       ├── remote/
│   │       │   └── AuthApi.kt
│   │       └── repository/
│   │           └── AuthRepositoryImpl.kt
│   └── dashboard/
│       ├── AdminDashboardScreen.kt
│       └── StudentDashboardScreen.kt
└── core/
    ├── network/
    │   └── ApiClient.kt
    ├── storage/
    │   └── TokenManager.kt
    └── navigation/
        └── NavGraph.kt
```

**Critérios de Conclusão:**
- ✅ Telas de login/registro funcionando
- ✅ Integração com backend completa
- ✅ Tokens salvos no DataStore
- ✅ Navegação condicional implementada
- ✅ Testes unitários passando

---

#### **MOBILE-PLENO-01 (Pedro) - Mobile Developer**
**Carga:** 40h | **Prioridade:** 🟡 Alta | **Depende de:** IOS-SENIOR-01, ANDROID-SENIOR-01

**Tarefas:**
- [ ] Auxiliar iOS-SENIOR-01 em testes
- [ ] Auxiliar ANDROID-SENIOR-01 em testes
- [ ] Criar testes de UI para ambas plataformas
- [ ] Documentar fluxos de autenticação

**Entregas:**
```
/ios-app/CirurgiaoAppUITests/
└── AuthUITests.swift

/android-app/app/src/androidTest/
└── AuthUITests.kt

/docs/mobile/
└── auth-flow-documentation.md
```

**Critérios de Conclusão:**
- ✅ Testes de UI criados para iOS
- ✅ Testes de UI criados para Android
- ✅ Documentação completa

---

#### **DEVOPS-01 (Carolina) - DevOps Engineer**
**Carga:** 40h | **Prioridade:** 🟡 Alta

**Tarefas:**
- [ ] Configurar banco de dados PostgreSQL em GCP
- [ ] Setup Redis para cache
- [ ] Configurar secrets management
- [ ] Deploy de backend em staging
- [ ] Configurar SSL/TLS

**Entregas:**
```
/infrastructure/gcp/
├── database/
│   ├── postgresql-setup.tf
│   └── redis-setup.tf
├── secrets/
│   └── secret-manager-config.tf
└── ssl/
    └── certificate-config.md
```

**Comandos Executados:**
```bash
# Criar banco PostgreSQL
gcloud sql instances create cirurgiao-db \
  --database-version=POSTGRES_15 \
  --tier=db-f1-micro \
  --region=us-central1

# Criar Redis
gcloud redis instances create cirurgiao-cache \
  --size=1 \
  --region=us-central1

# Deploy backend
gcloud run deploy backend-api \
  --source=./backend-api \
  --region=us-central1
```

**Critérios de Conclusão:**
- ✅ PostgreSQL configurado e acessível
- ✅ Redis configurado
- ✅ Backend deployado em staging
- ✅ SSL/TLS configurado

---

#### **QA-01 (Carlos) - QA Engineer**
**Carga:** 40h | **Prioridade:** 🟡 Alta

**Tarefas:**
- [ ] Testar fluxo de autenticação em todas plataformas
- [ ] Criar test cases automatizados
- [ ] Testar sistema de permissões
- [ ] Reportar bugs encontrados

**Entregas:**
```
/docs/qa/test-reports/
├── week-02-auth-testing.md
├── bugs/
│   ├── BUG-001-login-validation.md
│   └── BUG-002-token-refresh.md
└── test-results/
    ├── backend-auth-tests.json
    ├── frontend-auth-tests.json
    ├── ios-auth-tests.json
    └── android-auth-tests.json
```

**Critérios de Conclusão:**
- ✅ 100% dos test cases executados
- ✅ Bugs documentados e reportados
- ✅ Relatório de testes entregue

---

#### **PO-01 (Ana Paula) - Product Owner**
**Carga:** 20h | **Prioridade:** 🟢 Média

**Tarefas:**
- [ ] Validar fluxo de autenticação
- [ ] Aprovar designs de login/registro
- [ ] Criar user stories para Semana 3-4
- [ ] Priorizar backlog

**Entregas:**
```
/docs/product/
├── user-stories-sprint-02.md
└── backlog-prioritization.md
```

**Critérios de Conclusão:**
- ✅ Fluxo de autenticação aprovado
- ✅ User stories para próximas 2 semanas criadas

---

#### **TECH-LEAD-01 (Ricardo) - Tech Lead**
**Carga:** 40h | **Prioridade:** 🔴 Crítica

**Tarefas:**
- [ ] Code review de todos os PRs de autenticação
- [ ] Resolver bloqueios técnicos
- [ ] Planejar integração Cloudflare (Semana 3-4)
- [ ] Criar ADRs para próximas features

**Entregas:**
```
/docs/architecture/
├── ADR-004-cloudflare-integration.md
├── ADR-005-video-storage-strategy.md
└── code-review-reports/
    └── week-02-reviews.md
```

**Critérios de Conclusão:**
- ✅ Todos os PRs revisados e aprovados
- ✅ Bloqueios resolvidos
- ✅ Planejamento de Cloudflare completo

---

### 📊 CHECKPOINT SEMANA 2

**Entregas Esperadas:**
- ✅ Sistema de autenticação funcionando em todas plataformas
- ✅ Telas de login/registro implementadas
- ✅ Sistema de permissões (Admin vs Usuário)
- ✅ Backend deployado em staging
- ✅ Testes automatizados criados

**Métricas:**
- Cobertura de testes backend: > 80%
- Cobertura de testes frontend: > 70%
- Bugs críticos: 0
- Bugs médios: < 5

---

### 📅 SEMANAS 3-4: CLOUDFLARE INTEGRATION & DASHBOARD ADMIN

#### **Objetivos das Semanas 3-4:**
- Integrar Cloudflare Stream para vídeos
- Integrar Cloudflare R2 para storage
- Criar dashboard administrativo
- Implementar upload de vídeos
- Sistema básico de cursos e módulos

---

#### **BACKEND-SENIOR-01 (Rafael) - Backend Developer**
**Carga:** 80h (2 semanas) | **Prioridade:** 🔴 Crítica

**Tarefas:**
- [ ] Integrar Cloudflare Stream API
- [ ] Integrar Cloudflare R2 para storage
- [ ] Criar módulo de cursos
- [ ] Criar módulo de vídeos
- [ ] Implementar upload de vídeos
- [ ] Criar sistema de transcodificação

**Entregas:**
```
/backend-api/src/modules/
├── cloudflare/
│   ├── stream/
│   │   ├── stream.service.ts
│   │   ├── stream.controller.ts
│   │   └── dto/
│   │       ├── upload-video.dto.ts
│   │       └── video-metadata.dto.ts
│   └── r2/
│       ├── r2.service.ts
│       └── r2.controller.ts
├── courses/
│   ├── courses.controller.ts
│   ├── courses.service.ts
│   ├── courses.repository.ts
│   ├── entities/
│   │   ├── course.entity.ts
│   │   └── module.entity.ts
│   └── dto/
│       ├── create-course.dto.ts
│       └── create-module.dto.ts
└── videos/
    ├── videos.controller.ts
    ├── videos.service.ts
    ├── entities/
    │   └── video.entity.ts
    └── dto/
        └── create-video.dto.ts
```

**Endpoints Criados:**
```typescript
// Cloudflare Stream
POST   /api/v1/videos/upload
GET    /api/v1/videos/:id
GET    /api/v1/videos/:id/stream-url
DELETE /api/v1/videos/:id

// Courses
POST   /api/v1/courses
GET    /api/v1/courses
GET    /api/v1/courses/:id
PUT    /api/v1/courses/:id
DELETE /api/v1/courses/:id

// Modules
POST   /api/v1/courses/:courseId/modules
GET    /api/v1/courses/:courseId/modules
PUT    /api/v1/modules/:id
DELETE /api/v1/modules/:id
```

**Schema de Banco de Dados:**
```prisma
model Course {
  id          String   @id @default(uuid())
  title       String
  description String
  thumbnail   String?
  instructor  String
  duration    Int      // em minutos
  level       Level    @default(BEGINNER)
  isPublished Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  modules  Module[]
  progress Progress[]
  
  @@map("courses")
}

enum Level {
  BEGINNER
  INTERMEDIATE
  ADVANCED
}

model Module {
  id          String   @id @default(uuid())
  courseId    String
  title       String
  description String?
  order       Int
  duration    Int      // em minutos
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  course Course  @relation(fields: [courseId], references: [id], onDelete: Cascade)
  videos Video[]
  
  @@map("modules")
}

model Video {
  id                String   @id @default(uuid())
  moduleId          String
  title             String
  description       String?
  cloudflareVideoId String   @unique
  duration          Int      // em segundos
  thumbnail         String?
  order             Int
  createdAt         DateTime @default(now())
  updatedAt         DateTime @updatedAt
  
  module   Module     @relation(fields: [moduleId], references: [id], onDelete: Cascade)
  progress Progress[]
  
  @@map("videos")
}
```

**Integração Cloudflare Stream:**
```typescript
// cloudflare/stream/stream.service.ts
export class StreamService {
  private readonly apiUrl = 'https://api.cloudflare.com/client/v4';
  private readonly accountId = process.env.CLOUDFLARE_ACCOUNT_ID;
  private readonly apiToken = process.env.CLOUDFLARE_API_TOKEN;

  async uploadVideo(file: Express.Multer.File): Promise<VideoUploadResponse> {
    const formData = new FormData();
    formData.append('file', file.buffer, file.originalname);
    
    const response = await fetch(
      `${this.apiUrl}/accounts/${this.accountId}/stream`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
        body: formData,
      }
    );
    
    return response.json();
  }

  async getVideoDetails(videoId: string): Promise<VideoDetails> {
    const response = await fetch(
      `${this.apiUrl}/accounts/${this.accountId}/stream/${videoId}`,
      {
        headers: {
          'Authorization': `Bearer ${this.apiToken}`,
        },
      }
    );
    
    return response.json();
  }

  async getStreamUrl(videoId: string): Promise<string> {
    return `https://customer-${this.accountId}.cloudflarestream.com/${videoId}/manifest/video.m3u8`;
  }
}
```

**Critérios de Conclusão:**
- ✅ Integração Cloudflare Stream funcionando
- ✅ Upload de vídeos implementado
- ✅ Sistema de cursos e módulos criado
- ✅ 12+ endpoints criados e testados
- ✅ Documentação completa

---

#### **FRONTEND-01 (Juliana) - Frontend Developer**
**Carga:** 80h (2 semanas) | **Prioridade:** 🔴 Crítica

**Tarefas:**
- [ ] Criar dashboard administrativo
- [ ] Implementar upload de vídeos
- [ ] Criar interface de gestão de cursos
- [ ] Criar interface de gestão de módulos
- [ ] Implementar player de vídeo (Cloudflare Stream)

**Entregas:**
```
/frontend-web/src/app/(dashboard)/admin/
├── courses/
│   ├── page.tsx
│   ├── new/
│   │   └── page.tsx
│   └── [id]/
│       ├── page.tsx
│       └── edit/
│           └── page.tsx
├── videos/
│   ├── page.tsx
│   └── upload/
│       └── page.tsx
└── modules/
    └── [courseId]/
        └── page.tsx

/frontend-web/src/components/admin/
├── course-form.tsx
├── module-form.tsx
├── video-upload.tsx
├── video-player.tsx
└── course-list.tsx
```

**Implementação de Upload:**
```typescript
// components/admin/video-upload.tsx
export function VideoUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = async () => {
    if (!file) return;
    
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/v1/videos/upload', {
      method: 'POST',
      body: formData,
    });
    
    const data = await response.json();
    setUploading(false);
    // Handle success
  };

  return (
    <div>
      <input
        type="file"
        accept="video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />
      <button onClick={handleUpload} disabled={uploading}>
        {uploading ? `Uploading... ${progress}%` : 'Upload Video'}
      </button>
    </div>
  );
}
```

**Critérios de Conclusão:**
- ✅ Dashboard admin completo
- ✅ Upload de vídeos funcionando
- ✅ CRUD de cursos implementado
- ✅ Player de vídeo integrado
- ✅ Interface responsiva

---

#### **DESIGNER-01 (Beatriz) - UX/UI Designer**
**Carga:** 80h (2 semanas) | **Prioridade:** 🔴 Crítica

**Tarefas:**
- [ ] Criar designs do dashboard admin
- [ ] Criar interface de upload de vídeos
- [ ] Criar interface de gestão de cursos
- [ ] Criar player de vídeo customizado
- [ ] Criar componentes de tabelas e listas

**Entregas:**
```
/design/screens/admin/
├── dashboard-overview.fig
├── courses/
│   ├── course-list.fig
│   ├── course-form.fig
│   └── course-details.fig
├── videos/
│   ├── video-upload.fig
│   ├── video-list.fig
│   └── video-player.fig
└── modules/
    ├── module-list.fig
    └── module-form.fig
```

**Critérios de Conclusão:**
- ✅ 15+ telas de admin desenhadas
- ✅ Fluxo de upload definido
- ✅ Player customizado desenhado
- ✅ Aprovação do PO-01

---

#### **DEVOPS-01 (Carolina) - DevOps Engineer**
**Carga:** 80h (2 semanas) | **Prioridade:** 🔴 Crítica

**Tarefas:**
- [ ] Configurar Cloudflare Stream
- [ ] Configurar Cloudflare R2
- [ ] Setup de storage para uploads temporários
- [ ] Configurar CDN
- [ ] Otimizar pipeline de vídeo

**Entregas:**
```
/infrastructure/cloudflare/
├── stream/
│   ├── stream-setup.md
│   └── webhook-config.md
├── r2/
│   ├── bucket-config.md
│   └── access-policy.md
└── cdn/
    └── cdn-config.md
```

**Configuração Cloudflare:**
```bash
# Criar bucket R2
wrangler r2 bucket create cirurgiao-videos

# Configurar CORS
wrangler r2 bucket cors put cirurgiao-videos \
  --allow-origin="*" \
  --allow-methods="GET,PUT,POST,DELETE"
```

**Critérios de Conclusão:**
- ✅ Cloudflare Stream configurado
- ✅ R2 bucket criado e configurado
- ✅ CDN otimizado
- ✅ Pipeline de vídeo funcionando

---

#### **IOS-SENIOR-01 (Lucas) & ANDROID-SENIOR-01 (Marina)**
**Carga:** 40h cada (1 semana) | **Prioridade:** 🟡 Alta

**Tarefas:**
- [ ] Implementar player de vídeo nativo
- [ ] Criar tela de lista de cursos
- [ ] Criar tela de detalhes do curso
- [ ] Integrar com Cloudflare Stream

**Entregas (iOS):**
```
/ios-app/CirurgiaoApp/Features/
├── Courses/
│   ├── Views/
│   │   ├── CourseListView.swift
│   │   └── CourseDetailView.swift
│   └── ViewModels/
└── VideoPlayer/
    ├── VideoPlayerView.swift
    └── VideoPlayerViewModel.swift
```

**Entregas (Android):**
```
/android-app/app/src/main/java/com/cirurgiao/features/
├── courses/
│   ├── presentation/
│   │   ├── CourseListScreen.kt
│   │   └── CourseDetailScreen.kt
└── videoplayer/
    └── VideoPlayerScreen.kt
```

**Critérios de Conclusão:**
- ✅ Player de vídeo funcionando
- ✅ Lista de cursos implementada
- ✅ Integração com backend completa

---

### 📊 CHECKPOINT SEMANAS 3-4

**Entregas Esperadas:**
- ✅ Cloudflare Stream integrado
- ✅ Dashboard admin funcionando
- ✅ Upload de vídeos implementado
- ✅ Sistema de cursos e módulos criado
- ✅ Player de vídeo em todas plataformas

---

### 📅 SEMANAS 5-6: SISTEMA DE PROGRESSO & ANALYTICS

#### **Objetivos das Semanas 5-6:**
- Implementar sistema de progresso do aluno
- Integrar analytics (Cloudflare + BigQuery)
- Criar dashboard de métricas para admin
- Implementar tracking de visualizações

---

#### **BACKEND-SENIOR-01 (Rafael) - Backend Developer**
**Carga:** 80h (2 semanas) | **Prioridade:** 🔴 Crítica

**Tarefas:**
- [ ] Criar módulo de progresso
- [ ] Integrar Cloudflare Analytics API
- [ ] Setup BigQuery para analytics customizado
- [ ] Criar endpoints de métricas
- [ ] Implementar event streaming

**Entregas:**
```
/backend-api/src/modules/
├── progress/
│   ├── progress.controller.ts
│   ├── progress.service.ts
│   ├── entities/
│   │   └── progress.entity.ts
│   └── dto/
│       └── update-progress.dto.ts
├── analytics/
│   ├── analytics.controller.ts
│   ├── analytics.service.ts
│   ├── cloudflare/
│   │   └── cloudflare-analytics.service.ts
│   └── bigquery/
│       └── bigquery.service.ts
└── events/
    ├── events.service.ts
    └── dto/
        └── track-event.dto.ts
```

**Schema de Progresso:**
```prisma
model Progress {
  id              String   @id @default(uuid())
  userId          String
  courseId        String
  videoId         String?
  completedAt     DateTime?
  watchedDuration Int      @default(0) // em segundos
  totalDuration   Int      // em segundos
  percentage      Float    @default(0)
  lastWatchedAt   DateTime @default(now())
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  user   User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  course Course  @relation(fields: [courseId], references: [id], onDelete: Cascade)
  video  Video?  @relation(fields: [videoId], references: [id], onDelete: Cascade)
  
  @@unique([userId, courseId, videoId])
  @@map("progress")
}
```

**Integração BigQuery:**
```typescript
// analytics/bigquery/bigquery.service.ts
export class BigQueryService {
  private bigquery: BigQuery;

  constructor() {
    this.bigquery = new BigQuery({
      projectId: process.env.GCP_PROJECT_ID,
      keyFilename: process.env.GCP_KEY_FILE,
    });
  }

  async trackEvent(event: TrackEventDto): Promise<void> {
    const dataset = this.bigquery.dataset('cirurgiao_analytics');
    const table = dataset.table('user_events');
    
    await table.insert([{
      user_id: event.userId,
      event_type: event.eventType,
      event_data: JSON.stringify(event.data),
      timestamp: new Date().toISOString(),
    }]);
  }

  async getVideoAnalytics(videoId: string): Promise<VideoAnalytics> {
    const query = `
      SELECT
        COUNT(DISTINCT user_id) as unique_viewers,
        AVG(watched_duration) as avg_watch_time,
        SUM(CASE WHEN percentage >= 90 THEN 1 ELSE 0 END) as completions
      FROM \`cirurgiao_analytics.user_events\`
      WHERE event_type = 'video_watch'
        AND JSON_EXTRACT_SCALAR(event_data, '$.videoId') = @videoId
    `;
    
    const [rows] = await this.bigquery.query({
      query,
      params: { videoId },
    });
    
    return rows[0];
  }
}
```

**Critérios de Conclusão:**
- ✅ Sistema de progresso funcionando
- ✅ Analytics integrado (Cloudflare + BigQuery)
- ✅ Event streaming implementado
- ✅ Endpoints de métricas criados

---

### 📊 CHECKPOINT SEMANA 6 (FIM DA FASE 1)

**Entregas da Fase 1:**
- ✅ Infraestrutura completa (GCP + Cloudflare)
- ✅ Autenticação e permissões
- ✅ Dashboard administrativo
- ✅ Sistema de cursos e módulos
- ✅ Upload e streaming de vídeos
- ✅ Sistema de progresso
- ✅ Analytics básico

**Próxima Fase:**
- Fase 2: Desenvolvimento Core (Semanas 7-14)
- Foco: Gamificação, Fórum, Notificações

---

## 🎯 FASE 2: DESENVOLVIMENTO CORE (SEMANAS 7-14)

### 🎯 Objetivos da Fase
- Implementar sistema de gamificação com IA
- Criar fórum de comunidade
- Implementar sistema de notificações push
- Desenvolver features de engajamento

---

### 📅 SEMANAS 7-10: GAMIFICAÇÃO COM IA

#### **Objetivos:**
- Sistema de pontos e XP (estilo Duolingo)
- Níveis e rankings
- Conquistas (achievements)
- Desafios diários
- IA para personalização

---

#### **BACKEND-SENIOR-01 (Rafael) - Backend Developer**
**Carga:** 160h (4 semanas) | **Prioridade:** 🔴 Crítica

**Tarefas:**
- [ ] Criar módulo de gamificação
- [ ] Implementar sistema de pontos/XP
- [ ] Criar sistema de níveis
- [ ] Implementar conquistas
- [ ] Integrar OpenAI para personalização
- [ ] Criar sistema de desafios

**Entregas:**
```
/backend-api/src/modules/
├── gamification/
│   ├── gamification.controller.ts
│   ├── gamification.service.ts
│   ├── entities/
│   │   ├── user-stats.entity.ts
│   │   ├── achievement.entity.ts
│   │   └── challenge.entity.ts
│   └── dto/
├── ai/
│   ├── openai.service.ts
│   ├── personalization.service.ts
│   └── dto/
│       └── generate-challenge.dto.ts
└── leaderboard/
    ├── leaderboard.controller.ts
    └── leaderboard.service.ts
```

**Schema de Gamificação:**
```prisma
model UserStats {
  id            String   @id @default(uuid())
  userId        String   @unique
  xp            Int      @default(0)
  level         Int      @default(1)
  streak        Int      @default(0)
  lastActiveAt  DateTime @default(now())
  totalPoints   Int      @default(0)
  rank          Int?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  
  user         User                @relation(fields: [userId], references: [id], onDelete: Cascade)
  achievements UserAchievement[]
  challenges   UserChallenge[]
  
  @@map("user_stats")
}

model Achievement {
  id          String   @id @default(uuid())
  name        String
  description String
  icon        String
  points      Int
  category    String
  requirement Json     // Critérios para desbloquear
  createdAt   DateTime @default(now())
  
  userAchievements UserAchievement[]
  
  @@map("achievements")
}

model UserAchievement {
  id            String   @id @default(uuid())
  userId        String
  achievementId String
  unlockedAt    DateTime @default(now())
  
  userStats   UserStats   @relation(fields: [userId], references: [userId], onDelete: Cascade)
  achievement Achievement @relation(fields: [achievementId], references: [id], onDelete: Cascade)
  
  @@unique([userId, achievementId])
  @@map("user_achievements")
}

model Challenge {
  id          String   @id @default(uuid())
  title       String
  description String
  type        String   // daily, weekly, custom
  difficulty  String   // easy, medium, hard
  points      Int
  requirement Json
  expiresAt   DateTime?
  createdAt   DateTime @default(now())
  
  userChallenges UserChallenge[]
  
  @@map("challenges")
}

model UserChallenge {
  id          String    @id @default(uuid())
  userId      String
  challengeId String
  progress    Int       @default(0)
  completed   Boolean   @default(false)
  completedAt DateTime?
  createdAt   DateTime  @default(now())
  
  userStats UserStats @relation(fields: [userId], references: [userId], onDelete: Cascade)
  challenge Challenge @relation(fields: [challengeId], references: [id], onDelete: Cascade)
  
  @@unique([userId, challengeId])
  @@map("user_challenges")
}
```

**Integração OpenAI:**
```typescript
// ai/personalization.service.ts
export class PersonalizationService {
  private openai: OpenAI;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
  }

  async generatePersonalizedChallenge(userId: string): Promise<Challenge> {
    const userProgress = await this.getUserProgress(userId);
    const userInterests = await this.getUserInterests(userId);
    
    const prompt = `
      Crie um desafio personalizado para um aluno de cirurgia com o seguinte perfil:
      - Nível: ${userProgress.level}
      - Áreas de interesse: ${userInterests.join(', ')}
      - Progresso recente: ${userProgress.recentTopics.join(', ')}
      
      O desafio deve ser:
