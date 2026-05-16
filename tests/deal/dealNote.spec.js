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

test.describe('Deal Note', ()=>{
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
    test('Add, update, relpy and delete note',async ({},testInfo)=>{
        navmenu = new NavigationPage(page)
        const{searchDeal,note} = staticdata
        await navmenu.goToPage('deals')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/firm/deals')
        const dealpage = new DealPage(page)
        await dealpage.selectDealByName(searchDeal)
        await dealpage.openNotePanle()
        await dealpage.addNote(note)        
        await expect(page.getByText('Note added')).toBeVisible();
        await dealpage.editNote(note)
        await dealpage.replyToNote(note)
        await expect(page.getByText('Note added')).toBeVisible();
        await dealpage.deleteNote()
        await dealpage.closeDealPanel()
    })
    // test.afterAll(async({},testInfo) =>{
    //     //logout
    //     await loginpage.logout()
    //     await expect(page).toHaveURL(`${testInfo.project.use.baseURL}/session/new`);
    // }) 
})