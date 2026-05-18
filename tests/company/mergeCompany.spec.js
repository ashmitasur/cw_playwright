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

test.describe('Merge Companies', ()=>{
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
    test('Merge Companies',async ({},testInfo)=>{
        navmenu = new NavigationPage(page)
        await navmenu.goToPage('companies')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/firm/companies')
        const {searchToMergeCompany} = staticdata
        const companypage = new CompanyPage(page)
        await companypage.mergeCompany(searchToMergeCompany)
        await expect(page.getByText("companies merged"))
        .toBeVisible({timeout:15000});
    })
    // test.afterAll(async({},testInfo) =>{
    //     //logout
    //     await loginpage.logout()
    //     await expect(page).toHaveURL(`${testInfo.project.use.baseURL}/session/new`);
    // }) 
})