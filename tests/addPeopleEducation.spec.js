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

test.describe('People Education',()=>{
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

    test('Add Education in people panel', async({},testInfo) =>{
        navmenu = new NavigationPage(page)
        const{searchPeopleByEmail, searchUniquePerson, personDegree, personSchoolName} = staticdata
        await navmenu.goToPage('people')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/firm/people')
        const people = new PeoplePanel(page);
        await people.searchPeople(searchPeopleByEmail)
        await people.openPeoplePanle(searchUniquePerson)
        await expect(page).toHaveURL(/#id:/);
        await expect(page.locator('.side-panel')).toBeVisible();
        await people.addPeopleEducation(personDegree,personSchoolName)
        await expect(page.getByText('Person education has been created.')).toBeVisible({timeout:20000})
        await people.closePeoplePanle();
    })
    test.afterAll(async({},testInfo) =>{
        //logout
        await loginpage.logout()
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}/session/new`);
     })   
})