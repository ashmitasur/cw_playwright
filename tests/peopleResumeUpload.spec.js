import { test, expect, chromium } from '@playwright/test';
import { LogInPage } from '../pages/logInPage';
import { credentials } from '../testData/credentials';
import { NavigationPage } from '../pages/navigationPage';
import { PeoplePanel } from '../pages/peoplePanel';
import { staticdata } from '../testData/staticdata';

let browser;
let context;
let page;
let loginpage;
let navmenu;
let envdata;

test.describe('Add people to project',()=>{
    test.beforeEach(async({}) =>{
        browser = await chromium.launch();
        context = await browser.newContext();
        page = await context.newPage()

        const env = process.env.PLATFORM
        envdata = credentials[env]
        const{accountUrl,firmname} = envdata
        loginpage = new LogInPage(page)
        await loginpage.gotoAccountsPage(accountUrl)
        await loginpage.selectFirm(firmname)
    })

    test('Upload and parse resume from people panel', async({},testInfo) =>{
        navmenu = new NavigationPage(page)
        const{searchPeopleByEmail, searchUniquePerson, documentTitle} = staticdata
        await navmenu.goToPage('people')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/firm/people')
        const people = new PeoplePanel(page);
        await people.searchPeople(searchPeopleByEmail)
        await people.openPeoplePanle(searchUniquePerson)
        await expect(page).toHaveURL(/#id:/);
        await expect(page.locator('.side-panel')).toBeVisible();
        await people.uploadResume('tests/uploadfiles/Profile(33).pdf', documentTitle)
        //await expect(page.getByText('The resume has been submitted for parsing.')).toBeVisible({timeout:20000});

    })
})