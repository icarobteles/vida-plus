# 1. Introdução

## Contexto

A **VidaPlus** é uma instituição que administra hospitais, clínicas, laboratórios e equipes de home care. Diante da necessidade de modernizar a gestão de seus serviços de saúde, foi proposto o desenvolvimento do **MedFlow** — um protótipo funcional de **Sistema de Gestão Hospitalar e de Serviços de Saúde (SGHSS)**.

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

O MedFlow atende três perfis de usuário com permissões distintas:

| Perfil | Responsabilidades |
|--------|-------------------|
| **Administrador** | Cadastro de pacientes e profissionais, relatórios, gestão completa |
| **Paciente** | Agendamento de consultas, visualização de prontuário, teleconsulta |
| **Profissional de saúde** | Registro em prontuários, emissão de receitas, teleconsulta, agenda |

## Escopo e limitações

Por ser um projeto acadêmico com ênfase em front-end, o backend é mínimo (Server Actions + SQLite). Funcionalidades como OAuth, microserviços e integração com sistemas hospitalares reais estão fora do escopo do MVP.
