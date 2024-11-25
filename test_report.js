const { chromium } = require('playwright');
const assert = require('assert');
const fs = require('fs');

//Initialize report
let reportContent = `
<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; }
        h1 { color: #5D5C61; }
        h2 { color: #379683; }
        .pass { color: green; }
        .fail { color: red; }
        .screenshot { margin: 10px 0; }
    </style>
</head>
<body>
    <h1>Test Report</h1>
    <ul>
`;

(async () => {
	const browser = await chromium.launch({ headless: true }); // headless: false to view the browser
	const page = await browser.newPage();
	
	//Create screenshots folder if it doesn't exist
	if (!fs.existsSync('screenshots')) {
		fs.mkdirSync('screenshots');
	}

	//Open Staging
	try {
		const startTime = performance.now();
		await page.goto('https://staging-cmp.frequencyads.com/login'); //Open URL
		await page.waitForSelector('//input[@id="username"]');
		const isLoaded = await page.isVisible('//input[@id="username"]');
		assert.strictEqual(isLoaded, true, `Page didn't load correctly`);
		const endTime = performance.now();
		const loadTime = (endTime - startTime).toFixed(2);
		console.log(`Page loaded in ${loadTime} milliseconds.`);	
		await page.screenshot({ path: 'screenshots/loginPage.jpg' });
	
		// Add to Report
		reportContent += `
			<li><h2 class="pass">Login page opened in ${loadTime} milliseconds</h2>
			<div class="screenshot">
				<img src="loginPage.jpg" alt="Login Page" width="1000">
			</div></li>`;
	}catch (error){
		console.error(`There was a problem on login page`, error);
			
			// Add error to report
			reportContent += `
				<li><h2 class="fail">There was a problem on login page</h2>
				<p>Error: ${error.message}</p></li>`;
	}
	
	////////// FUNCTIONS / STEPS //////////
	//Login
	const login = async (user) => {
		try {
			let userName;
			if (user === 'admin') userName = 'facu@frequencyads.com';
			else if (user === 'adops') userName = 'facu+adops@frequencyads.com';
			else if (user === 'sales') userName = 'facu+sales@frequencyads.com';
			else if (user === 'show') userName = 'facu+showhost@frequencyads.com';
			else if (user === 'network') userName = 'facu+networkproducer@frequencyads.com';
				
			await page.fill('//input[@id="username"]', userName); //Enter username
			await page.fill('//input[@id="password"]', 'password001'); //Enter password
			
			await page.click('//span[contains(text(), "Log in")]'); // Click on Log in
			await page.waitForLoadState('load');
			await page.waitForSelector('(//*[@class="ReactVirtualized__Grid__innerScrollContainer"])[2]');
			await page.waitForTimeout(3000);
			const isLoggedIn = await page.isVisible('(//*[@class="ReactVirtualized__Grid__innerScrollContainer"])[2]');
			assert.strictEqual(isLoggedIn, true, `The user ${user} didn't log in correctly`);			
			console.log(`Succesfull login for ${user}`);
			await page.screenshot({ path: `screenshots/post_login_${user}.jpg` });
			
			// Add to Report
			reportContent += `
				<li><h2 class="pass">Succesfull Login for ${user}</h2>
				<div class="screenshot">
					<img src="post_login_${user}.jpg" alt="Login ${user}" width="1000">
				</div></li>`;
		} catch (error) {
			console.error(`There was a problem login as ${user}:`, error);
			
			// Add error to report
			reportContent += `
				<li><h2 class="fail">There was a problem login as ${user}</h2>
				<p>Error: ${error.message}</p></li>`;
		}
	}
	
	//Logout
	const logout = async () => {
		try {
			await page.click('//li[@class="dropdown"]/a/span[2]');
			await page.click('//a[@href="/logout"]');
			await page.waitForSelector('//a[@href="/login"]');
			const isLoggedOut = await page.isVisible('//a[@href="/login"]');
			assert.strictEqual(isLoggedOut, true, "Session not logged out");
			
			console.log("Logout succesfull");
			await page.screenshot({ path: 'screenshots/logout.jpg' });
			
			await page.click("//a[@href='/login']");
			
			//Add to Report
			reportContent += `
				<li><h2 class="pass">Succesfull Logout</h2>
				<div class="screenshot">
					<img src="logout.jpg" alt="Logout" width="1000">
				</div></li>`;
		} catch (error) {
			console.error('Problem login out:', error);
			
			//Add error to report
			reportContent += `
				<li><h2 class="fail">Problem login out</h2>
				<p>Error: ${error.message}</p></li>`;
		}
	}

	const openCampaignVetting = async (advertiser) => {
		try {
			await page.click('//*[@href="/vetting/campaign"]');
			await page.click('//button[contains(text(), "Create Vetting Request")]');
			
			await page.waitForSelector('//*[@id="advertiser-select"]');
			let isLoaded = await page.isVisible('//*[@id="advertiser-select"]');
			assert.strictEqual(isLoaded, true, "Vetting request page not opened");
			console.log("Vetting Request page opened");
			
			await page.fill('//*[@id="advertiser-select"]', advertiser);
			await page.waitForTimeout(3000);
			await page.keyboard.press('Enter');
			
			await page.waitForSelector('//label[contains(text(),"Campaign Name")]');
			isLoaded = await page.isVisible('//label[contains(text(),"Campaign Name")]');
			assert.strictEqual(isLoaded, true, "Advertiser not selected");
			console.log("Advertiser Selected");
			
			
			console.log("Page opened succesfully");
			await page.screenshot({ path: 'screenshots/createVettingPage.jpg' });
			
			//Add to Report
			reportContent += `
				<li><h2 class="pass">Vetting Request page succesfully opened</h2>
				<div class="screenshot">
					<img src="createVettingPage.jpg" alt="Logout" width="1000">
				</div></li>`;
			
			
		}catch (error){
			console.error('There was a problem submitting the Vetting Request', error);
			
			//Add error to report
			reportContent += `
				<li><h2 class="fail">Problem Submitting Vetting Request</h2>
				<p>Error: ${error.message}</p></li>`;
		}
	}

	const submitCampaignVetting = async (opportunity, pe) => {
		try {
			//get timestamp
			const dateObject = new Date();
			let campaignName = dateObject.toUTCString();
			
			//Complete Campaign Details
			await page.fill('//label[contains(text(), "Campaign Name")]/following-sibling::div/input', campaignName);
			await page.fill('//label[contains(text(), "Campaign Details")]/following-sibling::div/textarea', 'Playwright Automation Generated Request');
			await page.fill('//label[contains(text(), "Campaign URL")]/../div/input', 'https://frequencyads.com/');
			await page.click('//p[contains(text(), "Dates are flexible")]'); //making dates flexible
			await page.fill('//label[contains(text(), "Media Agency")]/following-sibling::div/input', "Ad Results");
			await page.waitForTimeout(3000);
			await page.keyboard.press('ArrowDown');
			await page.keyboard.press('Enter'); //having problem selecting the Media Agency, is seems that there are no results this way
			//Take Screen
			console.log("Campaign details added");
			await page.screenshot({ path: 'screenshots/campaignDetails.jpg' });
			
			//Add to Report
			reportContent += `
				<li><h2 class="pass">Campaign details added</h2>
				<div class="screenshot">
					<img src="campaignDetails.jpg" alt="Logout" width="1000">
				</div></li>`;
			
			
			//Complete Vetting Details
			//Sales opportunity
			if (opportunity === 'activeSale') await page.click('//input[@name="active"]');
			else if (opportunity === 'proactivePitch') await page.click('//input[@name="proactive"]');
			else if (opportunity === 'internalPromo') await page.click('//input[@name="promo"]');
			else console.log("Active Sales was selected by default");
			
			//select ad formats
			await page.click('//*[contains(text(), "Ad Formats")]/span');
			
			//set Personal Experience
			await page.fill('//span[contains(text(), "Personal Experience")]/../../../following-sibling::div/div/textarea[1]', "I'm not like Skynet, trust me bro.");
			if (pe === 'peYes') await page.click('//input[@name="requiredPersonalExperience"]');
			
			
			//Take Screen
			console.log("Vetting details added");
			await page.screenshot({ path: 'screenshots/vettingDetails.jpg' });
			
			//Add to Report
			reportContent += `
				<li><h2 class="pass">Vetting details added</h2>
				<div class="screenshot">
					<img src="vettingDetails.jpg" alt="Logout" width="1000">
				</div></li>`;
			
			//Select shows
			await page.click('//p[contains(text(), "Automation Show")]/../../../../div/span/span/span/input');
			const ischecked = await page.isVisible('//p[contains(text(), "Automation Show")]/../../../../div/span/span/span[contains(@class, "Mui-checked")]');
			assert.strictEqual(ischecked, true, "Show not selected");
			console.log("Show Selected");
			await page.screenshot({ path: 'screenshots/submitVettingShowSelection.jpg' });
			//Add to Report
			reportContent += `
				<li><h2 class="pass">Show Selected</h2>
				<div class="screenshot">
					<img src="submitVettingShowSelection.jpg" alt="Logout" width="1000">
				</div></li>`;
			
			//Add some message
			await page.fill('//label[contains(text(), "Add Message")]/../div/textarea', "This request was generated automatically with playwright, please handle with care.");
			
			//Submit Request
			await page.click('//button[contains(text(), "Create Vetting Request")]');
			await page.waitForTimeout(3000);
			await searchCampaignVetting(campaignName);
			
			//Take Screen
			console.log("Vetting Request Submitted");
			await page.screenshot({ path: 'screenshots/submitVettingPage.jpg' });
			
			//Add to Report
			reportContent += `
				<li><h2 class="pass">Vetting Request submitted succesfully</h2>
				<div class="screenshot">
					<img src="submitVettingPage.jpg" alt="Logout" width="1000">
				</div></li>`;
			return campaignName;
		}catch (error){
			console.error('There was a problem submitting the Vetting Request', error);
			
			//Add error to report
			reportContent += `
				<li><h2 class="fail">Problem Submitting Vetting Request</h2>
				<p>Error: ${error.message}</p></li>`;
		}
	}
	
	const reviewCampaignVetting = async (campaignName, approve) => {
		try {
			await searchCampaignVetting(campaignName);				
			await page.click('//div[@class="ReactVirtualized__Grid _bottomRightGrid"]/div/div/div[1]');
			await page.waitForSelector('//div[@id="campaign-vetting-details"]');
			
			const header = await page.textContent('//h1[@class="campaign-header"]'); //Read the value entered
			assert.ok(header.includes(campaignName), `Expected: "${campaignName}", but found: "${header}"`);
			console.log("Campaign succesfully opened");
			
			await page.click('//*[@data-testid="ExpandMoreIcon"]');//expand to view details
			
			//select all shows
			await page.click('(//input[@class="PrivateSwitchBase-input css-1m9pwf3"])[1]');
			await page.click('//*[@id="basic-menu"]/div[3]/ul/li[2]');
			await page.waitForSelector('//button[contains(text(), "Decline")]');
			
			//validate the current status
			
			const currentStatus = await page.textContent('//div[@class="ReactVirtualized__Grid__innerScrollContainer"]/div/div[5]/span/span/div/div/span/span'); //Read the value entered
			assert.strictEqual(currentStatus, "Pending Review", "Status is not in review");
			
			//Validate if Accept and Decline buttons are displayed
			let declineButton = await page.isVisible('//button[contains(text(), "Decline")]');
			assert.strictEqual(declineButton, true, "Decline button not displayed");
			let approveButton = await page.isVisible('//button[contains(text(), "Approve")]');
			assert.strictEqual(approveButton, true, "Accept button not displayed");
			
			
			
			if (approve === 'yes') {
				await page.click('//button[contains(text(), "Approve")]'); //commented so it doesn't submit for now
				//wait for button to be displayed back 
				await page.waitForTimeout(3000);
				await page.waitForSelector('//button[contains(text(),"Update Vetting Request")]');
				const newStatus = await page.textContent('//div[@class="ReactVirtualized__Grid__innerScrollContainer"]/div/div[5]/span/span/div/div/span/span'); //Read the value entered
				assert.strictEqual(newStatus, "Pending Show Approval", "Status is not Approved");
				//Take Screen
				console.log("Vetting Request Approved");
				await page.screenshot({ path: 'screenshots/approveVetting.jpg' });
			
				//Add to Report
				reportContent += `
					<li><h2 class="pass">Campaign vetting succesfully Approved</h2>
					<div class="screenshot">
						<img src="approveVetting.jpg" alt="Logout" width="1000">
					</div></li>`;
			}
			else {
				await page.click('//button[contains(text(), "Decline")]');
				await page.waitForSelector('//label[contains(text(),"Enter any comments you may have")]/../div/textarea[1]');
				await page.fill('//label[contains(text(),"Enter any comments you may have")]/../div/textarea[1]',"Declining this request because I wanted to and you can do nothing about it");
				await page.click('//button[contains(text(),"Confirm")]');
				await page.waitForTimeout(3000);
				await page.waitForSelector('//button[contains(text(),"Update Vetting Request")]');
				const newStatus = await page.textContent('//div[@class="ReactVirtualized__Grid__innerScrollContainer"]/div/div[5]/span/span/div/div/span/span'); //Read the value entered
				assert.strictEqual(newStatus, "Declined", "Status is not Declined");
				//Take Screen
				console.log("Vetting Request Declined");
				await page.screenshot({ path: 'screenshots/declineVetting.jpg' });
			
				//Add to Report
				reportContent += `
					<li><h2 class="pass">Campaign vetting succesfully Declined</h2>
					<div class="screenshot">
						<img src="declineVetting.jpg" alt="Logout" width="1000">
					</div></li>`;
			}
						
			
			
		}catch (error){
			console.error('There was a problem reviewing the Vetting Request', error);
			
			//Add error to report
			reportContent += `
				<li><h2 class="fail">Problem Reviewing Vetting Request</h2>
				<p>Error: ${error.message}</p></li>`;
		}
	}
	
	const searchCampaignVetting = async (campaignName) => {
		try {
			await page.click('//*[@href="/vetting/campaign"]');
			await page.waitForSelector('//*[@id="outlined-basic"]');
			await page.fill('//*[@id="outlined-basic"]', campaignName);
			await page.waitForTimeout(3000);
			
			const valueFound = await page.textContent('//div[@class="ReactVirtualized__Grid _bottomRightGrid"]/div/div/div[3]/span/span/span'); //Read the value entered
			assert.strictEqual(campaignName, valueFound, `Expected value should be ${campaignName} found instead ${valueFound}`); // Validate the values are not entered
			await page.screenshot({ path: 'screenshots/searchVettingRequest.jpg' });			
			//Add to Report
			reportContent += `
				<li><h2 class="pass">Vetting Request available</h2>
				<div class="screenshot">
					<img src="searchVettingRequest.jpg" alt="Logout" width="1000">
				</div></li>`;
			
		}catch (error){
			console.error('There was a problem searching the Vetting Request', error);
			
			//Add error to report
			reportContent += `
				<li><h2 class="fail">Problem searching Vetting Request</h2>
				<p>Error: ${error.message}</p></li>`;
		}
	}
	
	
	
	////////// TESTS //////////
	
	//Login with all users
	/*const users = ['admin', 'adops', 'sales', 'show', 'network']; 
    for (const user of users) {
        await login(user);
		await logout();
    }*/
	
	//Submit Campaign Vetting Request
	await login('sales');
	await openCampaignVetting('Frequency');
	const campaignName = await submitCampaignVetting('activeSale', 'peYes');
	await logout();
	await login('adops');
	await reviewCampaignVetting(campaignName, 'no');
  
	await browser.close();

	//Complete report
	reportContent += `
		</ul>
	</body>
	</html>`;

	//write the content to an HTML file
	fs.writeFileSync('screenshots/report.html', reportContent, 'utf8');
	console.log('Report succesfully generated: screenshots/report.html');
})();
