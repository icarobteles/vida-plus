import { expect, test } from "@playwright/test";

test("admin cadastra novo profissional de saúde", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("admin@vida.plus");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto("/profissionais");
  await expect(
    page.getByRole("heading", { name: "Profissionais" }),
  ).toBeVisible();

  await page.getByText("Novo profissional").click();
  await expect(page.getByText("Cadastrar profissional")).toBeVisible();

  await page.getByLabel("Nome completo").fill("Dr. E2E Teste");
  await page.getByLabel("E-mail").fill("e2e-profissional@vida.plus");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Cadastrar" }).click();

  await expect(page.getByText("Profissional cadastrado")).toBeVisible({
    timeout: 10000,
  });
  await expect(page.getByText("Dr. E2E Teste")).toBeVisible();
});
