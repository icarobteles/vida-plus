# 4. Implementação

## Repositório

**GitHub:** <https://github.com/icarobteles/vida-plus>

## Deploy

**Vercel:** <https://vida-plus-seven.vercel.app>

## Credenciais de demonstração

| Perfil        | E-mail             | Senha  |
| ------------- | ------------------ | ------ |
| Administrador | admin@vida.plus    | 123456 |
| Paciente      | paciente@vida.plus | 123456 |
| Profissional  | medico@vida.plus   | 123456 |

## Módulos implementados

### 4.1 Autenticação e RBAC

- **Auth.js v5** com provider `Credentials` e sessão JWT
- Login com e-mail/senha, validação via `bcryptjs`
- Middleware (Proxy) intercepta rotas e redireciona usuários sem permissão
- Sessão estendida com `role` e `patientId` para controle granular

### 4.2 Dashboard (`/dashboard`)

Painel personalizado por perfil:

- **Admin:** total de pacientes, profissionais, consultas agendadas e concluídas
- **Profissional:** consultas do dia, total de prontuários registrados
- **Paciente:** próximas consultas, total de registros no prontuário

### 4.3 Pacientes (`/pacientes`) — Admin

- Listagem em tabela com busca
- Cadastro via dialog com validação de CPF (algoritmo módulo 11 via Zod)
- Edição in-place via dialog
- Exclusão com dialog de confirmação estilizado
- Ações em icon buttons com tooltips

### 4.4 Profissionais (`/profissionais`) — Admin

- CRUD completo via dialog (criar, editar, excluir)
- Hash de senha com `bcryptjs` no Server Action
- Edição permite atualizar nome/e-mail sem alterar senha

### 4.5 Agendamentos (`/agendamentos`)

- **Paciente:** agenda consultas selecionando profissional e data/hora
- **Profissional:** visualiza sua agenda, conclui ou cancela consultas
- **Admin:** visão completa de todos os agendamentos
- Status: `SCHEDULED` → `COMPLETED` ou `CANCELLED`
- Link direto para teleconsulta em consultas agendadas

### 4.6 Prontuário eletrônico (`/prontuario`)

- **Profissional:** seleciona paciente → registra tipo + descrição clínica
- **Paciente:** visualiza seu histórico (somente leitura)
- Página de detalhe por paciente (`/prontuario/[id]`)

### 4.7 Receitas digitais (`/receitas`)

- **Profissional:** selecionar paciente → medicamento, posologia e instruções
- **Paciente:** visualiza receitas emitidas para si (somente leitura)
- Histórico de receitas emitidas por paciente

### 4.8 Teleconsulta (`/telemedicina`)

- Integração real com **Jitsi Meet** via `@jitsi/react-sdk`
- Sala de vídeo criada automaticamente a partir do ID do agendamento
- Nome da sala legível: `VidaPlusTeleconsulta{hash}`
- Título da sala: `Teleconsulta — Paciente X`
- Saída limpa: listener `videoConferenceLeft` encerra o componente imediatamente

### 4.9 Relatórios (`/relatorios`) — Admin

- Métricas agregadas: total de pacientes, profissionais, consultas
- Distribuição por status (agendadas, concluídas, canceladas)
- Cards visuais com contadores

### 4.10 Notificações

- Popover no header com consultas nas próximas 48 horas
- Exibe tempo restante (ex.: "em 23h 15min")
- Badge numérico indicando quantidade de notificações

### 4.11 LGPD

- **Banner de consentimento** na primeira visita (persistido via `localStorage`)
- **Aviso no login:** informação sobre coleta de dados para autenticação
- **Aviso no prontuário:** alerta sobre dados clínicos sensíveis

### 4.12 Acessibilidade (WCAG)

- **Skip-to-content:** link de atalho para o conteúdo principal
- **Aria-labels:** em todos os controles interativos
- **Focus-visible:** estilo de foco visível para navegação por teclado
- **Tooltips:** em todos os icon buttons com descrição da ação
- **Dark mode:** tema claro/escuro via `next-themes`

### 4.13 UX e estados

- **Loading:** skeleton animado durante carregamento de páginas
- **Error:** boundary de erro com mensagem amigável e botão de retry
- **Not-found:** página 404 estilizada com link para o dashboard
- **Toasts:** feedback visual via `sonner` para ações bem-sucedidas ou erros
- **Dialogs de confirmação:** para ações destrutivas (excluir, cancelar)

## Fluxo de desenvolvimento

O projeto foi desenvolvido em **6 entregas incrementais**, cada uma em branch dedicada:

| #   | Branch                        | Escopo                                                 |
| --- | ----------------------------- | ------------------------------------------------------ |
| 1   | `fix/rbac-e-correcoes`        | Correção de RBAC, métricas no dashboard, ThemeProvider |
| 2   | `feat/profissional-completo`  | Agenda, prontuário e receitas para profissional        |
| 3   | `feat/telemedicina-jitsi`     | Teleconsulta real com Jitsi Meet                       |
| 4   | `feat/admin-gestao`           | CRUD profissionais, edição de pacientes, relatórios    |
| 5   | `feat/notificacoes-lgpd-a11y` | Notificações, LGPD, acessibilidade, loading states     |
| 6   | `test/cobertura-completa`     | Testes unitários e E2E expandidos, seed setup/teardown |
| 7   | `feat/melhorias-finais`       | Receitas para pacientes, cobertura E2E expandida, docs |
| 8   | `fix/seguranca-e-responsividade` | Correção IDOR, try/catch, responsividade mobile, aria-labels |

Cada entrega seguiu **Conventional Commits** em português com commits atômicos.

## Screenshots das telas

As capturas a seguir cobrem **todas as telas do sistema** nos três perfis de usuário, em versão **desktop** e **mobile**, demonstrando a responsividade da aplicação.

### Autenticação

| Desktop | Mobile |
|---------|--------|
| ![Login desktop](../screenshots/desktop/00-login.png) | ![Login mobile](../screenshots/mobile/00-login.png) |

*Tela de login com credenciais de demonstração e aviso LGPD.*

### Visão do Paciente

| Desktop | Mobile |
|---------|--------|
| ![Dashboard](../screenshots/desktop/01-paciente-dashboard.png) | ![Dashboard](../screenshots/mobile/01-paciente-dashboard.png) |

*Dashboard do paciente com métricas pessoais.*

| Desktop | Mobile |
|---------|--------|
| ![Agendamentos](../screenshots/desktop/02-paciente-agendamentos.png) | ![Agendamentos](../screenshots/mobile/02-paciente-agendamentos.png) |

*Lista de consultas agendadas do paciente.*

| Desktop | Mobile |
|---------|--------|
| ![Criar agendamento](../screenshots/desktop/03-paciente-criar-agendamento.png) | ![Criar agendamento](../screenshots/mobile/03-paciente-criar-agendamento.png) |

*Formulário de agendamento de nova consulta.*

| Desktop | Mobile |
|---------|--------|
| ![Histórico clínico](../screenshots/desktop/04-paciente-historico-clinico.png) | ![Histórico clínico](../screenshots/mobile/04-paciente-historico-clinico.png) |

*Histórico clínico do paciente com registros e aviso LGPD.*

| Desktop | Mobile |
|---------|--------|
| ![Receitas](../screenshots/desktop/05-paciente-receitas.png) | ![Receitas](../screenshots/mobile/05-paciente-receitas.png) |

*Receitas prescritas para o paciente (somente leitura).*

| Desktop | Mobile |
|---------|--------|
| ![Telemedicina](../screenshots/desktop/06-paciente-telemedicina.png) | ![Telemedicina](../screenshots/mobile/06-paciente-telemedicina.png) |

*Tela de teleconsulta com seleção de consulta agendada.*

| Desktop | Mobile |
|---------|--------|
| ![Telemedicina sala](../screenshots/desktop/07-paciente-telemedicina-aguardando-inicio.png) | ![Telemedicina sala](../screenshots/mobile/07-paciente-telemedicina-aguardando-inicio.png) |

*Sala de videoconsulta Jitsi Meet aguardando início.*

| Desktop | Mobile |
|---------|--------|
| ![Notificações](../screenshots/desktop/08-paciente-notificacoes.png) | ![Notificações](../screenshots/mobile/08-paciente-notificacoes.png) |

*Popover de notificações com consultas nas próximas 48 horas.*

### Visão do Profissional

| Desktop | Mobile |
|---------|--------|
| ![Dashboard](../screenshots/desktop/09-medico-dashboard.png) | ![Dashboard](../screenshots/mobile/09-medico-dashboard.png) |

*Dashboard do profissional com suas consultas e prontuários.*

| Desktop | Mobile |
|---------|--------|
| ![Agendamentos](../screenshots/desktop/10-medico-agendamentos.png) | ![Agendamentos](../screenshots/mobile/10-medico-agendamentos.png) |

*Agenda do profissional com ações de concluir e link para teleconsulta.*

| Desktop | Mobile |
|---------|--------|
| ![Prontuários](../screenshots/desktop/11-medico-prontuarios.png) | ![Prontuários](../screenshots/mobile/11-medico-prontuarios.png) |

*Lista de pacientes para acesso ao prontuário.*

| Desktop | Mobile |
|---------|--------|
| ![Prontuário paciente](../screenshots/desktop/12-medico-prontuario-paciente.png) | ![Prontuário paciente](../screenshots/mobile/12-medico-prontuario-paciente.png) |

*Detalhe do prontuário de um paciente específico.*

| Desktop | Mobile |
|---------|--------|
| ![Novo registro](../screenshots/desktop/13-medico-novo-registro-prontuario-paciente.png) | ![Novo registro](../screenshots/mobile/13-medico-novo-registro-prontuario-paciente.png) |

*Formulário para registrar novo evento no prontuário.*

| Desktop | Mobile |
|---------|--------|
| ![Receitas](../screenshots/desktop/14-medico-receitas.png) | ![Receitas](../screenshots/mobile/14-medico-receitas.png) |

*Lista de receitas emitidas pelo profissional.*

| Desktop | Mobile |
|---------|--------|
| ![Criar receita](../screenshots/desktop/15-medico-criar-receita.png) | ![Criar receita](../screenshots/mobile/15-medico-criar-receita.png) |

*Formulário de emissão de receita digital.*

### Visão do Administrador

| Desktop | Mobile |
|---------|--------|
| ![Dashboard](../screenshots/desktop/16-admin-dashboard.png) | ![Dashboard](../screenshots/mobile/16-admin-dashboard.png) |

*Dashboard do administrador com métricas gerais do sistema.*

| Desktop | Mobile |
|---------|--------|
| ![Pacientes](../screenshots/desktop/17-admin-pacientes.png) | ![Pacientes](../screenshots/mobile/17-admin-pacientes.png) |

*Listagem de pacientes com ações de editar e excluir.*

| Desktop | Mobile |
|---------|--------|
| ![Editar paciente](../screenshots/desktop/18-admin-editar-paciente.png) | ![Editar paciente](../screenshots/mobile/18-admin-editar-paciente.png) |

*Dialog de edição de dados do paciente.*

| Desktop | Mobile |
|---------|--------|
| ![Deletar paciente](../screenshots/desktop/19-admin-deletar-paciente.png) | ![Deletar paciente](../screenshots/mobile/19-admin-deletar-paciente.png) |

*Confirmação de exclusão de paciente.*

| Desktop | Mobile |
|---------|--------|
| ![Criar paciente](../screenshots/desktop/20-admin-criar-paciente.png) | ![Criar paciente](../screenshots/mobile/20-admin-criar-paciente.png) |

*Formulário de cadastro de novo paciente com validação de CPF.*

| Desktop | Mobile |
|---------|--------|
| ![Profissionais](../screenshots/desktop/21-admin-profissionais.png) | ![Profissionais](../screenshots/mobile/21-admin-profissionais.png) |

*Gestão de profissionais de saúde.*

| Desktop | Mobile |
|---------|--------|
| ![Editar profissional](../screenshots/desktop/22-admin-editar-profissional.png) | ![Editar profissional](../screenshots/mobile/22-admin-editar-profissional.png) |

*Dialog de edição de profissional.*

| Desktop | Mobile |
|---------|--------|
| ![Deletar profissional](../screenshots/desktop/23-admin-deletar-profissional.png) | ![Deletar profissional](../screenshots/mobile/23-admin-deletar-profissional.png) |

*Confirmação de exclusão de profissional.*

| Desktop | Mobile |
|---------|--------|
| ![Criar profissional](../screenshots/desktop/24-admin-criar-profissional.png) | ![Criar profissional](../screenshots/mobile/24-admin-criar-profissional.png) |

*Formulário de cadastro de novo profissional.*

| Desktop | Mobile |
|---------|--------|
| ![Agendamentos](../screenshots/desktop/25-admin-agendamentos.png) | ![Agendamentos](../screenshots/mobile/25-admin-agendamentos.png) |

*Visão completa de todos os agendamentos.*

| Desktop | Mobile |
|---------|--------|
| ![Cancelar agendamento](../screenshots/desktop/26-admin-cancelar-agendamento.png) | ![Cancelar agendamento](../screenshots/mobile/26-admin-cancelar-agendamento.png) |

*Confirmação de cancelamento de consulta.*

| Desktop | Mobile |
|---------|--------|
| ![Criar agendamento](../screenshots/desktop/27-admin-criar-agendamento.png) | ![Criar agendamento](../screenshots/mobile/27-admin-criar-agendamento.png) |

*Formulário de agendamento de consulta.*

| Desktop | Mobile |
|---------|--------|
| ![Prontuários](../screenshots/desktop/28-admin-prontuarios.png) | ![Prontuários](../screenshots/mobile/28-admin-prontuarios.png) |

*Prontuários dos pacientes com cards por paciente.*

| Desktop | Mobile |
|---------|--------|
| ![Prontuário paciente](../screenshots/desktop/29-admin-prontuario-paciente.png) | ![Prontuário paciente](../screenshots/mobile/29-admin-prontuario-paciente.png) |

*Detalhe do prontuário de um paciente (visão admin).*

| Desktop | Mobile |
|---------|--------|
| ![Relatórios](../screenshots/desktop/30-admin-relatorios.png) | ![Relatórios](../screenshots/mobile/30-admin-relatorios.png) |

*Painel de relatórios com métricas agregadas e distribuição por status.*
