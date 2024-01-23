import { test, expect } from "@playwright/test";
import * as dotenv from "dotenv";
import { en } from "../helpers/userLiterals";
dotenv.config();

test.describe("Permission Check", () => {
  const reader_username = process.env.READER_USERNAME?.toString()!;
  const reader_userrole = process.env.READER_USER_NAME?.toString()!;
  const directory_name = process.env.DIRECTORY_NAME?.toString();
  const read_directory_name = process.env.READ_DIRECTORY_NAME?.toString();
  const base_address = process.env.BASE_ADDRESS?.toString();
  const reader_password = process.env.READER_PASSWORD?.toString()!;
  const read_workspace = process.env.READ_WORKSPACE_NAME?.toString();
  const write_workspace = process.env.WRITE_WORKSPACE_NAME?.toString();

  test.beforeEach(async ({ page }) => {
    await page.goto(`${base_address}`);
    await page.click(`button:has-text("${en.SIGN_IN}")`);

    await page.fill(`input[type="email"]`, reader_username);
    await page.click(`text=${en.NEXT}`);
    await page.waitForSelector(`text=${en.ENTER_PASSWORD}`);
    await page.fill('input[type="password"]', reader_password);
    await page.getByText(`${en.SIGN_IN}`, { exact: true }).click();
    await page.waitForSelector(`text=${en.STAY_SIGNED_IN}`);
    await page.click(`text=${en.YES}`);
    await expect(
      page.getByText(`${en.MANAGE_WORKSPACES_DESCRIPTION}`, {
        exact: true,
      })
    ).toBeVisible();
    /* if (reader_username && directory_name) {
      await page.getByRole("img", { name: reader_userrole }).click();
      await page.getByText(`${en.SWITCH_DIRECTORY}`, { exact: true }).click();
      await page
        .getByRole("menuitemradio", {
          name: directory_name,
        })
        .click();
      await expect(
        page.getByText(`${en.MANAGE_WORKSPACES_DESCRIPTION}`, { exact: true })
      ).toBeVisible();
    } */
  });
  test(`Should not be able to create new workspace with reader only permission`, async ({
    page,
  }) => {
    if (reader_username && read_directory_name) {
      await page.getByRole("img", { name: reader_userrole }).click();
      await page.getByText(`${en.SWITCH_DIRECTORY}`, { exact: true }).click();
      await page
        .getByRole("menuitemradio", {
          name: read_directory_name,
        })
        .click();
      await expect(
        page.getByText(`${en.MANAGE_WORKSPACES_DESCRIPTION}`, { exact: true })
      ).toBeVisible();
    }
    await expect(
      page.getByRole("button", { name: `${en.NEW_WORKSPACE}` })
    ).not.toBeVisible();
    /* await expect(
      page.getByText(`${en.NO_WORKSPACE_MESSAGE_3}`, { exact: true })
    ).toBeVisible();*/
  });

  test(`Should not show delete workspace option to reader on workspace`, async ({
    page,
  }) => {
    if (reader_username && directory_name) {
      await page.getByRole("img", { name: reader_userrole }).click();
      await page.getByText(`${en.SWITCH_DIRECTORY}`, { exact: true }).click();
      await page
        .getByRole("menuitemradio", {
          name: directory_name,
        })
        .click();
      await expect(page.locator(`#${read_workspace}`)).not.toBeVisible();
    }
  });

  test(`Should show delete workspace option to reader on subscription with write permission on workspace`, async ({
    page,
  }) => {
    if (reader_username && directory_name) {
      await page.getByRole("img", { name: reader_userrole }).click();
      await page.getByText(`${en.SWITCH_DIRECTORY}`, { exact: true }).click();
      await page
        .getByRole("menuitemradio", {
          name: directory_name,
        })
        .click();
      await expect(page.locator(`#${write_workspace}`)).toBeVisible();
    }
  });

  test(`Should not show access token page to reader on workspace`, async ({
    page,
  }) => {
    if (reader_username && directory_name) {
      await page.getByRole("img", { name: reader_userrole }).click();
      await page.getByText(`${en.SWITCH_DIRECTORY}`, { exact: true }).click();
      await page
        .getByRole("menuitemradio", {
          name: directory_name,
        })
        .click();
      await page.getByText(`${read_workspace}`, { exact: true }).click();
      await page.locator("#account-settings-button").click();
      await expect(
        page.getByRole("tab", { name: `${en.ACCESS_TOKENS}` })
      ).not.toBeVisible();
    }
  });

  test(`Should not show billing page to reader on workspace`, async ({
    page,
  }) => {
    if (reader_username && directory_name) {
      await page.getByRole("img", { name: reader_userrole }).click();
      await page.getByText(`${en.SWITCH_DIRECTORY}`, { exact: true }).click();
      await page
        .getByRole("menuitemradio", {
          name: directory_name,
        })
        .click();
      await page.getByText(`${read_workspace}`, { exact: true }).click();
      await page.locator("#account-settings-button").click();
      await expect(
        page.getByRole("tab", { name: `${en.BILLING}` })
      ).not.toBeVisible();
    }
  });

  test(`Should not show getting started page to reader on workspace`, async ({
    page,
  }) => {
    if (reader_username && directory_name) {
      await page.getByRole("img", { name: reader_userrole }).click();
      await page.getByText(`${en.SWITCH_DIRECTORY}`, { exact: true }).click();
      await page
        .getByRole("menuitemradio", {
          name: directory_name,
        })
        .click();
      await page.getByText(`${read_workspace}`, { exact: true }).click();
      await expect(
        page.getByText(`${en.NO_TEST_RUN_PERMISSIONS}`, { exact: true })
      ).toBeVisible();
    }
  });

  test(`Should show limited access warning on settings page to reader on workspace`, async ({
    page,
  }) => {
    if (reader_username && directory_name) {
      await page.getByRole("img", { name: reader_userrole }).click();
      await page.getByText(`${en.SWITCH_DIRECTORY}`, { exact: true }).click();
      await page
        .getByRole("menuitemradio", {
          name: directory_name,
        })
        .click();
      await page.getByText(`${read_workspace}`, { exact: true }).click();
      await page.locator("#account-settings-button").click();
      await expect(
        page.getByText(en.LIMITED_PERMISSION_DESCRIPTION, { exact: true })
      ).toBeVisible();
    }
  });
});
