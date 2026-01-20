import { test, expect, chromium } from '@playwright/test';
import { LogInPage } from '../pages/logInPage';
import { credentials } from '../testData/credentials';

test('positive login test - QA', async () => {
  const browser = await chromium.launch({ headless: false , slowMo: 1000})
  const page = await browser.newPage()

  //Visit QA environment
  const loginpage = new LogInPage(page)
  const env = 'qa'
  const {email,password,url,firmname} = credentials[env]
  await loginpage.gotoLoginPage(url) 

  //login with credential 
  await loginpage.login(email,password);
  await expect(loginpage.page).toHaveURL(/accounts/)
  await loginpage.selectFirm(firmname)
  await expect(loginpage.page).toHaveURL(url+'/firm/dashboard')
  
  //logout
  await loginpage.logout()
  await expect(loginpage.page).toHaveURL(url+'/session/new')
});