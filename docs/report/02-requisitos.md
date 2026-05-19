# 2. Requisitos

## Requisitos funcionais

| ID    | Descrição                                                     | Prioridade | Rota               | Status          |
| ----- | ------------------------------------------------------------- | ---------- | ------------------ | --------------- |
| RF001 | Cadastro de pacientes com validação de CPF (algoritmo mod 11) | Alta       | `/pacientes`       | ✅ Implementado |
| RF002 | Agendar, cancelar e concluir consultas online                 | Alta       | `/agendamentos`    | ✅ Implementado |
| RF003 | Visualizar e registrar prontuário eletrônico                  | Alta       | `/prontuario`      | ✅ Implementado |
| RF004 | Teleconsulta real via videoconferência (Jitsi Meet)           | Média      | `/telemedicina`    | ✅ Implementado |
| RF005 | Controle de acesso por perfil (RBAC)                          | Alta       | Middleware + Proxy | ✅ Implementado |
| RF006 | Emissão de receitas digitais                                  | Média      | `/receitas`        | ✅ Implementado |
| RF007 | Gestão de profissionais de saúde (CRUD)                       | Média      | `/profissionais`   | ✅ Implementado |
| RF008 | Relatórios administrativos com métricas                       | Média      | `/relatorios`      | ✅ Implementado |
| RF009 | Dashboard com métricas por perfil                             | Alta       | `/dashboard`       | ✅ Implementado |
| RF010 | Notificações de consultas próximas (48h)                      | Baixa      | Layout global      | ✅ Implementado |
| RF011 | Edição e exclusão de pacientes                                | Média      | `/pacientes`       | ✅ Implementado |

## Requisitos não funcionais

| ID     | Descrição                                                              | Prioridade | Status                          |
| ------ | ---------------------------------------------------------------------- | ---------- | ------------------------------- |
| RNF001 | Interface responsiva (mobile/desktop)                                  | Média      | ✅ Tailwind + layout responsivo |
| RNF002 | Conformidade LGPD (banner de consentimento, avisos em dados sensíveis) | Alta       | ✅ Banner + disclaimers         |
| RNF003 | Usabilidade (componentes shadcn/ui, tooltips, feedbacks visuais)       | Média      | ✅ Implementado                 |
| RNF004 | Acessibilidade (skip-to-content, aria-labels, focus-visible)           | Média      | ✅ WCAG 2.1 AA                  |
| RNF005 | Tema claro/escuro                                                      | Baixa      | ✅ next-themes                  |
| RNF006 | Validação de dados no cliente e servidor (Zod)                         | Alta       | ✅ Schemas compartilhados       |
| RNF007 | Estados de loading, error e not-found                                  | Média      | ✅ Implementado                 |

## Regras de acesso (RBAC)

| Rota             | Admin | Profissional | Paciente |
| ---------------- | :---: | :----------: | :------: |
| `/dashboard`     |  ✅   |      ✅      |    ✅    |
| `/pacientes`     |  ✅   |      ❌      |    ❌    |
| `/profissionais` |  ✅   |      ❌      |    ❌    |
| `/agendamentos`  |  ✅   |      ✅      |    ✅    |
| `/prontuario`    |  ❌   |      ✅      |    ✅    |
| `/receitas`      |  ❌   |      ✅      |    ❌    |
| `/telemedicina`  |  ❌   |      ✅      |    ✅    |
| `/relatorios`    |  ✅   |      ❌      |    ❌    |
