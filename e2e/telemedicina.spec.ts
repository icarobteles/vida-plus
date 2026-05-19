import { test, expect } from "@playwright/test";

test("paciente acessa telemedicina e vê seletor de consulta", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("paciente@vida.plus");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await page.goto("/telemedicina");
  await expect(
    page.getByRole("heading", { name: "Telemedicina" }),
  ).toBeVisible();
  await expect(page.getByText("Iniciar teleconsulta")).toBeVisible();
});
