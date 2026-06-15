import {test, expect, chromium} from "@playwright/test"
import { credentials } from "../../testData/credentials"
import { LogInPage } from "../../pages/logInPage"
import { staticdata } from "../../testData/staticdata"
import { CompanyPage } from "../../pages/companyPage"
import { NavigationPage } from "../../pages/navigationPage"

let loginpage
let navmenu
let browser
let context
let page
let companypage
let envData

test.describe('Update Company Profile', () =>{
    test.beforeEach(async({})=>{
        browser = await chromium.launch()
        context = await browser.newContext()
        page = await context.newPage()
        const env = process.env.PLATFORM
        envData = credentials[env]
        const {firmname,accountUrl} = envData
        loginpage = new LogInPage(page)
        await loginpage.gotoAccountsPage(accountUrl)
        await loginpage.selectFirm(firmname)
    })
    test('Update company profile', async({},testInfo) =>{
        const {companySearch, companySubtitle} = staticdata
        navmenu = new NavigationPage(page)
        await navmenu.goToPage('companies')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/firm/companies')
        companypage = new CompanyPage(page)
        await companypage.selectCompanyByName(companySearch)
        await companypage.updateProfile(companySubtitle)
        await expect(page.getByText('Company Profile has been updated successfully.'))
        .toBeVisible({timeout:10000});        
        //await dealpage.closeDealPanel()
    })
    // test.afterAll(async({},testInfo) =>{
    //     //logout
    //     await loginpage.logout()
    //     await expect(page).toHaveURL(`${testInfo.project.use.baseURL}/session/new`);
    // }) 
})