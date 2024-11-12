const { chromium } = require('playwright');
const assert = require('assert');

(async () => {
	const browser = await chromium.launch({ headless: false }); // headless: false para ver el navegador
	const page = await browser.newPage();
	
	//Open Staging
	await page.goto('https://staging-cmp.frequencyads.com/login'); //Open URL
	await page.waitForLoadState('load');
	await page.screenshot({ path: 'screenshots/loginPage.jpg' });

	//Login
	const login = async (user) => {
		try {
			if (user === 'admin') user = 'facu@frequencyads.com';
			else if (user === 'adops') user = 'facu+adops@frequencyads.com';
			else if (user === 'sales') user = 'facu+sales@frequencyads.com';
			else if (user === 'show') user = 'facu+showhost@frequencyads.com';
			else if (user === 'network') user = 'facu+networkproducer@frequencyads.com';
				
			await page.fill('//input[@id="username"]', user); //Enter username
			await page.fill('//input[@id="password"]', 'password001'); //Enter password
			
			await page.click('//span[contains(text(), "Log in")]'); // Click on Log in
			await page.waitForLoadState('load');
			await page.waitForSelector("(//*[@class='ReactVirtualized__Grid__innerScrollContainer'])[2]");
			await page.waitForTimeout(3000);
			const isLoggedIn = await page.isVisible("(//*[@class='ReactVirtualized__Grid__innerScrollContainer'])[2]");
			assert.strictEqual(isLoggedIn, true, `The user ${user} didn't log in correctly`);       
			console.log(`Succesfull login for ${user}`);
			await page.screenshot({ path: `screenshots/post_login_${user}.jpg` });
		} catch (error) {
			console.error(`There was a problem login as ${user}:`, error);
		}
	}
	
	//Logout
	const logout = async () => {
		try {
			await page.click("//li[@class='dropdown']/a/span[2]");
			await page.click("//a[@href='/logout']");
			await page.waitForSelector("//a[@href='/login']");
			const isLoggedOut = await page.isVisible("//a[@href='/login']");
			assert.strictEqual(isLoggedOut, true, "Session not logged out");
			console.log("Logout succesfull");
			await page.screenshot({ path: 'screenshots/logout.jpg'});
			await page.click("//a[@href='/login']");
		} catch (error) {
			console.error('Problem login out');
		}
	}


	//TESTS//
	const users = ['admin', 'adops', 'sales', 'show', 'network']; 
    for (const user of users) {
        await login(user);
		await logout();
    }
  
	await browser.close();
})();
