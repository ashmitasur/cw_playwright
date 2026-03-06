import { test, expect, chromium } from '@playwright/test';
import { credentials } from '../testData/credentials';
import { LogInPage } from '../pages/logInPage';
import { NavigationPage } from '../pages/navigationPage';
import { PeoplePage } from '../pages/peoplePage';


let browser;
let context;
let page;
let loginpage;
let navmenu;
let envData;
let peoplepage;


test.describe('Export People', () => {
    test.beforeAll(async()=>{
        browser = await chromium.launch({ headless: false})
        context = await browser.newContext()
        page = await context.newPage()
    
        loginpage = new LogInPage(page)
        navmenu = new NavigationPage(page)
            
        const env = process.env.PLATFORM    
        envData = credentials[env]
        const {firmname,accountUrl} = envData
    
        await loginpage.gotoAccountsPage(accountUrl)
        await loginpage.selectFirm(firmname)
        })
        
    test('Export people in csv', async ({},testInfo) => {
        peoplepage = new PeoplePage(page)
        await navmenu.goToPage('people')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/firm/people')
        await peoplepage.clickOn3Dots()
        await peoplepage.exportPeople()
        await expect(page.getByText("We have started to export your contacts to CSV. We will email you when the job finishes."))
            .toBeVisible({timeout:10000})
    });

    test.afterAll(async({},testInfo) =>{
        //logout
        await loginpage.logout()
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/session/new')
      })   
});
