# 🎼 MAESTRO - Guia de Orquestração da Equipe

## 📋 ÍNDICE

1. [Visão Geral](#visão-geral)
2. [Hierarquia e Estrutura](#hierarquia-e-estrutura)
3. [Fluxos de Trabalho](#fluxos-de-trabalho)
4. [Regras de Comunicação](#regras-de-comunicação)
5. [Ciclos de Desenvolvimento](#ciclos-de-desenvolvimento)
6. [Resolução de Conflitos](#resolução-de-conflitos)
7. [Pontos de Sincronização](#pontos-de-sincronização)
8. [Gatilhos e Handoffs](#gatilhos-e-handoffs)

---

## 🎯 VISÃO GERAL

Este documento serve como **partitura** para a orquestração da equipe do Projeto Cirurgião. Assim como um maestro coordena uma orquestra, este guia define **quando cada agente deve atuar**, **como devem colaborar** e **quem tem autoridade** em cada situação.

### Princípios Fundamentais

1. **Hierarquia Clara**: Decisões fluem de cima para baixo, feedback flui de baixo para cima
2. **Autonomia com Responsabilidade**: Cada agente tem autonomia em sua área, mas deve reportar decisões críticas
3. **Colaboração Horizontal**: Agentes do mesmo nível colaboram diretamente sem intermediários
4. **Documentação Obrigatória**: Toda decisão importante deve ser documentada
5. **Feedback Contínuo**: Ciclos curtos de feedback entre todos os níveis

---

## 🏛️ HIERARQUIA E ESTRUTURA

### Estrutura Organizacional

```
NÍVEL 1: ESTRATÉGIA
└── PO-01 (Ana Paula) - Product Owner
    │
    ├─── Define: Visão, Roadmap, Prioridades
    ├─── Decide: O QUE construir e QUANDO
    └─── Reporta: Stakeholders/Cliente

NÍVEL 2: LIDERANÇA TÉCNICA
└── TECH-LEAD-01 (Ricardo) - Tech Lead
    │
    ├─── Define: Arquitetura, Stack, Padrões
    ├─── Decide: COMO construir tecnicamente
    ├─── Reporta: PO-01
    └─── Lidera: Todos os agentes técnicos

NÍVEL 3: ESPECIALISTAS SENIORES (Autonomia Alta)
├── BACKEND-SENIOR-01 (Rafael)
│   ├─── Área: Backend, APIs, Database
│   ├─── Autonomia: Decisões de implementação backend
│   └─── Reporta: TECH-LEAD-01
│
├── DEVOPS-01 (Carolina)
│   ├─── Área: Infraestrutura, CI/CD, Deploy
│   ├─── Autonomia: Decisões de infraestrutura
│   └─── Reporta: TECH-LEAD-01
│
├── IOS-SENIOR-01 (Lucas)
│   ├─── Área: Aplicativo iOS
│   ├─── Autonomia: Decisões de implementação iOS
│   ├─── Reporta: TECH-LEAD-01
│   └─── Mentora: MOBILE-PLENO-01
│
└── ANDROID-SENIOR-01 (Marina)
    ├─── Área: Aplicativo Android
    ├─── Autonomia: Decisões de implementação Android
    ├─── Reporta: TECH-LEAD-01
    └─── Mentora: MOBILE-PLENO-01

NÍVEL 4: ESPECIALISTAS (Autonomia Média)
├── MOBILE-PLENO-01 (Pedro)
│   ├─── Área: Suporte iOS + Android
│   ├─── Autonomia: Features secundárias
│   └─── Reporta: IOS-SENIOR-01 + ANDROID-SENIOR-01
│
├── FRONTEND-01 (Juliana)
│   ├─── Área: Plataforma Web
│   ├─── Autonomia: Decisões de implementação frontend
│   └─── Reporta: TECH-LEAD-01
│
├── DESIGNER-01 (Beatriz)
│   ├─── Área: UX/UI, Design System
│   ├─── Autonomia: Decisões de design
│   └─── Reporta: PO-01 + TECH-LEAD-01
│
└── QA-01 (Carlos)
    ├─── Área: Qualidade, Testes
    ├─── Autonomia: Estratégia de testes
    └─── Reporta: TECH-LEAD-01
```

---

## 🔄 FLUXOS DE TRABALHO

### 1. FLUXO DE NOVA FEATURE

```
INÍCIO → PO-01 → TECH-LEAD-01 → DESIGNER-01 → DESENVOLVEDORES → QA-01 → PO-01 → FIM

Detalhamento:

1️⃣ PO-01 (Product Owner)
   ├─ Cria user story com acceptance criteria
   ├─ Define prioridade e valor de negócio
   └─ HANDOFF → TECH-LEAD-01

2️⃣ TECH-LEAD-01 (Tech Lead)
   ├─ Avalia viabilidade técnica
   ├─ Estima esforço (story points)
   ├─ Define arquitetura se necessário
   ├─ Decide quais agentes envolver
   └─ HANDOFF → DESIGNER-01 (se precisa design)
                 ou DESENVOLVEDORES (se não precisa)

3️⃣ DESIGNER-01 (Designer) [SE NECESSÁRIO]
   ├─ Cria wireframes/mockups
   ├─ Valida com PO-01
   ├─ Cria specs para developers
   └─ HANDOFF → DESENVOLVEDORES

4️⃣ DESENVOLVEDORES (Paralelo)
   │
   ├─ BACKEND-SENIOR-01
   │  ├─ Implementa API endpoints
   │  ├─ Testa localmente
   │  └─ Cria PR → Code Review TECH-LEAD-01
   │
   ├─ IOS-SENIOR-01
   │  ├─ Implementa feature iOS
   │  ├─ Testa em simulador/device
   │  └─ Cria PR → Code Review TECH-LEAD-01
   │
   ├─ ANDROID-SENIOR-01
   │  ├─ Implementa feature Android
   │  ├─ Testa em emulador/device
   │  └─ Cria PR → Code Review TECH-LEAD-01
   │
   ├─ FRONTEND-01 [SE APLICÁVEL]
   │  ├─ Implementa feature Web
   │  ├─ Testa em browsers
   │  └─ Cria PR → Code Review TECH-LEAD-01
   │
   └─ MOBILE-PLENO-01 [SE NECESSÁRIO]
      ├─ Suporta iOS-SENIOR-01 ou ANDROID-SENIOR-01
      ├─ Implementa features secundárias
      └─ Cria PR → Code Review do Sênior correspondente

5️⃣ TECH-LEAD-01 (Code Review)
   ├─ Revisa arquitetura e qualidade
   ├─ Aprova ou solicita mudanças
   └─ HANDOFF → DEVOPS-01 (após aprovação)

6️⃣ DEVOPS-01 (Deploy)
   ├─ Merge para branch de desenvolvimento
   ├─ Deploy automático para ambiente de staging
   ├─ Verifica logs e métricas
   └─ HANDOFF → QA-01

7️⃣ QA-01 (Quality Assurance)
   ├─ Executa test cases
   ├─ Testa em múltiplas plataformas
   ├─ Reporta bugs (se houver) → DESENVOLVEDORES
   ├─ Aprova feature (se OK)
   └─ HANDOFF → PO-01

8️⃣ PO-01 (Validação Final)
   ├─ Valida acceptance criteria
   ├─ Aprova para produção
   └─ HANDOFF → DEVOPS-01 (deploy produção)

9️⃣ DEVOPS-01 (Deploy Produção)
   ├─ Deploy para produção
   ├─ Monitora métricas
   └─ FIM DO FLUXO
```

### 2. FLUXO DE BUG CRÍTICO

```
DESCOBERTA → QA-01/USUÁRIO → TECH-LEAD-01 → DESENVOLVEDOR → QA-01 → PRODUÇÃO

1️⃣ Descoberta
   ├─ QA-01 encontra bug OU
   └─ Usuário reporta bug

2️⃣ QA-01 (Triagem)
   ├─ Documenta bug (steps, logs, screenshots)
   ├─ Define severidade (Critical, High, Medium, Low)
   └─ HANDOFF → TECH-LEAD-01 (se Critical/High)
                 ou DESENVOLVEDOR direto (se Medium/Low)

3️⃣ TECH-LEAD-01 (Se Critical/High)
   ├─ Avalia impacto
   ├─ Prioriza correção
   ├─ Atribui desenvolvedor
   └─ HANDOFF → DESENVOLVEDOR

4️⃣ DESENVOLVEDOR
   ├─ Investiga causa raiz
   ├─ Implementa fix
   ├─ Testa localmente
   ├─ Cria PR (fast-track se critical)
   └─ HANDOFF → TECH-LEAD-01 (review rápido)

5️⃣ TECH-LEAD-01 (Review Rápido)
   ├─ Valida fix
   ├─ Aprova PR
   └─ HANDOFF → DEVOPS-01

6️⃣ DEVOPS-01 (Hotfix Deploy)
   ├─ Deploy para staging
   └─ HANDOFF → QA-01

7️⃣ QA-01 (Validação)
   ├─ Testa fix
   ├─ Valida que não quebrou nada
   └─ HANDOFF → DEVOPS-01 (se OK)

8️⃣ DEVOPS-01 (Produção)
   ├─ Deploy para produção
   ├─ Monitora
   └─ Notifica PO-01 e TECH-LEAD-01
```

### 3. FLUXO DE DECISÃO ARQUITETURAL

```
NECESSIDADE → TECH-LEAD-01 → ESPECIALISTAS → TECH-LEAD-01 → PO-01 → DECISÃO

1️⃣ Identificação da Necessidade
   ├─ Qualquer agente identifica necessidade de decisão arquitetural
   └─ HANDOFF → TECH-LEAD-01

2️⃣ TECH-LEAD-01 (Análise Inicial)
   ├─ Avalia escopo da decisão
   ├─ Identifica stakeholders técnicos
   ├─ Convoca reunião técnica
   └─ HANDOFF → ESPECIALISTAS relevantes

3️⃣ ESPECIALISTAS (Discussão)
   ├─ BACKEND-SENIOR-01 (se envolve backend)
   ├─ IOS-SENIOR-01 (se envolve iOS)
   ├─ ANDROID-SENIOR-01 (se envolve Android)
   ├─ FRONTEND-01 (se envolve web)
   ├─ DEVOPS-01 (se envolve infra)
   ├─ Cada um apresenta perspectiva
   ├─ Discutem trade-offs
   └─ HANDOFF → TECH-LEAD-01

4️⃣ TECH-LEAD-01 (Proposta)
   ├─ Consolida inputs
   ├─ Cria proposta técnica
   ├─ Documenta rationale
   ├─ Avalia impacto em timeline/custo
   └─ HANDOFF → PO-01 (se impacta roadmap)
                 ou DECISÃO FINAL (se puramente técnico)

5️⃣ PO-01 (Se Necessário)
   ├─ Avalia impacto no produto
   ├─ Valida com stakeholders
   ├─ Aprova ou solicita alternativas
   └─ HANDOFF → TECH-LEAD-01

6️⃣ TECH-LEAD-01 (Decisão Final)
   ├─ Toma decisão final
   ├─ Documenta em /docs/decisions/
   ├─ Comunica para toda equipe
   └─ Atribui implementação
```

---

## 📢 REGRAS DE COMUNICAÇÃO

### Regra 1: Comunicação Vertical (Hierárquica)

**PARA CIMA (Reportar):**
- **Quando:** Bloqueios, decisões críticas, desvios de prazo, riscos
- **Como:** Documento formal, reunião 1:1, ou mensagem direta
- **Frequência:** Imediato (bloqueios) ou Semanal (status)

**PARA BAIXO (Delegar):**
- **Quando:** Atribuir tarefas, dar feedback, tomar decisões
- **Como:** User stories, reuniões, mensagens diretas
- **Frequência:** Conforme necessário

### Regra 2: Comunicação Horizontal (Entre Pares)

**COLABORAÇÃO DIRETA:**
- Agentes do mesmo nível colaboram diretamente
- Não precisam de aprovação para discutir soluções
- Devem documentar decisões importantes

**Exemplos:**
- IOS-SENIOR-01 ↔ ANDROID-SENIOR-01: Feature parity
- BACKEND-SENIOR-01 ↔ FRONTEND-01: Contratos de API
- DESIGNER-01 ↔ Desenvolvedores: Implementação de designs

### Regra 3: Comunicação Diagonal (Cross-Level)

**MENTORIA:**
- IOS-SENIOR-01 → MOBILE-PLENO-01
- ANDROID-SENIOR-01 → MOBILE-PLENO-01
- TECH-LEAD-01 → Todos (mentoria técnica)

**CONSULTA TÉCNICA:**
- Qualquer agente pode consultar especialista
- Deve informar seu superior se decisão impactar seu trabalho

### Regra 4: Canais de Comunicação

**SÍNCRONO (Reuniões):**
- Daily Standup: 15min, todos os dias
- Sprint Planning: 2h, início de sprint
- Sprint Review: 1h, fim de sprint
- Sprint Retrospective: 1h, fim de sprint
- Tech Sync: 1h, semanal (TECH-LEAD-01 + Seniores)

**ASSÍNCRONO (Documentação):**
- User Stories: Jira/Linear
- Decisões Técnicas: /docs/decisions/
- Status Reports: /docs/reports/
- Code Reviews: GitHub/GitLab
- Bugs: Jira/Linear

---

## 🔁 CICLOS DE DESENVOLVIMENTO

### Sprint (2 semanas)

```
DIA 1 (Segunda): SPRINT PLANNING
├─ PO-01: Apresenta user stories priorizadas
├─ TECH-LEAD-01: Avalia viabilidade e estima
├─ Equipe: Discute e commita com sprint goal
└─ Resultado: Sprint backlog definido

DIA 2-9 (Terça-Quarta): DESENVOLVIMENTO
├─ Daily Standup (15min, todos os dias)
│  ├─ O que fiz ontem?
│  ├─ O que farei hoje?
│  └─ Tenho algum bloqueio?
│
├─ Desenvolvimento paralelo
├─ Code reviews contínuos
├─ QA contínuo (testes em staging)
└─ Pair programming (quando necessário)

DIA 10 (Quinta): SPRINT REVIEW
├─ Desenvolvedores: Demonstram features
├─ PO-01: Valida acceptance criteria
├─ Stakeholders: Dão feedback
└─ Resultado: Features aceitas ou rejeitadas

DIA 10 (Quinta): SPRINT RETROSPECTIVE
├─ Equipe: Discute o que funcionou
├─ Equipe: Discute o que não funcionou
├─ Equipe: Define ações de melhoria
└─ Resultado: Action items para próximo sprint
```

### Ciclo de Code Review

```
1. DESENVOLVEDOR cria PR
   ├─ Título descritivo
   ├─ Descrição do que foi feito
   ├─ Screenshots (se UI)
   ├─ Testes passando
   └─ Self-review completo

2. TECH-LEAD-01 ou SÊNIOR revisa
   ├─ Arquitetura
   ├─ Qualidade de código
   ├─ Performance
   ├─ Segurança
   ├─ Testes
   └─ Documentação

3. FEEDBACK
   ├─ Aprovado: Merge
   ├─ Mudanças solicitadas: Desenvolvedor ajusta
   └─ Discussão: Se necessário, reunião técnica

4. MERGE
   ├─ DEVOPS-01: Deploy automático para staging
   └─ QA-01: Notificado para testar
```

---

## ⚖️ RESOLUÇÃO DE CONFLITOS

### Tipo 1: Conflito Técnico (Entre Desenvolvedores)

```
CONFLITO → Discussão Direta → TECH-LEAD-01 → DECISÃO

1. Desenvolvedores tentam resolver diretamente
2. Se não chegam a consenso em 30min
3. Escalam para TECH-LEAD-01
4. TECH-LEAD-01 ouve ambos os lados
5. TECH-LEAD-01 decide baseado em:
   ├─ Arquitetura do sistema
   ├─ Performance
   ├─ Manutenibilidade
   ├─ Time-to-market
   └─ Technical debt
6. Decisão é final e documentada
```

### Tipo 2: Conflito de Prioridade (Feature vs Bug)

```
CONFLITO → TECH-LEAD-01 + PO-01 → DECISÃO

1. TECH-LEAD-01 avalia impacto técnico
2. PO-01 avalia impacto no negócio
3. Juntos decidem prioridade
4. Comunicam decisão para equipe
```

### Tipo 3: Conflito de Design (Designer vs Desenvolvedor)

```
CONFLITO → Discussão → TECH-LEAD-01 + PO-01 → DECISÃO

1. DESIGNER-01 e Desenvolvedor discutem
2. DESIGNER-01 explica rationale do design
3. Desenvolvedor explica limitação técnica
4. Tentam encontrar solução que atenda ambos
5. Se não resolvem, escalam para:
   ├─ TECH-LEAD-01 (viabilidade técnica)
   └─ PO-01 (impacto no usuário)
6. Decisão conjunta é tomada
```

---

## 🎯 PONTOS DE SINCRONIZAÇÃO

### Diário (Daily Standup)

**Participantes:** Todos
**Duração:** 15 minutos
**Formato:**
```
Cada agente responde:
1. O que fiz ontem?
2. O que farei hoje?
3. Tenho algum bloqueio?

TECH-LEAD-01:
- Anota bloqueios
- Atribui resolução
- Ajusta prioridades se necessário
```

### Semanal (Tech Sync)

**Participantes:** TECH-LEAD-01 + Seniores
**Duração:** 1 hora
**Agenda:**
```
1. Status de cada plataforma (10min cada)
   ├─ BACKEND-SENIOR-01
   ├─ IOS-SENIOR-01
   ├─ ANDROID-SENIOR-01
   └─ FRONTEND-01

2. Decisões arquiteturais pendentes (15min)

3. Bloqueios técnicos (10min)

4. Alinhamento de features (10min)
   ├─ Feature parity iOS/Android
   └─ Integração Backend/Frontend

5. Action items (5min)
```

### Quinzenal (Sprint Ceremonies)

**Sprint Planning:**
- PO-01 apresenta prioridades
- TECH-LEAD-01 + Equipe estimam
- Equipe commita com sprint goal

**Sprint Review:**
- Demonstração de features
- Validação com PO-01
- Feedback de stakeholders

**Sprint Retrospective:**
- O que funcionou bem?
- O que pode melhorar?
- Action items para próximo sprint

### Mensal (Roadmap Review)

**Participantes:** PO-01 + TECH-LEAD-01
**Duração:** 2 horas
**Agenda:**
```
1. Review de métricas do produto
2. Ajustes no roadmap
3. Priorização de technical debt
4. Planejamento de próximos 3 meses
```

---

## 🔀 GATILHOS E HANDOFFS

### Gatilho 1: Nova User Story

```
TRIGGER: PO-01 cria user story
↓
ACTION: Notifica TECH-LEAD-01
↓
TECH-LEAD-01 avalia e estima
↓
Se precisa design → HANDOFF para DESIGNER-01
Se não precisa → Vai para backlog
```

### Gatilho 2: PR Criado

```
TRIGGER: Desenvolvedor cria PR
↓
ACTION: Notifica TECH-LEAD-01 ou Sênior correspondente
↓
Code review em até 24h
↓
Se aprovado → HANDOFF para DEVOPS-01 (merge + deploy)
Se mudanças → HANDOFF de volta para Desenvolvedor
```

### Gatilho 3: Deploy para Staging

```
TRIGGER: DEVOPS-01 faz deploy para staging
↓
ACTION: Notifica QA-01
↓
QA-01 testa em até 48h
↓
Se OK → HANDOFF para PO-01 (validação final)
Se bugs → HANDOFF para Desenvolvedor (correção)
```

### Gatilho 4: Bug Crítico Encontrado

```
TRIGGER: Bug crítico descoberto
↓
ACTION: QA-01 documenta e notifica TECH-LEAD-01 IMEDIATAMENTE
↓
TECH-LEAD-01 prioriza e atribui desenvolvedor
↓
Desenvolvedor corrige em até 4h
↓
Fast-track code review (30min)
↓
HANDOFF para DEVOPS-01 (hotfix deploy)
↓
HANDOFF para QA-01 (validação rápida)
↓
HANDOFF para DEVOPS-01 (produção)
```

### Gatilho 5: Bloqueio Técnico

```
TRIGGER: Desenvolvedor encontra bloqueio
↓
ACTION: Tenta resolver por 30min
↓
Se não resolve → Notifica superior imediato
↓
Superior tenta ajudar por 1h
↓
Se não resolve → Escala para TECH-LEAD-01
↓
TECH-LEAD-01 convoca especialistas se necessário
↓
Decisão tomada e documentada
```

### Gatilho 6: Mudança de Prioridade

```
TRIGGER: PO-01 muda prioridade de feature
↓
ACTION: Notifica TECH-LEAD-01
↓
TECH-LEAD-01 avalia impacto no sprint
↓
Se impacta sprint atual → Reunião emergencial com equipe
Se não impacta → Ajusta backlog
↓
Comunica mudança para todos os agentes afetados
```

---

## 📊 MÉTRICAS DE ORQUESTRAÇÃO

### Métricas de Fluxo

**Lead Time:** Tempo de user story → produção
- **Target:** < 2 sprints (4 semanas)
- **Medição:** Jira/Linear

**Cycle Time:** Tempo de desenvolvimento → produção
- **Target:** < 1 sprint (2 semanas)
- **Medição:** Jira/Linear

**Code Review Time:** Tempo de PR criado → aprovado
- **Target:** < 24 horas
- **Medição:** GitHub/GitLab

**Deploy Frequency:** Quantos deploys por semana
- **Target:** Daily (5x/semana)
- **Medição:** CI/CD logs

### Métricas de Qualidade

**Bug Escape Rate:** Bugs que chegam em produção
- **Target:** < 5% das features
- **Medição:** Jira/Linear

**Test Coverage:** Cobertura de testes
- **Target:** > 80%
- **Medição:** Coverage reports

**Crash-Free Rate:** Apps sem crashes
- **Target:** > 99.5%
- **Medição:** Firebase Crashlytics

### Métricas de Colaboração

**PR Review Participation:** % de PRs revisados por cada agente
- **Target:** 100% dos PRs revisados
- **Medição:** GitHub/GitLab

**Blocker Resolution Time:** Tempo para resolver bloqueios
- **Target:** < 4 horas
- **Medição:** Daily standup tracking

**Communication Response Time:** Tempo de resposta em comunicações
- **Target:** < 2 horas (working hours)
- **Medição:** Slack/Teams analytics

---

## 🎼 REGRAS DE OURO DA ORQUESTRAÇÃO

### 1. Hierarquia é Respeitada, Mas Não é Barreira

- Decisões fluem pela hierarquia
- Colaboração acontece em todos os níveis
- Qualquer agente pode sugerir melhorias
- Feedback é sempre bem-vindo

### 2. Autonomia com Responsabilidade

- Cada agente tem autonomia em sua área
- Mas deve documentar decisões importantes
- E comunicar impactos para outros agentes
- Decisões críticas sobem para aprovação

### 3. Comunicação é Obrigatória, Não Opcional

- Bloqueios devem ser comunicados imediatamente
- Status deve ser atualizado diariamente
- Decisões devem ser documentadas
- Feedback deve ser dado e recebido

### 4. Qualidade Nunca é Negociada

- Testes são obrigatórios
- Code review é obrigatório
- Documentação é obrigatória
- Performance é obrigatória

### 5. Colaboração Supera Competição

- Sucesso é da equipe, não individual
- Ajudar colegas é esperado
- Compartilhar conhecimento é valorizado
- Pair programming é encorajado

### 6. Falhas São Oportunidades de Aprendizado

- Erros acontecem e são aceitos
- Mas devem ser documentados
- E aprendizados devem ser compartilhados
- Retrospectivas são para melhorar, não culpar

### 7. Usuário Final é o Norte

- Toda decisão considera impacto no usuário
- UX supera preferências técnicas
- Performance é feature
- Acessibilidade é obrigatória

---

## 🚨 SITUAÇÕES ESPECIAIS

### Situação 1: Agente Ausente

```
Se DESENVOLVEDOR ausente:
├─ TECH-LEAD-01 redistribui tarefas
└─ Pair programming para conhecimento compartilhado

Se TECH-LEAD-01 ausente:
├─ BACKEND-SENIOR-01 assume temporariamente
└─ Decisões críticas aguardam retorno

Se PO-01 ausente:
├─ TECH-LEAD-01 assume priorização temporariamente
└─ Baseado em roadmap existente
```

### Situação 2: Crise de Produção

```
1. QA-01 ou DEVOPS-01 detecta problema crítico
2. Notifica TECH-LEAD-01 IMEDIATAMENTE
3. TECH-LEAD-01 convoca war room:
   ├─ Desenvolvedores relevantes
   ├─ DEVOPS-01
   └─ QA-01
4. Equipe trabalha até resolver
5. Post-mortem obrigatório após resolução
6. Documentação de lições aprendidas
```

### Situação 3: Mudança de Escopo Significativa

```
1. PO-01 identifica necessidade de mudança
2. Reúne com TECH-LEAD-01
3. TECH-LEAD-01 avalia impacto técnico
4. Convoca reunião com toda equipe
5. Equipe discute e re-estima
6. PO-01 decide se prossegue
7. Roadmap é atualizado
8. Stakeholders são comunicados
```

---

## 📚 DOCUMENTAÇÃO OBRIGATÓRIA

### Por Agente

**PO-01:**
- User stories com acceptance criteria
- Product roadmap
- Sprint goals
- Stakeholder updates mensais

**TECH-LEAD-01:**
- Decisões arquiteturais (/docs/decisions/)
- Tech sync notes (/docs/meetings/)
- Code review guidelines
- Technical roadmap

**Desenvolvedores:**
- Code comments (lógicas complexas)
- PR descriptions (o que e por quê)
- API documentation (Swagger/OpenAPI)
- README files (setup, usage)

**DESIGNER-01:**
- Design system documentation
- Design specs para developers
- User research findings
- Usability test reports

**QA-01:**
- Test plans
- Test cases
- Bug reports
- Test reports por sprint

**DEVOPS-01:**
- Infrastructure documentation
- Runbooks
- Deployment procedures
- Incident reports

---

## 🎯 CHECKLIST DO MAESTRO

Use este checklist para garantir que a orquestra está tocando em harmonia:

### Diário
- [ ] Daily standup realizado?
- [ ] Bloqueios identificados e atribuídos?
- [ ] PRs revisados em até 24h?
- [ ] Comunicação fluindo entre agentes?

### Semanal
- [ ] Tech sync realizado?
- [ ] Status reports atualizados?
- [ ] Métricas revisadas?
- [ ] Riscos identificados e mitigados?

### Quinzenal (Sprint)
- [ ] Sprint planning realizado?
- [ ] Sprint goal claro?
- [ ] Sprint review com demos?
- [ ] Retrospective com action items?

### Mensal
- [ ] Roadmap review realizado?
- [ ] Métricas de produto an
