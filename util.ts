import { Browser} from '@playwright/test';


export const runSimplePageTest = async (browser: Browser): Promise<string> => {
  const page = await browser.newPage();
  try {
    await page.setContent('<button>Submit</button>');
    await page.locator('button').click();
    return await page.evaluate(() => navigator.userAgent);
  } finally {
    await page.close();
  }
};