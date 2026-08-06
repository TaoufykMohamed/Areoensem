const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1600, height: 1000 } });

  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text());
  });
  page.on('pageerror', (err) => errors.push('pageerror: ' + err.message));

  await page.goto('http://127.0.0.1:8123/Accueil%20AeroENSEM.dc.html', { waitUntil: 'load', timeout: 30000 });

  try {
    await page.waitForSelector('text=CLUB AÉROENSEM', { timeout: 15000 });
    console.log('FOUND: footer text "CLUB AÉROENSEM" rendered');
  } catch (e) {
    console.log('NOT FOUND: footer text did not appear within 15s:', e.message);
  }

  await page.waitForTimeout(2000);

  await page.screenshot({ path: 'C:/Users/taouf/AppData/Local/Temp/claude/c--Users-taouf-OneDrive-Desktop-aeroensem-website/1d50dfb9-eb97-4ed4-9c69-ad9f2ea1bb1f/scratchpad/hero.png' });

  const logoNaturalWidth = await page.evaluate(() => {
    const img = document.querySelector('img[data-logo="nav"]');
    return img ? img.naturalWidth : null;
  });
  console.log('Logo naturalWidth (nav):', logoNaturalWidth);

  const videoState = await page.evaluate(() => {
    const v = document.querySelector('video[data-bg]');
    if (!v) return null;
    return { readyState: v.readyState, paused: v.paused, videoWidth: v.videoWidth, videoHeight: v.videoHeight, currentSrc: v.currentSrc };
  });
  console.log('Video state:', JSON.stringify(videoState));

  const rawTemplateVisible = await page.evaluate(() => document.body.innerText.includes('{{') );
  console.log('Raw unparsed template markers visible:', rawTemplateVisible);

  console.log('CONSOLE ERRORS:', errors.length ? JSON.stringify(errors, null, 2) : 'none');

  await browser.close();
})().catch((e) => {
  console.error('SCRIPT FAILED:', e);
  process.exit(1);
});
