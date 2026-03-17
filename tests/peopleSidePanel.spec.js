import { test, expect, chromium } from '@playwright/test';
import { LogInPage } from '../pages/logInPage';
import { credentials } from '../testData/credentials';
import { NavigationPage } from '../pages/navigationPage';
import { PeoplePage } from '../pages/peoplePage';
import { staticdata } from '../testData/staticdata';

let browser;
let context;
let page;
let loginpage;
let navmenu;
let envdata;

test.describe('People Side Panel',()=>{
    test.beforeEach(async({})=>{
        browser = await chromium.launch()
        context = await browser.newContext()
        page = await context.newPage()

        loginpage = new LogInPage(page)
        const env = process.env.PLATFORM
        envdata = credentials[env]
        const{firmname,accountUrl} = envdata

        await loginpage.gotoAccountsPage(accountUrl)
        await loginpage.selectFirm(firmname)
    })

    test('Open people panel', async({}, testInfo) =>{
        navmenu = new NavigationPage(page)
        const{searchPeopleName} = staticdata
        await navmenu.goToPage('people')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/firm/people')
        const people = new PeoplePage(page);
        await people.searchPeople(searchPeopleName)
        await people.openPeoplePanle(searchPeopleName)
        await expect(page).toHaveURL(/#id:/);
        await expect(page.locator('.side-panel')).toBeVisible();
        await people.closePeoplePanle()
    })

    test.afterAll(async({},testInfo) =>{
        //logout
        await loginpage.logout()
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}/session/new`);
     })   
})