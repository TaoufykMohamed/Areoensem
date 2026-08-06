const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ args: ['--no-sandbox'] });
  const page = await browser.newPage({ viewport: { width: 1600, height: 3600 } });
  await page.goto('http://127.0.0.1:8123/Accueil%20AeroENSEM.dc.html', { waitUntil: 'load', timeout: 30000 });
  await page.waitForSelector('text=CLUB AÉROENSEM', { timeout: 15000 });
  await page.waitForTimeout(1500);

  const navLogoBox = await page.evaluate(() => {
    const img = document.querySelector('img[data-logo="nav"]');
    if (!img) return null;
    const r = img.getBoundingClientRect();
    const cs = getComputedStyle(img);
    return { rect: { x: r.x, y: r.y, w: r.width, h: r.height }, display: cs.display, visibility: cs.visibility, opacity: cs.opacity, complete: img.complete, naturalWidth: img.naturalWidth, src: img.currentSrc };
  });
  console.log('Nav logo box:', JSON.stringify(navLogoBox));

  await page.screenshot({ path: 'C:/Users/taouf/AppData/Local/Temp/claude/c--Users-taouf-OneDrive-Desktop-aeroensem-website/1d50dfb9-eb97-4ed4-9c69-ad9f2ea1bb1f/scratchpad/nav_region.png', clip: { x: 0, y: 90, width: 500, height: 150 } });

  // full-page screenshot to check all sections
  await page.screenshot({ path: 'C:/Users/taouf/AppData/Local/Temp/claude/c--Users-taouf-OneDrive-Desktop-aeroensem-website/1d50dfb9-eb97-4ed4-9c69-ad9f2ea1bb1f/scratchpad/fullpage.png', fullPage: true });

  await browser.close();
})().catch((e) => { console.error('FAILED:', e); process.exit(1); });
