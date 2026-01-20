import { test as setup, chromium} from '@playwright/test';
import path from 'path';
import { LogInPage } from '../pages/logInPage';
import { credentials } from '../testData/credentials';

const authFile = path.join(__dirname, '../playwright/.auth/user.json');

let browser;
let context;
let page;
let loginpage;
let envData;

setup('authenticate', async({baseURL}) => {

    browser = await chromium.launch({ headless: false})
    context = await browser.newContext()
    page = await context.newPage()

    loginpage = new LogInPage(page)
    
    const env = 'qa'
    envData = credentials[env]
    const {email,password} = envData
    //const { baseURL } = testInfo.project.use.baseURL
    console.log(baseURL)

    // Go to login page
    await loginpage.gotoLoginPage(baseURL) 
    await loginpage.login(email,password);
    await page.waitForURL(/accounts/)

    await page.context().storageState({ path: authFile });
    await browser.close();
    })
    