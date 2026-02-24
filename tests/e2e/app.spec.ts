import { test, expect } from "@playwright/test";

test("login gate and explore essentials", async ({ page }) => {
  await page.goto("/explore");
  await expect(page).toHaveURL(/login/);
  await page.getByLabel("Wachtwoord").fill("wereld");
  await page.getByRole("button", { name: "Inloggen" }).click();
  await page.goto("/explore");
  await expect(page.getByTestId("globe-wrap")).toBeVisible();
  await page.getByLabel("Zoek land").fill("net");
  await page.getByRole("button", { name: "Netherlands" }).click();
  await expect(page.getByText("Laden")).toBeVisible();
  await expect(page.getByText("Rijksmuseum")).toBeVisible();
  await page.getByRole("button", { name: "Remove pins" }).click();
  await page.getByRole("button", { name: "Reset" }).click();
});
