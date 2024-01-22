import { test as setup, expect } from "@playwright/test";

setup("do login", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  await page.goto(`${process.env.BASE_ADDRESS}`);
  await page.click('button:has-text("Sign in")');
  var username = "";
  if (process.env.LOGIN_USERNAME) {
    username = process.env.LOGIN_USERNAME;
  }
  var pswd = "";
  if (process.env.LOGIN_PASSWORD) {
    pswd = process.env.LOGIN_PASSWORD;
  }
  await page.fill('input[type="email"]', username);
  await page.click("text=Next");
  await page.waitForSelector("text=Enter password");
  await page.fill('input[type="password"]', pswd);
  await page.getByText("Sign in", { exact: true }).click();
  await page.waitForSelector("text=Stay Signed in");
  await page.click("text=Yes");
  await page.waitForSelector("text=Playwright");
  await page.context().storageState({ path: "state.json" });
  await page.close();

  // ------------------------------------ READER USER ------------------------------------
  const readerUserContext = await browser.newContext();
  const readerUserPage = await readerUserContext.newPage();
  await readerUserPage.goto(`${process.env.BASE_ADDRESS}`);
  await readerUserPage.click('button:has-text("Sign in")');
  username = "";
  if (process.env.READER_USERNAME) {
    username = process.env.READER_USERNAME;
  }
  pswd = "";
  if (process.env.READER_PASSWORD) {
    pswd = process.env.READER_PASSWORD;
  }
  await readerUserPage.fill('input[type="email"]', username);
  await readerUserPage.click("text=Next");
  await readerUserPage.waitForSelector("text=Enter password");
  await readerUserPage.fill('input[type="password"]', pswd);
  await readerUserPage.getByText("Sign in", { exact: true }).click();
  await readerUserPage.waitForSelector("text=Stay Signed in");
  await readerUserPage.click("text=Yes");
  await readerUserPage.waitForSelector("text=Playwright");
  await readerUserPage.context().storageState({ path: "readerUserState.json" });
  await readerUserPage.close();
});
