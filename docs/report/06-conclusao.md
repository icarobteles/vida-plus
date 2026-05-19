# 6. Conclusão

## Resultados alcançados

O **MedFlow** cumpre o objetivo de demonstrar um MVP funcional do Sistema de Gestão Hospitalar e de Serviços de Saúde (SGHSS) para a instituição fictícia VidaPlus. Todos os **11 requisitos funcionais** e **7 requisitos não funcionais** identificados foram implementados com sucesso.

A aplicação oferece fluxos completos para os três perfis de usuário — administrador, paciente e profissional de saúde — incluindo cadastro, agendamento, prontuário eletrônico, receitas digitais e **teleconsulta real via Jitsi Meet**.

A cobertura de testes totaliza **32 testes unitários** (Vitest) e **14 testes E2E** (Playwright), validando schemas de dados, fluxos críticos, controle de acesso e conformidade LGPD.

## Lições aprendidas

- **Server Actions** do Next.js simplificam formulários e mutações de dados, eliminando a necessidade de uma API REST separada para o escopo do MVP
- **Auth.js com JWT** atende o controle de perfis de forma eficaz sem a complexidade de OAuth
- **Prisma com SQLite** oferece produtividade no desenvolvimento e facilidade de setup, ideal para protótipos
- **Jitsi Meet** é uma alternativa viável e gratuita para videoconferência, embora o servidor público (`meet.jit.si`) imponha limitações como autenticação de moderador
- **Testes E2E com Playwright** validam fluxos críticos rapidamente, mas exigem cuidado com seletores e condições de corrida (race conditions)
- **Zod** permite compartilhar validações entre cliente e servidor, garantindo consistência
- O padrão de **seed + teardown** para testes E2E evita poluição de dados entre ambiente de desenvolvimento e testes

## Evoluções futuras

| Evolução | Justificativa |
|----------|---------------|
| Banco PostgreSQL (Neon/Turso) | Persistência confiável para produção |
| OAuth (Google/GitHub) | Login social para conveniência do usuário |
| Auditoria LGPD completa | Registro de consentimento, exportação e exclusão de dados |
| Jitsi self-hosted ou Daily.co | Eliminar limitação de autenticação do servidor público |
| Upload de exames (S3/R2) | Anexar PDFs e imagens aos prontuários |
| Notificações por e-mail | Lembrete de consultas via SMTP |
| NestJS separado | Backend dedicado caso a aplicação escale para microserviços |
| CI/CD com GitHub Actions | Build, lint, testes automatizados em cada PR |

## Referências

- NEXT.JS. **Documentação oficial.** Disponível em: https://nextjs.org/docs. Acesso em: maio 2026.
- PRISMA. **Documentação oficial.** Disponível em: https://www.prisma.io/docs. Acesso em: maio 2026.
- AUTH.JS. **Documentação oficial (v5).** Disponível em: https://authjs.dev. Acesso em: maio 2026.
- JITSI MEET. **Handbook.** Disponível em: https://jitsi.github.io/handbook. Acesso em: maio 2026.
- PLAYWRIGHT. **Documentação oficial.** Disponível em: https://playwright.dev/docs. Acesso em: maio 2026.
- VITEST. **Documentação oficial.** Disponível em: https://vitest.dev. Acesso em: maio 2026.
- SHADCN/UI. **Componentes.** Disponível em: https://ui.shadcn.com. Acesso em: maio 2026.
- BRASIL. **Lei nº 13.709/2018 — Lei Geral de Proteção de Dados Pessoais (LGPD).** Disponível em: https://www.planalto.gov.br/ccivil_03/_ato2015-2018/2018/lei/l13709.htm.
- UNINTER. **Roteiro do Projeto Multidisciplinar — SGHSS.** Centro Universitário Internacional, 2025.
