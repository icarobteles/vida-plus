import { test, expect } from "@playwright/test";

test("paciente não acessa /pacientes (redirecionado)", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("paciente@vida.plus");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await page.goto("/pacientes");
  await expect(page).toHaveURL(/\/dashboard/);
});

test("paciente não acessa /profissionais (redirecionado)", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("paciente@vida.plus");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await page.goto("/profissionais");
  await expect(page).toHaveURL(/\/dashboard/);
});

test("profissional não acessa /pacientes (redirecionado)", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("medico@vida.plus");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await page.goto("/pacientes");
  await expect(page).toHaveURL(/\/dashboard/);
});

test("usuário não logado é redirecionado para /login", async ({ page }) => {
  await page.goto("/dashboard");
  await expect(page).toHaveURL(/\/login/);
});
