import { test, expect } from "@playwright/test";
import * as dotenv from "dotenv";
dotenv.config();

test.use({ storageState: undefined });

test.describe("Web Applicaition Firewall tests", () => {
  test("should load the dashboard page when hitting custom webapp url configured with Application Gateway", async ({
    page,
  }) => {
    await page.goto(`${process.env.BASE_ADDRESS}`);
    await expect(page.getByText("Sign in", { exact: true })).toBeVisible();    
  });

  test.fixme("should get forbidden error when hitting default webapp url not configured with Application Gateway", async ({
    page,
  }) => {
    await page.goto(`${process.env.DEFAULT_BASE_ADDRESS}`);
    await page.waitForLoadState();
    const text = await page.innerText("id=content");
    expect(text).toContain("Error 403 - Forbidden");    
  });
});
