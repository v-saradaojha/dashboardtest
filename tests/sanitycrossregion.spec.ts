import { test, expect } from "@playwright/test";
import * as dotenv from "dotenv";
import { en } from "../helpers/userLiterals";
import { getDateFromIsoString } from "../helpers/utils";
dotenv.config();

let environment = process.env.ENVIRONMENT || "";
let subscriptionName = process.env.SUBSCRIPTION_NAME;
if (process.env.CROSS_REGION == "true") {
  let regions = process.env.SUPPORTED_REGIONS?.split(",")
    ?.filter((region) => region != process.env.PRIMARY_REGION)
    .map((region) => {
      return {
        name: region,
        id: region.replace(/\s/g, "").toLocaleLowerCase(),
      };
    });
  let workspaceName =
    process.env.WORKSPACE_NAME_PREFIX !== undefined
      ? process.env.WORKSPACE_NAME_PREFIX
      : "dummy";
  test.describe("Sanity Cross Region", () => {
    test.beforeEach(async ({ page }) => {
      const user_name = process.env.USER_NAME;
      const directory_name = process.env.DIRECTORY_NAME;
      await page.goto(`${process.env.BASE_ADDRESS}`);
      await page.click(`button:has-text("${en.SIGN_IN}")`);
      let username = "";
      if (process.env.LOGIN_USERNAME) {
        username = process.env.LOGIN_USERNAME;
      }
      let pswd = "";
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
    regions?.forEach(async (region) => {
      test(`Should be able to create new workspace in region ${region.id}`, async ({
        page,
      }) => {
        let browser = page.context().browser()?.browserType().name();
        let rndInt = Math.floor(Math.random() * 100) + 1;

        workspaceName =
          workspaceName + browser + environment + region.id + rndInt;

        if (subscriptionName) {
          await page.getByRole("combobox").click();
          await expect(page.getByRole("option")).toContainText([subscriptionName]);
          await page
            .getByRole("option", { name: subscriptionName })
            .getByText(subscriptionName)
            .click();
          await page
            .getByRole("button", { name: `${en.NEW_WORKSPACE}` })
            .click();
          await page.getByText('Region*').click();
          await page
            .getByRole("option", { name: region.name, exact: true })
            .click();
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

      test(`Should be able to display access tokens page for ${region.id}`, async ({
        page,
      }) => {
        if (subscriptionName && workspaceName) {
          await page.getByRole("combobox").click();
          await page
            .getByRole("option", { name: subscriptionName })
            .getByText(subscriptionName)
            .click();
          await page.getByText(workspaceName, { exact: true }).click();
          await page.locator("#account-settings-button").click();
          await expect(
            page.getByText(`${en.ACCESS_TOKENS_PAGE_DESCRIPTION}`)
          ).toBeVisible();
        }
      });

      test(`Should be able to create new access token for  ${region.id}`, async ({
        page,
      }) => {
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
          await page
            .getByRole("button", { name: `${en.GENERATE_TOKEN}` })
            .click();
          await expect(
            page.getByText(`${en.VALUE_WILL_NOT_BE_SHOWN_AGAIN_1}`)
          ).toBeVisible();
        }
      });

      test(`Should be able to delete access token for ${region.id}`, async ({
        page,
      }) => {
        let validity = new Date();
        validity.setDate(validity.getDate() + 7);
        const expiryAt = validity.toISOString();
        const expiryDay = getDateFromIsoString(expiryAt);
        const subscriptionName = process.env.SUBSCRIPTION_NAME;
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
          await page
            .getByRole("button", { name: `${en.OK}`, exact: true })
            .click();
        }
      });

      test(`Should be able to delete workspace for ${region.id}`, async ({
        page,
      }) => {
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
          workspaceName = "";
        }
      });
    });
  });
}
