const { test, expect } = require('@playwright/test');
const { login, logout } = require('../utils/helpers');

test.describe('Users Login to platform', () => {
	const users = ['facu+admin@frequencyads.com', 'facu+sales@frequencyads.com', 'facu+adops@frequencyads.com', 'facu+showproducer@frequencyads.com', 'facu+networkproducer@frequencyads.com'];
	for (const user of users){
		test(`"${user}" should be able to login and logout`, async({ page }) => {
			await login(page, user, '*****');	//complete with own users and password		
			//await page.screenshot({ path: `screenshots/loginPage${user}.jpg` });
			//logout
			await logout(page);
		});
	};
	
});