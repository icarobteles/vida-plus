# 3. Modelagem e Arquitetura

## Stack tecnológica

| Camada           | Tecnologia                         | Versão |
| ---------------- | ---------------------------------- | ------ |
| Framework        | Next.js (App Router, Turbopack)    | 16.2   |
| UI               | React + TypeScript                 | 19     |
| Estilização      | Tailwind CSS                       | 4.x    |
| Componentes      | shadcn/ui + @base-ui/react         | —      |
| Autenticação     | Auth.js (NextAuth v5, Credentials) | 5.x    |
| ORM              | Prisma (adapter better-sqlite3)    | 7.x    |
| Banco de dados   | SQLite                             | —      |
| Validação        | Zod + React Hook Form              | —      |
| Videoconferência | Jitsi Meet (@jitsi/react-sdk)      | —      |
| Testes unitários | Vitest                             | —      |
| Testes E2E       | Playwright                         | —      |

## Diagrama de arquitetura

```
┌─────────────────────────────────────────────────────────┐
│                      Navegador                          │
│  ┌──────────┐  ┌───────────┐  ┌──────────────────────┐  │
│  │  React   │  │  shadcn/  │  │  Jitsi Meet iframe   │  │
│  │  Pages   │  │  ui       │  │  (videoconferência)  │  │
│  └────┬─────┘  └─────┬─────┘  └──────────┬───────────┘  │
└───────┼──────────────┼───────────────────┼───────────────┘
        │              │                   │
┌───────┴──────────────┴───────────────────┴───────────────┐
│                  Next.js App Router                       │
│                                                           │
│  ┌─────────────┐  ┌───────────────┐  ┌────────────────┐  │
│  │   Proxy     │  │    Server     │  │   API Route    │  │
│  │  (RBAC)     │  │   Actions     │  │  (Auth.js)     │  │
│  └──────┬──────┘  └───────┬───────┘  └───────┬────────┘  │
│         │                 │                   │           │
│  ┌──────┴─────────────────┴───────────────────┴────────┐  │
│  │              Prisma ORM (adapter SQLite)             │  │
│  └──────────────────────┬──────────────────────────────┘  │
│                         │                                 │
│  ┌──────────────────────┴──────────────────────────────┐  │
│  │                  SQLite (dev.db)                     │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

## Modelo de dados (Prisma Schema)

```
┌──────────────┐       ┌─────────────────┐       ┌──────────────┐
│    User      │       │   Appointment   │       │   Patient    │
├──────────────┤       ├─────────────────┤       ├──────────────┤
│ id       PK  │◄──┐   │ id          PK  │   ┌──►│ id       PK  │
│ email    UQ  │   │   │ patientId   FK  │───┘   │ name         │
│ passwordHash │   │   │ professionalId  │───┐   │ cpf      UQ  │
│ name         │   │   │ scheduledAt     │   │   │ birthDate    │
│ role (enum)  │   │   │ status (enum)   │   │   │ phone?       │
│ createdAt    │   │   │ notes?          │   │   │ email?       │
└──────────────┘   │   └─────────────────┘   │   │ userId?  FK  │──► User
                   │                         │   └──────────────┘
                   │   ┌─────────────────┐   │
                   │   │ MedicalRecord   │   │   ┌──────────────┐
                   │   ├─────────────────┤   │   │ Prescription │
                   │   │ id          PK  │   │   ├──────────────┤
                   ├───│ professionalId  │   │   │ id       PK  │
                   │   │ patientId   FK  │──►│   │ patientId FK │──► Patient
                   │   │ type            │   └───│ professionalId│
                   │   │ description     │       │ medication   │
                   │   │ recordedAt      │       │ dosage       │
                   │   └─────────────────┘       │ instructions │
                   │                             └──────────────┘
                   └─────────────────────────────────┘
```

### Enums

- **Role:** `ADMIN` | `PATIENT` | `PROFESSIONAL`
- **AppointmentStatus:** `SCHEDULED` | `CANCELLED` | `COMPLETED`

## Casos de uso

| ID   | Caso de uso             | Ator(es)              | Fluxo principal                                                                                                     |
| ---- | ----------------------- | --------------------- | ------------------------------------------------------------------------------------------------------------------- |
| UC01 | Login por perfil        | Todos                 | Informar e-mail/senha → Auth.js valida → Redireciona ao dashboard por role                                          |
| UC02 | Cadastrar paciente      | Admin                 | Acessar `/pacientes` → "Novo paciente" → Preencher formulário com CPF → Validação Zod → Server Action cria no banco |
| UC03 | Agendar consulta        | Paciente              | Acessar `/agendamentos` → "Agendar consulta" → Selecionar profissional e data → Confirmação                         |
| UC04 | Registrar prontuário    | Profissional          | Acessar `/prontuario` → Selecionar paciente → "Novo registro" → Tipo + descrição → Salvar                           |
| UC05 | Emitir receita          | Profissional          | Acessar `/receitas` → Selecionar paciente → Medicamento, posologia, instruções → Salvar                             |
| UC06 | Teleconsulta            | Paciente/Profissional | Acessar `/telemedicina` → Selecionar consulta agendada → Sala Jitsi Meet é aberta                                   |
| UC07 | Gerenciar profissionais | Admin                 | Acessar `/profissionais` → CRUD completo (criar, editar, excluir)                                                   |
| UC08 | Visualizar relatórios   | Admin                 | Acessar `/relatorios` → Métricas agregadas (total pacientes, consultas, status)                                     |

## Estrutura de pastas

```
vida-plus/
├── app/
│   ├── (dashboard)/          # Layout autenticado
│   │   ├── agendamentos/     # Consultas e agendamentos
│   │   ├── dashboard/        # Painel com métricas
│   │   ├── pacientes/        # CRUD de pacientes
│   │   ├── profissionais/    # CRUD de profissionais
│   │   ├── prontuario/       # Prontuário eletrônico
│   │   ├── receitas/         # Receitas digitais
│   │   ├── relatorios/       # Relatórios administrativos
│   │   ├── telemedicina/     # Videoconsulta Jitsi
│   │   ├── layout.tsx        # Shell + notificações
│   │   ├── loading.tsx       # Skeleton de carregamento
│   │   ├── error.tsx         # Tratamento de erros
│   │   └── not-found.tsx     # Página 404
│   ├── actions/              # Server Actions (CRUD)
│   ├── api/auth/             # NextAuth route handler
│   ├── login/                # Página de login
│   └── layout.tsx            # Root layout + providers
├── components/
│   ├── ui/                   # Componentes shadcn/ui
│   ├── telemedicina/         # Jitsi room + mock video
│   └── *.tsx                 # Formulários, botões, dialogs
├── lib/                      # Auth, Prisma, validadores Zod
├── prisma/                   # Schema + seed
├── e2e/                      # Testes Playwright
├── __tests__/                # Testes unitários Vitest
└── docs/report/              # Este relatório
```
