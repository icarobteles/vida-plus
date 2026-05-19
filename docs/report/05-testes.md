# 5. Plano de Testes

## Ferramentas

| Ferramenta     | Tipo             | Uso                                     |
| -------------- | ---------------- | --------------------------------------- |
| **Vitest**     | Unitário         | Validação de schemas Zod, lógica de CPF |
| **Playwright** | E2E (end-to-end) | Fluxos completos no navegador Chromium  |

## Testes unitários (Vitest) — 32 testes

Arquivo: `__tests__/validators.test.ts`

| Suite                 | Casos | Exemplos                                                                                     |
| --------------------- | ----- | -------------------------------------------------------------------------------------------- |
| `isValidCpf`          | 5     | CPF válido, dígitos iguais, dígito verificador errado, menos de 11 dígitos, com pontuação    |
| `patientSchema`       | 8     | Dados válidos, campos opcionais, nome curto, CPF vazio/inválido, data vazia, e-mail inválido |
| `appointmentSchema`   | 4     | Agendamento válido, com observações, sem profissional, sem data                              |
| `medicalRecordSchema` | 3     | Registro válido, tipo vazio, descrição curta                                                 |
| `prescriptionSchema`  | 4     | Receita válida, sem medicamento, sem posologia, sem instruções                               |
| `professionalSchema`  | 5     | Profissional válido, sem senha (edição), nome curto, e-mail inválido, senha curta            |
| `loginSchema`         | 3     | Login válido, e-mail inválido, senha vazia                                                   |

### Execução

```bash
npm test
```

### Resultado

```
 ✓ __tests__/validators.test.ts (32 tests)

 Test Files  1 passed (1)
      Tests  32 passed (32)
   Duration  155ms
```

## Testes E2E (Playwright) — 20 testes

### Configuração

- **Porta:** 3000 (reutiliza o dev server do desenvolvedor)
- **globalSetup:** re-seed do banco antes dos testes (dados previsíveis)
- **globalTeardown:** re-seed após os testes (restaura dados de desenvolvimento)
- **Workers:** 4 paralelos
- **Retry:** 1 tentativa em caso de falha (2 em CI)

### Catálogo de testes

| Arquivo                      | ID    | Descrição                                                                  | Perfil       |
| ---------------------------- | ----- | -------------------------------------------------------------------------- | ------------ |
| `login-admin.spec.ts`        | CT001 | Login do admin redireciona para o dashboard                                | Admin        |
| `login-admin.spec.ts`        | CT002 | Admin vê links de pacientes, profissionais e relatórios                    | Admin        |
| `login-profissional.spec.ts` | CT003 | Login do profissional redireciona para o dashboard                         | Profissional |
| `login-profissional.spec.ts` | CT004 | Profissional vê links de agendamentos, prontuário, receitas e telemedicina | Profissional |
| `login-paciente.spec.ts`     | CT005 | Login do paciente redireciona para o dashboard                             | Paciente     |
| `cadastro-paciente.spec.ts`  | CT006 | Admin cadastra paciente com CPF válido                                     | Admin        |
| `agendamento.spec.ts`        | CT007 | Paciente agenda consulta                                                   | Paciente     |
| `rbac.spec.ts`               | CT008 | Paciente não acessa /pacientes (redirecionado)                             | Paciente     |
| `rbac.spec.ts`               | CT009 | Paciente não acessa /profissionais (redirecionado)                         | Paciente     |
| `rbac.spec.ts`               | CT010 | Profissional não acessa /pacientes (redirecionado)                         | Profissional |
| `rbac.spec.ts`               | CT011 | Usuário não logado é redirecionado para /login                             | Anônimo      |
| `lgpd.spec.ts`               | CT012 | Banner LGPD aparece e desaparece após aceitar                              | Anônimo      |
| `relatorios.spec.ts`         | CT013 | Admin acessa página de relatórios com métricas                             | Admin        |
| `telemedicina.spec.ts`        | CT014 | Paciente acessa telemedicina e vê seletor de consulta                      | Paciente     |
| `prontuario-registro.spec.ts` | CT015 | Profissional adiciona registro clínico ao prontuário                       | Profissional |
| `receita-emissao.spec.ts`     | CT016 | Profissional emite receita digital para paciente                           | Profissional |
| `receita-paciente.spec.ts`    | CT017 | Paciente visualiza suas receitas prescritas                                | Paciente     |
| `profissional-crud.spec.ts`   | CT018 | Admin cadastra novo profissional de saúde                                  | Admin        |
| `paciente-edicao.spec.ts`     | CT019 | Admin edita dados de um paciente existente                                 | Admin        |
| `consulta-conclusao.spec.ts`  | CT020 | Profissional conclui uma consulta agendada                                 | Profissional |

### Execução

```bash
npm run dev        # Terminal 1: iniciar o servidor
npm run test:e2e   # Terminal 2: executar testes
```

### Resultado

```
✓ Banco resetado com seed (pré-testes)

  ✓  login-admin.spec.ts › login do admin redireciona para o dashboard
  ✓  login-admin.spec.ts › admin vê links de pacientes, profissionais e relatórios
  ✓  login-profissional.spec.ts › login do profissional redireciona para o dashboard
  ✓  login-profissional.spec.ts › profissional vê links de agendamentos...
  ✓  login-paciente.spec.ts › login do paciente redireciona para o dashboard
  ✓  cadastro-paciente.spec.ts › admin cadastra paciente com CPF válido
  ✓  agendamento.spec.ts › paciente agenda consulta
  ✓  rbac.spec.ts › paciente não acessa /pacientes (redirecionado)
  ✓  rbac.spec.ts › paciente não acessa /profissionais (redirecionado)
  ✓  rbac.spec.ts › profissional não acessa /pacientes (redirecionado)
  ✓  rbac.spec.ts › usuário não logado é redirecionado para /login
  ✓  lgpd.spec.ts › banner LGPD aparece na primeira visita e desaparece após aceitar
  ✓  relatorios.spec.ts › admin acessa página de relatórios com métricas
  ✓  telemedicina.spec.ts › paciente acessa telemedicina e vê seletor de consulta
  ✓  prontuario-registro.spec.ts › profissional adiciona registro clínico
  ✓  receita-emissao.spec.ts › profissional emite receita digital
  ✓  receita-paciente.spec.ts › paciente visualiza suas receitas prescritas
  ✓  profissional-crud.spec.ts › admin cadastra novo profissional
  ✓  paciente-edicao.spec.ts › admin edita dados de um paciente existente
  ✓  consulta-conclusao.spec.ts › profissional conclui uma consulta agendada

✓ Banco restaurado com seed (pós-testes)

  20 passed
```

## Cobertura por requisito

| Requisito                     | Testes que cobrem        |
| ----------------------------- | ------------------------ |
| RF001 — Cadastro de pacientes | CT006                    |
| RF002 — Agendamentos          | CT007                    |
| RF003 — Prontuário            | CT004, CT015             |
| RF004 — Teleconsulta          | CT014                    |
| RF005 — RBAC                  | CT001–CT005, CT008–CT011 |
| RF006 — Receitas              | CT004, CT016, CT017      |
| RF007 — Profissionais (CRUD)  | CT018                    |
| RF011 — Edição de pacientes   | CT019                    |
| RNF002 — LGPD                 | CT012                    |
| RNF006 — Validação Zod        | 32 testes unitários      |
