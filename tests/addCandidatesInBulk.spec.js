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


test.describe('Add bulk candidacies', () => {
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

    test('add person to project', async ({},testInfo) => {
        const people = new PeoplePage(page);
        await navmenu.goToPage('people')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/firm/people')
        const{searchPeople, searchToSelectProject} = staticdata
        await people.searchPeople(searchPeople)
        await people.selectAllPeople()
        await people.bulkCandidacyAdd(searchToSelectProject)
        await expect(page.getByText('Candidates added')).toBeVisible({timeout:30000})
    });
    
    test.afterAll(async({},testInfo) =>{
        //logout
        await loginpage.logout()
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}/session/new`);
    })   
    
  });

