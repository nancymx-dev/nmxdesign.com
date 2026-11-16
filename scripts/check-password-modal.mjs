import { chromium } from 'playwright';

const base = process.env.PREVIEW_URL || 'http://127.0.0.1:5294';
const browser = await chromium.launch({
  headless: true,
  ...(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {}),
});
try {
  for (const [width, height] of [
    [390, 844],
    [768, 1024],
    [1440, 900],
  ]) {
    for (const path of ['/case-studies', '/case-studies/apex-wrapped', '/ai-lab']) {
      const page = await browser.newPage({ viewport: { width, height } });
      await page.goto(`${base}${path}`);
      const dialog = page.getByRole('dialog');
      await dialog.waitFor();
      const email = await page
        .getByRole('link', { name: 'nmxdesignau@gmail.com' })
        .getAttribute('href');
      const gmail = new URL(
        await page.getByRole('link', { name: 'Open in Gmail' }).getAttribute('href'),
      );
      if (
        email !== 'mailto:nmxdesignau@gmail.com' ||
        gmail.hostname !== 'mail.google.com' ||
        gmail.searchParams.get('to') !== 'nmxdesignau@gmail.com'
      )
        throw new Error('Contact links are incorrect');
      const result = await dialog.evaluate((el) => {
        const r = el.getBoundingClientRect();
        const x = r.left + r.width / 2,
          y = r.top + r.height / 2;
        const top = document.elementFromPoint(x, y);
        return { x: r.x, y: r.y, width: r.width, height: r.height, hit: !!top && el.contains(top) };
      });
      if (
        result.x < 0 ||
        result.y < 0 ||
        result.x + result.width > width ||
        result.y + result.height > height ||
        !result.hit
      )
        throw new Error(
          `${width}x${height} ${path}: modal is clipped or obscured: ${JSON.stringify(result)}`,
        );
      await page.getByLabel('Password', { exact: true }).fill('wrong');
      await page.getByRole('button', { name: /View case study|Explore the AI Lab/ }).click();
      if (!(await page.getByRole('alert').isVisible())) throw new Error('Missing error message');
      await page.getByLabel('Password', { exact: true }).fill('nmxdesignunlock');
      await page.getByRole('button', { name: /View case study|Explore the AI Lab/ }).click();
      if (await dialog.count()) throw new Error('Modal did not close');
      await page.close();
      console.log(`${width}x${height} ${path}: passed`);
    }
  }
} finally {
  await browser.close();
}
