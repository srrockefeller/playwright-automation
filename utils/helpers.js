const login = async (page, username, password) => {
  await page.goto('/login'); // Using baseURL set in playwright.config.js
  await page.fill('#username', username);
  await page.fill('#password', password);
  await page.click('//span[contains(text(), "Log in")]');

  // Wait for successful login (you can adjust based on your app)
  await page.waitForSelector('(//*[@class="ReactVirtualized__Grid__innerScrollContainer"])[2]'); // Assuming there's a dashboard after login
  //await page.screenshot({ path: 'screenshots/loginPage.jpg' });
};

module.exports = { login };
