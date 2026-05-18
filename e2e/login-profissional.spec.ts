import { test, expect } from "@playwright/test";

test("login do profissional redireciona para o dashboard", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("medico@vida.plus");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByText(/Olá/)).toBeVisible();
});

test("profissional vê links de agendamentos, prontuário, receitas e telemedicina", async ({
  page,
}) => {
  await page.goto("/login");
  await page.getByLabel("E-mail").fill("medico@vida.plus");
  await page.getByLabel("Senha").fill("123456");
  await page.getByRole("button", { name: "Entrar" }).click();
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(
    page.getByRole("link", { name: "Agendamentos" }),
  ).toBeVisible();
  await expect(page.getByRole("link", { name: "Prontuário" })).toBeVisible();
  await expect(page.getByRole("link", { name: "Receitas" })).toBeVisible();
  await expect(
    page.getByRole("link", { name: "Telemedicina" }),
  ).toBeVisible();
});
