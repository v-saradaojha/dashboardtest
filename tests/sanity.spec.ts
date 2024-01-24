import { test, expect } from "@playwright/test";
import * as dotenv from "dotenv";
import { en } from "../helpers/userLiterals";
import { URLConstants } from "../helpers/urls";
import { getDateFromIsoString } from "../helpers/utils";

dotenv.config();
var regionObj = {
  name: process.env.PRIMARY_REGION,
  id: process.env.PRIMARY_REGION?.replace(/\s/g, "").toLocaleLowerCase(),
};
test.describe("Sanity", () => {
  test.beforeEach(async ({ page }) => {
    const user_name = process.env.USER_NAME;
    const directory_name = process.env.DIRECTORY_NAME;
    await page.goto(`${process.env.BASE_ADDRESS}`);
    await page.click(`button:has-text("${en.SIGN_IN}")`);
    var username = "";
    if (process.env.LOGIN_USERNAME) {
      username = process.env.LOGIN_USERNAME;
    }
    var pswd = "";
    if (process.env.LOGIN_PASSWORD) {
      pswd = process.env.LOGIN_PASSWORD;
    }
    await page.fill(`input[type="email"]`, username);
    await page.click(`text=${en.NEXT}`);
    await page.waitForSelector(`text=${en.ENTER_PASSWORD}`);
    await page.fill('input[type="password"]', pswd);
    await page.getByText(`${en.SIGN_IN}`, { exact: true }).click();
    await page.waitForSelector(`text=${en.STAY_SIGNED_IN}`);
    await page.click(`text=${en.YES}`);
    // await expect(
    //   page.getByText(`${en.NEW_WORKSPACE}`, { exact: true })
    // ).toBeVisible();
    await expect(
      page.getByText(`${en.MANAGE_WORKSPACES_DESCRIPTION}`, {
        exact: true,
      })
    ).toBeVisible();
    if (user_name && directory_name) {
      await page.getByRole("img", { name: user_name }).click();
      await page.getByText(`${en.SWITCH_DIRECTORY}`).click();
      await page
        .getByRole("menuitemradio", {
          name: directory_name,
        })
        .click();
      await expect(
        page.getByText(`${en.MANAGE_WORKSPACES_DESCRIPTION}`)
      ).toBeVisible();
    }
  });  
  test(`Should be able to access global menu after login`, async ({ page }) => {
    await page.locator("#global-menu-toggle").click();
    const page3Promise = page.waitForEvent("popup");
    await page
      .getByRole("link", { name: `${en.RAISE_ISSUE_ON_GITHUB}` })
      .click();
    const page3 = await page3Promise;
    expect(page3.url()).toBe(`${URLConstants.Feedback}`);
  });

  test(`Should be able to switch subscription on manage workspace page`, async ({
    page,
  }) => {
    const subscriptionName = process.env.SUBSCRIPTION_NAME;
    const workspaceName = process.env.WORKSPACE_NAME;
    if (subscriptionName && workspaceName) {
      await page.getByRole("combobox").click();
      await page
        .getByRole("option", { name: subscriptionName })
        .getByText(subscriptionName)
        .click();
      await page.getByText(workspaceName).click();
    }
  });

  test(`Should be able to switch directory`, async ({ page }) => {
    const user_name = process.env.USER_NAME;
    const switch_directory_name = process.env.SWITCH_DIRECTORY_NAME;
    if (user_name && switch_directory_name) {
      await page.getByRole("img", { name: user_name }).click();
      await page.getByText(`${en.SWITCH_DIRECTORY}`).click();
      await page
        .getByRole("menuitemradio", {
          name: switch_directory_name,
        })
        .click();
      await expect(
        page.getByText(`${en.MANAGE_WORKSPACES_DESCRIPTION}`)
      ).toBeVisible();
    }
  });

  test(`Should be able to create new workspace`, async ({ page }) => {
    const subscriptionName = process.env.SUBSCRIPTION_NAME;
     let workspaceName =
      process.env.WORKSPACE_NAME_PREFIX !== undefined
        ? process.env.WORKSPACE_NAME_PREFIX
        : "dummy";
    var browser = page.context().browser()?.browserType().name();
    var environment = process.env.ENVIRONMENT || "";
    let rndInt = Math.floor(Math.random() * 10000) + 1;   
    workspaceName=workspaceName + browser + environment + rndInt;   
    globalThis.myWorkspaceName= workspaceName;
    console.log("WORKSPACE NAME : " + workspaceName);
    if (subscriptionName) {
      await page.getByRole("combobox").click();
      await page
        .getByRole("option", { name: subscriptionName })
        .getByText(subscriptionName)
        .click();
      await page.getByRole("button", { name: `${en.NEW_WORKSPACE}` }).click();
      await expect(page.getByText(`${en.REGION_INFO}`)).toBeVisible();
      await page.getByPlaceholder(`${en.ENTER_WORKSPACE_NAME}`).click();
      await page
        .getByPlaceholder(`${en.ENTER_WORKSPACE_NAME}`)
        .fill(workspaceName);
      await page
        .getByRole("button", { name: `${en.CREATE_WORKSPACE}` })
        .click();
      await expect(
        page.getByText(`${en.CREATING_WORKSPACE_STEP}`)
      ).toBeVisible();
      await expect(
        page.getByText(`${en.CREATING_WORKSPACE_STEP}`)
      ).not.toBeVisible();
      await expect(page.getByText(`${en.REGION_INFO}`)).not.toBeVisible();
    }
  });
  test(`Should be able to delete workspace`, async ({ page }) => {
    const subscriptionName = process.env.SUBSCRIPTION_NAME;
    const workspaceName = globalThis.myWorkspaceName;
    console.log("WORKSPACE NAME : " + workspaceName);
    if (subscriptionName) {
      await page.getByRole("combobox").click();
      await page
        .getByRole("option", { name: subscriptionName })
        .getByText(subscriptionName)
        .click();
      await page.locator(`#${workspaceName}`).click();
      await page
        .getByRole("menuitem", { name: `${en.DELETE_WORKSPACE}` })
        .getByText(`${en.DELETE_WORKSPACE}`)
        .click();
      await page
        .getByRole("button", { name: `${en.DELETE}`, exact: true })
        .click();
      await page.locator("#finalDeleteWsButton").click();
      await expect(
        page.getByText(`${en.WORKSPACE_DELETING_MESSAGE}`)
      ).toBeVisible();
    }
  });

  test(`Should be able to display access tokens page`, async ({ page }) => {
    const subscriptionName = process.env.SUBSCRIPTION_NAME;
    const workspaceName =  process.env.WORKSPACE_NAME;
    console.log("WORKSPACE NAME : " + workspaceName);
    //const workspaceName = process.env.WORKSPACE_NAME;
    if (subscriptionName && workspaceName) {
      await page.getByRole("combobox").click();
      await page
        .getByRole("option", { name: subscriptionName })
        .getByText(subscriptionName)
        .click();
      await page.getByText(workspaceName).click();
      await page.locator("#account-settings-button").click();
      await expect(
        page.getByText(`${en.ACCESS_TOKENS_PAGE_DESCRIPTION}`)
      ).toBeVisible();
    }
  });

  test(`Should be able to create new access token`, async ({ page }) => {
    const subscriptionName = process.env.SUBSCRIPTION_NAME;
    const workspaceName =  process.env.WORKSPACE_NAME;
    console.log("WORKSPACE NAME : " + workspaceName);
    //const workspaceName = process.env.WORKSPACE_NAME;
    if (subscriptionName && workspaceName) {
      await page.getByRole("combobox").click();
      await page
        .getByRole("option", { name: subscriptionName })
        .getByText(subscriptionName)
        .click();
      await page.getByText(workspaceName).click();
      await page.locator("#account-settings-button").click();
      await expect(
        page.getByText(`${en.ACCESS_TOKENS_PAGE_DESCRIPTION}`)
      ).toBeVisible();
      await page
        .getByRole("button", { name: `${en.GENERATE_NEW_TOKEN}` })
        .click();
      await page
        .getByPlaceholder(`${en.ENTER_TOKEN_NAME_PLACEHOLDER}`)
        .fill("test");
      await page.getByText(`${en.SELECT_EXPIRATION_PERIOD}`).click();
      await page.getByRole("option", { name: "7 days" }).click();
      await page.getByRole("button", { name: `${en.GENERATE_TOKEN}` }).click();
      await expect(
        page.getByText(`${en.VALUE_WILL_NOT_BE_SHOWN_AGAIN_1}`)
      ).toBeVisible();
    }
  });

  test(`Should be able to delete access token`, async ({ page }) => {
    let validity = new Date();
    validity.setDate(validity.getDate() + 7);
    const expiryAt = validity.toISOString();
    const expiryDay = getDateFromIsoString(expiryAt);
    const subscriptionName = process.env.SUBSCRIPTION_NAME;
    const workspaceName =  process.env.WORKSPACE_NAME;
    console.log("WORKSPACE NAME : " + workspaceName);
    if (subscriptionName && workspaceName) {
      await page.getByRole("combobox").click();
      await page
        .getByRole("option", { name: subscriptionName })
        .getByText(subscriptionName)
        .click();
      await page.getByText(workspaceName).click();
      await page.locator("#account-settings-button").click();
      await expect(
        page.getByText(`${en.ACCESS_TOKENS_PAGE_DESCRIPTION}`)
      ).toBeVisible();
      await page
        .getByRole("row", { name: `test ACTIVE ${expiryDay} Delete` })
        .getByRole("button", { name: "Delete" })
        .click();
      await page
        .getByRole("group")
        .getByRole("button", { name: `${en.DELETE}` })
        .click();
      await page
        .locator("div")
        .filter({ hasText: /^CancelDelete$/ })
        .getByRole("button", { name: `${en.DELETE}` })
        .click();
      await page.getByRole("button", { name: `${en.OK}`, exact: true }).click();
    }
  });

  test(`Should be able to disable regional affinity`, async ({ page }) => {
    const subscriptionName = process.env.SUBSCRIPTION_NAME;
    const workspaceName =  process.env.WORKSPACE_NAME;
    console.log("WORKSPACE NAME : " + workspaceName);
    if (subscriptionName && workspaceName) {
      await page.getByRole("combobox").click();
      await page
        .getByRole("option", { name: subscriptionName })
        .getByText(subscriptionName)
        .click();
      await page.getByText(workspaceName).click();
      await page.locator("#account-settings-button").click();
      await expect(
        page.getByText(`${en.ACCESS_TOKENS_PAGE_DESCRIPTION}`)
      ).toBeVisible();
      await page.getByRole("tab", { name: `${en.GENERAL}` }).click();
      await expect(
        page.getByLabel(
          "Tests always connect to browsers in the workspace region"
        )
      ).not.toBeChecked();
      await page
        .getByLabel("Tests always connect to browsers in the workspace region")
        .check();
      await page.getByRole("button", { name: "Change" }).click();
      await expect(
        page.getByLabel(
          "Tests always connect to browsers in the workspace region"
        )
      ).toBeChecked();
    }
  });

  test(`Should be able to enable regional affinity`, async ({ page }) => {
    const subscriptionName = process.env.SUBSCRIPTION_NAME;
    const workspaceName =  process.env.WORKSPACE_NAME;
    console.log("WORKSPACE NAME : " + workspaceName);
    if (subscriptionName && workspaceName) {
      await page.getByRole("combobox").click();
      await page
        .getByRole("option", { name: subscriptionName })
        .getByText(subscriptionName)
        .click();
      await page.getByText(workspaceName).click();
      await page.locator("#account-settings-button").click();
      await expect(
        page.getByText(`${en.ACCESS_TOKENS_PAGE_DESCRIPTION}`)
      ).toBeVisible();
      await page.getByRole("tab", { name: `${en.GENERAL}` }).click();
      await expect(
        page.getByLabel(
          "Tests connect to browsers in the Azure region closest to you to minimize latency. Test results are collected in the execution region, then transferred and stored in the workspace region"
        )
      ).not.toBeChecked();
      await page
        .getByLabel(
          "Tests connect to browsers in the Azure region closest to you to minimize latency. Test results are collected in the execution region, then transferred and stored in the workspace region"
        )
        .check();
      await page.getByRole("button", { name: "Change" }).click();
      await expect(
        page.getByLabel(
          "Tests connect to browsers in the Azure region closest to you to minimize latency. Test results are collected in the execution region, then transferred and stored in the workspace region"
        )
      ).toBeChecked();
    }
  });

  test(`Should be able to access workspace IAM page at azure portal`, async ({
    page,
  }) => {
    const subscriptionName = process.env.SUBSCRIPTION_NAME;
    const workspaceName =  process.env.WORKSPACE_NAME;
    console.log("WORKSPACE NAME : " + workspaceName);
    if (subscriptionName && workspaceName) {
      await page.getByRole("combobox").click();
      await page
        .getByRole("option", { name: subscriptionName })
        .getByText(subscriptionName)
        .click();
      await page.getByText(workspaceName).click();
      await page.locator("#account-settings-button").click();
      await expect(
        page.getByText(`${en.ACCESS_TOKENS_PAGE_DESCRIPTION}`)
      ).toBeVisible();
      await page.getByRole("tab", { name: `${en.USERS}` }).click();
      const page2Promise = page.waitForEvent("popup");
      await page
        .getByRole("link", {
          name: `${en.USERS_SUBHEADING_2}`,
        })
        .click();
      const page2 = await page2Promise;
      await expect(
        page2.getByText(`${en.MY_ACCESS}`, { exact: true })
      ).toBeVisible();
    }
  });  
  test(`Should be able to logout successfully`, async ({ page }) => {
    const user_name = process.env.USER_NAME;     
    if (user_name) {
      await page.getByRole("img", { name: user_name }).click();
      await page.getByRole("menuitem", { name: `${en.SIGN_OUT}` }).click();
      await expect(
        page.getByText(`${en.SCALABLE_E2E_TESTING}`, {
          exact: true,
        })
      ).toBeVisible();
    }
  });
});
