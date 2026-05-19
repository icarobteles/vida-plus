import { expect, test } from "@playwright/test";

test("profissional adiciona registro clínico ao prontuário", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("medico@vida.plus");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });

  await page.goto("/prontuario");
  await page.waitForLoadState("networkidle");
  await expect(
    page.getByRole("heading", { name: "Prontuários" }),
  ).toBeVisible();

  const link = page.getByRole("link", { name: "Abrir prontuário" }).first();
  await expect(link).toBeVisible();
  await link.click();

  await expect(page.getByText("Proteção de dados (LGPD)")).toBeVisible({
    timeout: 15000,
  });

  await page.getByText("Novo registro").click();
  await expect(
    page.getByRole("heading", { name: "Adicionar registro clínico" }),
  ).toBeVisible({ timeout: 5000 });

  await page.getByLabel("Tipo").fill("Retorno");
  await page
    .getByLabel("Descrição")
    .fill("Paciente apresenta melhora significativa. Manter medicação.");
  await page.getByRole("button", { name: "Salvar registro" }).click();

  await expect(page.getByText("Registro clínico adicionado")).toBeVisible({
    timeout: 10000,
  });
  await expect(page.getByText("Retorno")).toBeVisible();
});
