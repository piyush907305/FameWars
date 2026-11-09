import { test, expect, type Page } from '@playwright/test';
async function enter(page: Page) {
  await page.goto('/');
  await page.getByRole('checkbox', { name: 'I am 18 or older' }).check();
  await page.getByRole('button', { name: /I understand/ }).click();
  await expect(page.getByRole('heading', { name: /FAME/ })).toBeVisible();
}
async function match(page: Page) {
  await page.getByRole('button', { name: /Enter the arena/ }).click();
  await page.locator('.fighter-card').nth(0).click();
  await page.locator('.fighter-card').nth(1).click();
  await page.getByLabel('Match mode').selectOption('local');
  await page.getByRole('button', { name: /Roll camera/ }).click();
  await expect(page.locator('.hud')).toBeVisible();
}
test('boots, validates disclaimer, picks fighters and completes a best-of-three through real inputs', async ({
  page,
}) => {
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push(e.message));
  await page.clock.install();
  await enter(page);
  await page.screenshot({ path: 'docs/evidence/title.png' });
  await match(page);
  await page.screenshot({ path: 'docs/evidence/fight.png' });
  await page.keyboard.down('Numpad0');
  await page.clock.runFor(46000);
  await expect(page.locator('.finisher-caption')).toBeVisible();
  await page.screenshot({ path: 'docs/evidence/finisher.png' });
  await page.clock.runFor(60000);
  await page.keyboard.up('Numpad0');
  await expect(page.locator('.result-screen')).toBeVisible();
  await expect(page.locator('.result-screen')).toContainText('2 : 0');
  await page.screenshot({ path: 'docs/evidence/result.png' });
  expect(errors).toEqual([]);
});
test('pause, remap, language, reduced motion and debug toggles work', async ({ page }) => {
  await enter(page);
  await page.getByRole('button', { name: 'Settings', exact: true }).click();
  await page.getByRole('checkbox', { name: /Reduced motion/ }).check();
  await page.locator('.bindings>div').first().getByRole('button', { name: /light/ }).click();
  await page.keyboard.press('KeyH');
  await expect(page.locator('.bindings>div').first()).toContainText('H');
  await page.getByRole('button', { name: 'Close settings' }).click();
  await page.getByRole('button', { name: 'हिन्दी', exact: true }).click();
  await expect(page.getByRole('button', { name: /अखाड़े/ })).toBeVisible();
  await page.getByRole('button', { name: 'English', exact: true }).click();
  await match(page);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('button', { name: /Resume fight/ })).toBeVisible();
  const tick = await page.locator('canvas').getAttribute('data-tick');
  await page.waitForTimeout(150);
  expect(await page.locator('canvas').getAttribute('data-tick')).toBe(tick);
  await page.getByRole('button', { name: /Resume fight/ }).click();
  await page.keyboard.press('Backquote');
  await expect(page.locator('.debug-overlay')).toContainText('SIM 60 Hz');
});
test('landscape touch targets and portrait prompt', async ({ browser }) => {
  const ctx = await browser.newContext({
    viewport: { width: 844, height: 390 },
    hasTouch: true,
    isMobile: true,
  });
  const page = await ctx.newPage();
  await enter(page);
  await match(page);
  await expect(page.getByRole('region', { name: 'Touch controls' })).toBeVisible();
  const buttons = await page.locator('.touch-button').all();
  for (const b of buttons) {
    const box = await b.boundingBox();
    expect(box!.width).toBeGreaterThanOrEqual(44);
    expect(box!.height).toBeGreaterThanOrEqual(44);
  }
  await page.screenshot({ path: 'docs/evidence/mobile-landscape.png' });
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(page.getByRole('heading', { name: 'Turn your phone' })).toBeVisible();
  await ctx.close();
});
