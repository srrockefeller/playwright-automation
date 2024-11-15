const { test, expect } = require('@playwright/test');
const { login } = require('../utils/helpers');

test.describe('Users Login to platform', () => {
	test('Sales should be able to login', async ({ page }) => {
	await login(page, 'facu+sales@frequencyads.com', 'password001');
	// Assert the user is logged in
	await expect(page.locator('//li[@class="dropdown"]/a/span[2]')).toBeVisible();
	await page.screenshot({ path: 'screenshots/loginPageSales.jpg' });
	});
	
	test('Adops should be able to login', async ({ page }) => {
	await login(page, 'facu+adops@frequencyads.com', 'password001');
	// Assert the user is logged in
	await expect(page.locator('//li[@class="dropdown"]/a/span[2]')).toBeVisible();
	await page.screenshot({ path: 'screenshots/loginPageAdops.jpg' });
	});
	
	test('Show Producer should be able to login', async ({ page }) => {
	await login(page, 'facu+showproducer@frequencyads.com', 'password001');
	// Assert the user is logged in
	await expect(page.locator('//li[@class="dropdown"]/a/span[2]')).toBeVisible();
	await page.screenshot({ path: 'screenshots/loginPageShow.jpg' });
	});
	
	test('Network Producer should be able to login', async ({ page }) => {
	await login(page, 'facu+networkproducer@frequencyads.com', 'password001');
	// Assert the user is logged in
	await expect(page.locator('//li[@class="dropdown"]/a/span[2]')).toBeVisible();
	await page.screenshot({ path: 'screenshots/loginPageNetwork.jpg' });
	});
	
	test('Admin should be able to login', async ({ page }) => {
	await login(page, 'facu+admin@frequencyads.com', 'password001');
	// Assert the user is logged in
	await expect(page.locator('//li[@class="dropdown"]/a/span[2]')).toBeVisible();
	await page.screenshot({ path: 'screenshots/loginPageAdmin.jpg' });
	});
	
});