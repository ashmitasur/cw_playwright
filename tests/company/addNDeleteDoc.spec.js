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

test.describe('Company Document', ()=>{
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
    test('Add and Delete Company Doc',async ({},testInfo)=>{
        navmenu = new NavigationPage(page)
        const{company} = staticdata
        await navmenu.goToPage('companies')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/firm/companies')
        const companypage = new CompanyPage(page)
        await companypage.selectCompanyByName(company)
        await companypage.addCompanyDoc('tests/uploadfiles/AWS Architecture - 2025.docx')     
        await expect(page.getByText('Company attachment has been created.')).toBeVisible({timeout:20000});
        await companypage.deleteCompanyDoc()
        await expect(page.getByText('has been deleted.')).toBeVisible({timeout:10000});
        //await dealpage.closeDealPanel()
        
    })
    // test.afterAll(async({},testInfo) =>{
    //     //logout
    //     await loginpage.logout()
    //     await expect(page).toHaveURL(`${testInfo.project.use.baseURL}/session/new`);
    // }) 
})