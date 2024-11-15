const assert = require('assert');
const { expect } = require('@playwright/test');

const login = async (page, username, password) => {
  try{
		await page.goto('/login'); // Using baseURL set in playwright.config.js
		await page.fill('#username', username);
		await page.fill('#password', password);
		await page.click('//span[contains(text(), "Log in")]');
		// Wait for successful login
		await expect(page.locator('//li[@class="dropdown"]/a/span[2]')).toBeVisible();
		//await page.waitForSelector('(//*[@class="ReactVirtualized__Grid__innerScrollContainer"])[2]');
		await page.screenshot({ path: `screenshots/loginPage${username}.jpg` });
  } catch (error) {
		console.error('Problem login in:', error);
  }
  
};

const logout = async (page) => {
	try {
			await page.click('//li[@class="dropdown"]/a/span[2]');
			await page.click('//a[@href="/logout"]');
			await expect(page.locator('//h3[@class="heading"]')).toBeVisible();
			//await page.waitForSelector('//h3[@class="heading"]');
			const isLoggedOut = await page.isVisible('//a[@href="/login"]');
			assert.strictEqual(isLoggedOut, true, "Session not logged out");
		} catch (error) {
			console.error('Problem login out:', error);
	}
};

module.exports = { login, logout };
