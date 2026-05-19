# VidaPlus — SGHSS

Sistema de Gestão Hospitalar e de Serviços de Saúde (projeto acadêmico Uninter).

## Stack

- Next.js 16 (App Router) + TypeScript
- Prisma + SQLite
- Auth.js (Credentials)
- Tailwind CSS + shadcn/ui
- Jitsi Meet (teleconsulta)
- Vitest + Playwright

## Executar localmente

```bash
cp .env.example .env
npm install
npx prisma db push
npm run db:seed
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

## Credenciais demo

| Perfil       | E-mail             | Senha  |
| ------------ | ------------------ | ------ |
| Admin        | admin@vida.plus    | 123456 |
| Profissional | medico@vida.plus   | 123456 |
| Paciente     | paciente@vida.plus | 123456 |

## Testes

```bash
npm test          # Vitest (32 testes unitários)
npm run test:e2e  # Playwright (14 testes E2E)
```

## Deploy (Vercel)

1. Repositório público no GitHub
2. Importar na Vercel
3. Variáveis: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`
4. Build command: `npm run build`

## Funcionalidades

- Login por perfil com rotas protegidas (RBAC)
- Cadastro e gestão de pacientes com validação de CPF
- Cadastro e gestão de profissionais de saúde
- Agendamento, cancelamento e conclusão de consultas
- Prontuário eletrônico com histórico clínico
- Receitas digitais
- Teleconsulta real via Jitsi Meet
- Relatórios administrativos com métricas
- Notificações de consultas próximas
- Banner de consentimento LGPD
- Acessibilidade (skip-to-content, aria-labels, focus-visible)
- Tema claro/escuro
