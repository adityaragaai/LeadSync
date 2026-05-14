import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 860 });

  await page.goto('http://localhost:5173/leads', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'screenshot_leads.png', fullPage: false });

  await page.goto('http://localhost:5173/board', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 1500));
  await page.screenshot({ path: 'screenshot_board.png', fullPage: false });

  await browser.close();
  console.log('Done');
})();
