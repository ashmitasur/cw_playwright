import {test,expect,chromium} from '@playwright/test';
import { LogInPage } from '../../pages/logInPage';
import { credentials } from '../../testData/credentials';
import { staticdata } from '../../testData/staticdata';
import { NavigationPage } from '../../pages/navigationPage';
import { CompanyPage } from '../../pages/company';

let browser;
let context;
let page;
let loginpage;
let navmenu;
let envData;

test.describe('Export Deal', ()=>{
    test.beforeEach(async({})=>{
        browser = await chromium.launch({ headless: false})
        context = await browser.newContext()
        page = await context.newPage()
            
        loginpage = new LogInPage(page)
                
        const env = process.env.PLATFORM
        envData = credentials[env]
        const {firmname,accountUrl} = envData
        await loginpage.gotoAccountsPage(accountUrl)
        await loginpage.selectFirm(firmname)
    })
    test('Export deal',async ({},testInfo)=>{
        navmenu = new NavigationPage(page)
        await navmenu.goToPage('companies')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/firm/companies')
        const companypage = new CompanyPage(page)
        await companypage.exportCompany()
        await expect(page.getByText("We have started to export your companies to excel. We will email you when the job finishes."))
        .toBeVisible({timeout:15000});
    })
    // test.afterAll(async({},testInfo) =>{
    //     //logout
    //     await loginpage.logout()
    //     await expect(page).toHaveURL(`${testInfo.project.use.baseURL}/session/new`);
    // }) 
})