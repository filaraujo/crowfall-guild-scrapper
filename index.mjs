
import { default as puppeteer } from 'puppeteer';
import minimist from 'minimist';
import * as credentials from './credentials';

const args = minimist(process.argv.slice(2));
const guilds = args.guilds.split(',');

if (!guilds.length) {
  console.error('no guilds defined');
}

const login = async page => {
  await page.goto('https://crowfall.com/en/login');

  await page.click('input[name="email"]');
  await page.keyboard.type(credentials.USER_EMAIL);

  await page.click('input[name="password"]');
  await page.keyboard.type(credentials.USER_PASSWORD);

  await page.click('button[type="submit"]');
  await page.waitFor(1000);
};

const search = async (page, guild) => {
  await page.goto('https://crowfall.com/en/guild/');
  await page.click('#guild_search');
  await page.keyboard.type(guild);
  await page.waitFor(500);

  await page.click(`#crest_container_${guild} ~ a`);

  await page.evaluate(() => {
    let svg = document.querySelector(`#detail_crest_container`);
    let el = svg.cloneNode(true);
    document.body.innerHTML = '';
    document.body.appendChild(el);
    document.body.style.backgroundColor = '#fff';
  });

  await page.setViewport({ width: 200, height: 200 });
  await page.screenshot({ path: `guilds/${guild}.png` });
};

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await login(page);

  for (let guild of guilds) {
    try {
      await page.setViewport({ width: 1000, height: 1000 });
      await search(page, guild);
    } catch (e) {
      console.log(e.message), guild;
    }
  }

  await browser.close();
})();
