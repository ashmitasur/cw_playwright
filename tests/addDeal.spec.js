import {test,expect,chromium} from '@playwright/test';
import { LogInPage } from '../pages/logInPage';
import { credentials } from '../testData/credentials';
import { staticdata } from '../testData/staticdata';
import { NavigationPage } from '../pages/navigationPage';
import { DealPage } from '../pages/deal';

let browser;
let context;
let page;
let loginpage;
let navmenu;
let envData;

test.describe('Add Deal', ()=>{
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
    test('Add new deal',async ({},testInfo)=>{
        navmenu = new NavigationPage(page)
        const{dealName,dealCompany} = staticdata
        await navmenu.goToPage('deals')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/firm/deals')
        const dealpage = new DealPage(page)
        dealpage.clickAddDeal()
        dealpage.fillDealForm(dealName,dealCompany)
        dealpage.submitAddDealForm()
        await expect(page.getByText(`Deal ${dealCompany}/${dealName} successfully created.`))
        .toBeVisible({timeout:15000});
    })
    test.afterAll(async({},testInfo) =>{
        //logout
        await loginpage.logout()
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}/session/new`);
    }) 
})