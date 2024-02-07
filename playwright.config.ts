import { defineConfig } from "@playwright/test";
require("dotenv").config();

export default defineConfig({
  testDir: "./tests",
  timeout: 60 * 1000,
  expect: {
    timeout: 15000,
  },
  /*use: {
    actionTimeout: 900 * 1000,
    navigationTimeout: 900 * 1000,
  },*/
  forbidOnly: !!process.env.CI,
  //retries: 10,
  workers: process.env.WORKERS ? +process.env.WORKERS : undefined,
  projects: [
    {
      name: "setup",
      testMatch: /global.setup.ts/,
      //timeout: 180 * 1000,
    },
    {
      name: "chrome",
      dependencies: ["setup"],
      testMatch: "**/*.spec.ts",
      use: {
        headless: true,
        browserName: "chromium",
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
        video: "retain-on-failure",
        navigationTimeout:30*1000,
       /*launchOptions: {
          slowMo: 3000,
        },*/
        /*launchOptions: {
          logger: {
            isEnabled: (name, severity) => true,
            log: (name, severity, message, args) =>
              console.log(name, severity, message, args),
            
          },
        },*/
      },
    },
    /* {
      name: "firefox",
      dependencies: ["setup"],
      use: {
        headless: true,
        browserName: "firefox",
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
      },
    },
    {
      name: "webkit",
      dependencies: ["setup"],
      use: {
        headless: true,
        browserName: "webkit",
        viewport: { width: 1280, height: 720 },
        ignoreHTTPSErrors: true,
      },
    },*/
  ],
  reporter: [["list"], ["junit"]],
});
