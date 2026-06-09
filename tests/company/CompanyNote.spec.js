import {test,expect,chromium} from '@playwright/test';
import { LogInPage } from '../../pages/logInPage';
import { credentials } from '../../testData/credentials';
import { staticdata } from '../../testData/staticdata';
import { NavigationPage } from '../../pages/navigationPage';
import { CompanyPage } from '../../pages/companyPage';

let browser;
let context;
let page;
let loginpage;
let navmenu;
let envData;

test.describe('Company Note', ()=>{
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
        const{company,note} = staticdata
        await navmenu.goToPage('companies')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/firm/companies')
        const companypage = new CompanyPage(page)
        await companypage.selectCompanyByName(company)
        await companypage.openNotePanle()
        await companypage.addNote(note)        
        await expect(page.getByText('Note added')).toBeVisible();
        await companypage.editNote(note)
        await companypage.replyToNote(note)
        await expect(page.getByText('Note added')).toBeVisible();
        await companypage.deleteNote()
    })
    // test.afterAll(async({},testInfo) =>{
    //     //logout
    //     await loginpage.logout()
    //     await expect(page).toHaveURL(`${testInfo.project.use.baseURL}/session/new`);
    // }) 
})