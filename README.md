# MedFlow — SGHSS VidaPlus

Sistema de Gestão Hospitalar e de Serviços de Saúde (projeto acadêmico Uninter).

## Stack

- Next.js 16 (App Router) + TypeScript
- Prisma + SQLite
- Auth.js (Credentials)
- Tailwind CSS + shadcn/ui
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

| Perfil       | E-mail               | Senha  |
|-------------|----------------------|--------|
| Admin       | admin@vida.plus      | 123456 |
| Profissional| medico@vida.plus     | 123456 |
| Paciente    | paciente@vida.plus   | 123456 |

## Testes

```bash
npm test          # Vitest
npm run test:e2e  # Playwright
```

## Deploy (Vercel)

1. Repositório público no GitHub
2. Importar na Vercel
3. Variáveis: `DATABASE_URL`, `AUTH_SECRET`, `AUTH_URL`
4. Build command: `npm run build`

## Funcionalidades

- Login por perfil com rotas protegidas
- Cadastro de pacientes (admin) com validação de CPF
- Agendamento e cancelamento de consultas
- Visualização de prontuário clínico
- Telemedicina simulada com aviso LGPD
