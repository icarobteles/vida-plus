# 3. Modelagem e Arquitetura

## Stack

- **Front-end:** Next.js 16, React 19, TypeScript, Tailwind, shadcn/ui
- **Back-end leve:** Route Handlers e Server Actions
- **Dados:** Prisma ORM + SQLite
- **Auth:** Auth.js (Credentials)
- **Testes:** Vitest + Playwright

## Diagrama de arquitetura

```
[Navegador] → [Next.js App Router]
                 ├── Middleware (perfis)
                 ├── Server Actions (forms)
                 ├── API Auth
                 └── Prisma → SQLite
```

## Wireframes / Telas

Incluir prints de: Login, Dashboard, Pacientes, Agendamentos, Prontuário, Telemedicina.

## Casos de uso (resumo)

- UC01 Login por perfil
- UC02 Cadastrar paciente (admin)
- UC03 Agendar consulta (paciente)
- UC04 Consultar prontuário
- UC05 Iniciar teleconsulta (mock)
