# 4. Implementação

## Repositório

**GitHub:** `https://github.com/icarobteles/vida-plus` _(substituir após push)_

## Deploy

**Vercel:** `https://vida-plus-xxx.vercel.app` _(substituir após deploy)_

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

### 4.7 Receitas digitais (`/receitas`) — Profissional

- Selecionar paciente → medicamento, posologia e instruções
- Histórico de receitas emitidas por paciente

### 4.8 Teleconsulta (`/telemedicina`)

- Integração real com **Jitsi Meet** via `@jitsi/react-sdk`
- Sala de vídeo criada automaticamente a partir do ID do agendamento
- Nome da sala legível: `VidaPlusTeleconsulta{hash}`
- Título da sala: `Teleconsulta — Paciente X`
- Fallback com mock de vídeo para ambiente sem Jitsi disponível
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

Cada entrega seguiu **Conventional Commits** em português com commits atômicos.
