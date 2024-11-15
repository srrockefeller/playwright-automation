const { test, expect } = require('@playwright/test');

test.describe('Vetting Campaign Tests', () => {
  test('Login Page should load correctly', async ({ page }) => {
    await page.goto('https://staging-cmp.frequencyads.com/login');
    const usernameInput = page.locator('//input[@id="username"]');
    
    // Check if login page is visible
    await expect(usernameInput).toBeVisible();

    // Take screenshot
    await page.screenshot({ path: 'screenshots/loginPage.jpg' });
  });

  test('User should be able to login and logout', async ({ page }) => {
    const login = async (user) => {
      let userName = getUserEmail(user);
      await page.goto('https://staging-cmp.frequencyads.com/login');
      await page.fill('//input[@id="username"]', userName);
      await page.fill('//input[@id="password"]', 'password001');
      await page.click('//span[contains(text(), "Log in")]');
      
      // Check if user is logged in successfully
      const campaignList = page.locator('(//*[@class="ReactVirtualized__Grid__innerScrollContainer"])[2]');
      await expect(campaignList).toBeVisible();
      
      // Take screenshot after login
      await page.screenshot({ path: `screenshots/post_login_${user}.jpg` });
    };

    const logout = async () => {
      await page.click('//li[@class="dropdown"]/a/span[2]');
      await page.click('//a[@href="/logout"]');
      
      const loginButton = page.locator('//a[@href="/login"]');
      await expect(loginButton).toBeVisible();
      
      // Take screenshot after logout
      await page.screenshot({ path: 'screenshots/logout.jpg' });
    };

    const getUserEmail = (user) => {
      switch (user) {
        case 'admin': return 'facu@frequencyads.com';
        case 'adops': return 'facu+adops@frequencyads.com';
        case 'sales': return 'facu+sales@frequencyads.com';
        case 'show': return 'facu+showhost@frequencyads.com';
        case 'network': return 'facu+networkproducer@frequencyads.com';
      }
    };

    await login('sales');
    await logout();
  });

  test('Submit Campaign Vetting Request', async ({ page }) => {
    const campaignName = 'Playwright Campaign Test';
    
    await page.goto('https://staging-cmp.frequencyads.com/login');
    
    // Login
    await page.fill('//input[@id="username"]', 'facu+sales@frequencyads.com');
    await page.fill('//input[@id="password"]', 'password001');
    await page.click('//span[contains(text(), "Log in")]');
    await page.waitForLoadState('load');

    // Navigate to Vetting Page
    await page.click('//*[@href="/vetting/campaign"]');
    await page.click('//button[contains(text(), "Create Vetting Request")]');

    // Fill out the vetting form
    await page.fill('//label[contains(text(), "Campaign Name")]/following-sibling::div/input', campaignName);
    await page.fill('//label[contains(text(), "Campaign URL")]/../div/input', 'https://frequencyads.com/');

    // Submit Vetting Request
    await page.click('//button[contains(text(), "Create Vetting Request")]');
    
    // Check for confirmation
    const confirmationText = page.locator('//span[text()="Campaign Created"]');
    await expect(confirmationText).toBeVisible();

    // Screenshot after submission
    await page.screenshot({ path: 'screenshots/submitVettingPage.jpg' });
  });
});
