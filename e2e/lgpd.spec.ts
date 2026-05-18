import { test, expect } from "@playwright/test";

test("banner LGPD aparece na primeira visita e desaparece após aceitar", async ({
  page,
}) => {
  await page.goto("/login");
  const banner = page.getByText("Lei 13.709/2018");
  await expect(banner).toBeVisible();
  await page.getByRole("button", { name: "Entendi e aceito" }).click();
  await expect(banner).not.toBeVisible();

  await page.reload();
  await expect(banner).not.toBeVisible();
});
