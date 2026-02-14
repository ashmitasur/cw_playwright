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


test.describe('Project view', () => {
    test.beforeEach(async({})=>{
    browser = await chromium.launch({ headless: false})
    context = await browser.newContext()
    page = await context.newPage()

    loginpage = new LogInPage(page)
    
    const env = process.env.PLATFORM
    console.log(env)
    envData = credentials[env]
    const {firmname,accountUrl} = envData
    await loginpage.gotoAccountsPage(accountUrl)
    await loginpage.selectFirm(firmname)
    })

    test('add-person-with-static-data', async () => {
        navmenu = new NavigationPage(page)
        const people = new PeoplePage(page);
        const{personName, personEmail} = staticdata
        await navmenu.goToPage('people')
        await people.navigateToPeople()
        await people.openAddPerson();
      
        await people.fillPersonForm(personName, personEmail);           
        await people.submit();      
        await expect(page.locator('a.new-project-form--success-message-link')).toHaveText(personName);
    })
      test('add-person-with-vcard-import', async () => {
        navmenu = new NavigationPage(page)
        const people = new PeoplePage(page);
        await navmenu.goToPage('people')
        await people.navigateToPeople();
        await people.openVcardImport();
        await people.uploadFile('tests/uploadfiles/Yogesh_Kumar.vcf');
        await people.submit();
        await expect(page.getByText('Do not leave')).toBeVisible({timeout:30000});
    });

    test('add-person-with-csv-import', async () => {
      navmenu = new NavigationPage(page)
      const people = new PeoplePage(page);
      await navmenu.goToPage('people')
      await people.navigateToPeople();
      await people.openCsvImport();

      await people.uploadFile('tests/uploadfiles/sample.csv');
      await people.submit();
      await expect(page.getByText('Do not leave')).toBeVisible({timeout:30000});
    });

    test('add-person-with-resume-import', async () => {
      navmenu = new NavigationPage(page)
      const people = new PeoplePage(page);
      await navmenu.goToPage('people')
      await people.navigateToPeople();
      await people.openResumeImport();

      await people.uploadFile('tests/uploadfiles/Profile.pdf');
      await people.submit();
      await expect(page.getByText('Do not leave')).toBeVisible({timeout:30000});
    });
    
    test.afterAll(async({},testInfo) =>{
        //logout
        await loginpage.logout()
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}/session/new`);
    })   
    
  });

