const puppeteer = require('puppeteer');
const credentials = require('./credentials');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto('https://crowfall.com/en/login/?redirect=%2Fen%2Fguild');

  await page.click('input[name="email"]');
  await page.keyboard.type(credentials.USER_EMAIL);

  //   await page.click(PASSWORD_SELECTOR);

  await page.screenshot({ path: 'ss/example.png' });
  await browser.close();
})();
