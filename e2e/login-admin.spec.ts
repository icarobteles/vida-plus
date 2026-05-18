import { test, expect } from "@playwright/test";

test("login do admin redireciona para o dashboard", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("admin@vida.plus");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText("Administrador")).toBeVisible();
});

test("admin vê links de pacientes, profissionais e relatórios", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("admin@vida.plus");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole("link", { name: "Pacientes" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Profissionais" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Relatórios" })).toBeVisible();
});
