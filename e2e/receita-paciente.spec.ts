import { expect, test } from "@playwright/test";

test("paciente visualiza suas receitas prescritas", async ({ page }) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("paciente@vida.plus");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard/);

  await page.goto("/receitas");
  await expect(
    page.getByRole("heading", { name: "Receitas Digitais" }),
  ).toBeVisible();
  await expect(page.getByText("Receitas prescritas para você")).toBeVisible();
  await expect(page.getByText("Minhas receitas")).toBeVisible();

  await expect(page.getByText("Amoxicilina 500mg").first()).toBeVisible();
  await expect(page.getByText("Nova receita")).not.toBeVisible();
});
