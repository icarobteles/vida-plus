# 1. Introdução

## Contexto

A **VidaPlus** é uma instituição que administra hospitais, clínicas, laboratórios e equipes de home care. Diante da necessidade de modernizar a gestão de seus serviços de saúde, foi proposto o desenvolvimento do **VidaPlus** — um protótipo funcional de **Sistema de Gestão Hospitalar e de Serviços de Saúde (SGHSS)**.

O projeto foi desenvolvido como trabalho acadêmico do curso de Tecnologia em Análise e Desenvolvimento de Sistemas do Centro Universitário Internacional **Uninter**, com ênfase em **Desenvolvimento Front-end**.

## Objetivo

Construir uma aplicação web funcional que demonstre os fluxos essenciais de gestão hospitalar:

- **Cadastro e gerenciamento de pacientes** com validação de CPF
- **Agendamento de consultas** com controle de status
- **Prontuário eletrônico** com histórico clínico
- **Receitas digitais** com prescrições médicas
- **Teleconsulta real** via videoconferência (Jitsi Meet)
- **Gestão administrativa** com relatórios e métricas
- **Controle de acesso por perfil** (RBAC)
- **Conformidade LGPD** com avisos e consentimento

## Usuários do sistema

O VidaPlus atende três perfis de usuário com permissões distintas:

| Perfil                    | Responsabilidades                                                  |
| ------------------------- | ------------------------------------------------------------------ |
| **Administrador**         | Cadastro de pacientes e profissionais, relatórios, gestão completa |
| **Paciente**              | Agendamento de consultas, visualização de prontuário, teleconsulta |
| **Profissional de saúde** | Registro em prontuários, emissão de receitas, teleconsulta, agenda |

## Escopo e limitações

Por ser um projeto acadêmico com **ênfase em Desenvolvimento Front-end**, o backend é mínimo (Server Actions + SQLite) e serve como suporte para demonstrar os fluxos de interface. Algumas funcionalidades mencionadas no roteiro do projeto foram **priorizadas ou diferidas** conforme a orientação de que não é obrigatório implementar tudo, desde que as escolhas sejam justificadas:

| Funcionalidade                 | Decisão      | Justificativa                                                                                        |
| ------------------------------ | ------------ | ---------------------------------------------------------------------------------------------------- |
| Cadastro e atendimento         | ✅ Incluída  | Requisito essencial do fluxo hospitalar                                                              |
| Consultas e agendamentos       | ✅ Incluída  | Requisito essencial                                                                                  |
| Prontuário eletrônico          | ✅ Incluída  | Requisito essencial                                                                                  |
| Teleconsulta (videoconferência)| ✅ Incluída  | Diferencial técnico relevante (Jitsi Meet real)                                                      |
| Receitas digitais              | ✅ Incluída  | Requisito essencial para o fluxo clínico                                                             |
| Gestão de profissionais        | ✅ Incluída  | CRUD completo para demonstrar gestão administrativa                                                  |
| Notificações (48h)             | ✅ Incluída  | Demonstra integração com dados temporais                                                             |
| RBAC e LGPD                    | ✅ Incluída  | Requisitos transversais obrigatórios                                                                 |
| Gestão de leitos               | ❌ Diferida  | Escopo extenso para MVP; requer modelagem hospitalar específica além do front-end                    |
| Relatórios financeiros         | ❌ Diferida  | Requer integração com sistema de faturamento inexistente no MVP                                      |
| Controle de suprimentos        | ❌ Diferida  | Domínio de logística hospitalar fora do foco front-end                                               |
| Criptografia de dados clínicos | ⚠️ Parcial   | Senhas com bcrypt; dados clínicos em texto plano (aceitável para SQLite local em ambiente acadêmico) |
| Registros de auditoria (logs)  | ❌ Diferida  | Planejado como evolução futura; `createdAt` já rastreia criação de registros                         |

O foco do MVP foi entregar **fluxos completos e visualmente polidos** para os três perfis de usuário, com **testes automatizados** e **responsividade mobile**, demonstrando competência técnica na camada de apresentação.
