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
let envData;


test.describe('People Bulk action', () => {
    test.beforeEach(async({})=>{
    browser = await chromium.launch({ headless: false})
    context = await browser.newContext()
    page = await context.newPage()

    loginpage = new LogInPage(page)
    navmenu = new NavigationPage(page)

    const env = process.env.PLATFORM
    envData = credentials[env]
    const {firmname,accountUrl} = envData
    await loginpage.gotoAccountsPage(accountUrl)
    await loginpage.selectFirm(firmname)
    })

    
    test('add person note', async ({},testInfo) => {
        const people = new PeoplePage(page);
        await navmenu.goToPage('people')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/firm/people')
        const{searchPeople, note} = staticdata
        await people.searchPeople(searchPeople)
        await people.selectAllPeople()
        await people.addNote(note)
        await expect(page.getByText('Note added')).toBeVisible({timeout:30000})
    });

    test('add person email', async ({},testInfo) => {
        const people = new PeoplePage(page);
        await navmenu.goToPage('people')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/firm/people')
        const{searchPeople, emailSubject, emailContent} = staticdata
        await people.searchPeople(searchPeople)
        await people.selectAllPeople()
        await people.addEmail(emailSubject,emailContent)
        await expect(page.getByText('Your mass mail campaign was successful.')).toBeVisible({timeout:30000})
    });

    test('bulk edit people', async ({},testInfo) => {
        const people = new PeoplePage(page);
        await navmenu.goToPage('people')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/firm/people')
        const{searchPeople} = staticdata
        await people.searchPeople(searchPeople)
        await people.selectAllPeople()
        await people.bulkEdit()
        await expect(page.getByText('We are processing your request.')).toBeVisible({timeout:10000})
    });

    
    test.afterAll(async({},testInfo) =>{
        //logout
        await loginpage.logout()
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}/session/new`);
    })   
    
  });

