import { test, expect } from "@playwright/test";
import * as dotenv from "dotenv";
dotenv.config();

test.use({ storageState: undefined });

test.describe("Failure on login with wrong credentials", () => {
  test("Login Failure", async ({ page }) => {
    await page.goto(`${process.env.BASE_ADDRESS}`);
    await page.getByText("Sign in", { exact: true }).click();
    var username = "wrong@username.com";
    await page.fill('input[type="email"]', username);
    await page.click("text=Next");
    await expect(
      page.getByText("We couldn't find an account with that username.")
    ).toBeVisible();
    await page.close();
  });
});
