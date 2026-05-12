import { chromium } from 'playwright';

const testPages = [
  { path: '/dashboard', name: 'Dashboard' },
  { path: '/', name: 'Homepage' },
  { path: '/about', name: 'About' },
  { path: '/menu', name: 'Menu' },
];

const browser = await chromium.launch();
const context = await browser.newContext();

await context.addInitScript(() => {
  localStorage.setItem('jukes_user', JSON.stringify({
    name: 'Test', email: 'test@test.com', role: 'admin'
  }));
});

const page = await context.newPage();

for (const tp of testPages) {
  await page.goto(`http://localhost:3000${tp.path}`, { waitUntil: 'domcontentloaded', timeout: 10000 });
  
  const mainCount = await page.locator('main').count();
  const nestedMainCount = await page.locator('main main').count();
  
  const status = mainCount === 1 && nestedMainCount === 0 ? '✓' : '✗';
  console.log(`${status} ${tp.name.padEnd(15)} - ${mainCount} main, ${nestedMainCount} nested`);
}

await browser.close();
