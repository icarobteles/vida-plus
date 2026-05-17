# 5. Plano de Testes

| ID | Descrição | Entrada | Resultado esperado | Ferramenta |
|----|-----------|---------|-------------------|------------|
| CT001 | Login paciente | E-mail/senha válidos | Redireciona para dashboard | Playwright |
| CT002 | Cadastro paciente | Dados + CPF válido | Paciente na lista | Playwright |
| CT003 | CPF inválido | CPF vazio | Erro de validação | Vitest |
| CT004 | Agendar consulta | Data futura + médico | Status Agendada | Playwright |

## Execução

```bash
npm test
npm run test:e2e
```

Anexar screenshot dos resultados.
