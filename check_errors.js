import puppeteer from 'puppeteer';

(async () => {
  const browser = await puppeteer.launch({ headless: 'new' });
  const page = await browser.newPage();
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));
  page.on('requestfailed', request =>
    console.log('REQUEST FAILED:', request.url(), request.failure()?.errorText)
  );

  console.log('Navigating to localhost:5173...');
  try {
    await page.goto('http://localhost:5173', { waitUntil: 'networkidle0', timeout: 10000 });
    const content = await page.content();
    console.log('HTML length:', content.length);
    console.log('Root content:', await page.evaluate(() => document.getElementById('root')?.innerHTML.substring(0, 500)));
  } catch (err) {
    console.error('Navigation error:', err.message);
  }

  await browser.close();
})();
