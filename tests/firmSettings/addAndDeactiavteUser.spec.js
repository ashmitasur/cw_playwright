import{ test,expect,chromium } from '@playwright/test';
import { LogInPage } from "../../pages/logInPage";
import { NavigationPage } from '../../pages/navigationPage';
import { staticdata } from '../../testData/staticdata';
import { credentials } from '../../testData/credentials';
import { FirmSettingsPage } from '../../pages/firmSettingsPage';

let browser
let context
let page
let loginpage
let envData;

test.describe('Firm Settings Actions', ()=>{
    test.beforeEach(async({})=>{
        browser = await chromium.launch()
        context = await browser.newContext()
        page = await context.newPage()

        loginpage = new LogInPage(page)
        const env = process.env.PLATFORM
        envData = credentials[env]
        const{firmname, accountUrl} = envData
        await loginpage.gotoAccountsPage(accountUrl)
        await loginpage.selectFirm(firmname)
    })
    test('Add and Deactivate Firm User', async({},testInfo)=>{
        const firmsettingspage = new FirmSettingsPage(page)
        const{userName,userEmail} = staticdata
        await firmsettingspage.goToFirmSettings()
        await firmsettingspage.addAdminUser(userName,userEmail)
        await expect(page.getByText('Your changes have been saved.')).toBeVisible({timeout:10000})
        await firmsettingspage.deactivateAdminUser(userEmail)
        await expect(page.getByText('The user has been deactivated.')).toBeVisible({timeout:10000})
    })

    // test.afterAll(async({},testInfo) =>{
    //     //logout
    //     await loginpage.logout()
    //     await expect(page).toHaveURL(`${testInfo.project.use.baseURL}/session/new`);
    // })  
})

