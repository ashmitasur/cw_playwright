import {test,expect,chromium} from '@playwright/test';
import { LogInPage } from '../../pages/logInPage';
import { credentials } from '../../testData/credentials';
import { staticdata } from '../../testData/staticdata';
import { NavigationPage } from '../../pages/navigationPage';
import { DealPage } from '../../pages/deal';

let browser;
let context;
let page;
let loginpage;
let navmenu;
let envData;

test.describe('Deal Team', ()=>{
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
    test('Add Target Team to deal',async ({},testInfo)=>{
        navmenu = new NavigationPage(page)
        const{searchDeal} = staticdata
        await navmenu.goToPage('deals')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/firm/deals')
        const dealpage = new DealPage(page)
        await dealpage.selectDealByName(searchDeal)
        await dealpage.addTargetPeople()     
        await expect(page.getByText(`has been added`)).toBeVisible({timeout:15000});
        await dealpage.closeDealPanel()
    })
    // test.afterAll(async({},testInfo) =>{
    //     //logout
    //     await loginpage.logout()
    //     await expect(page).toHaveURL(`${testInfo.project.use.baseURL}/session/new`);
    // }) 
})