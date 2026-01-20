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
        await navmenu.goToPage('People')
        await people.navigateToPeople()
        await people.openAddPerson();
      
        await people.fillPersonForm(personName, personEmail);           
        await people.submit();      
        await people.expectAlertContains(personName);
      });

      test('add-person-with-vcard-import', async () => {
        navmenu = new NavigationPage(page)
        const people = new PeoplePage(page);
        await navmenu.goToPage('People')
        await people.navigateToPeople();
        await people.openVcardImport();

        await people.uploadFile('tests/uploadfiles/Yogesh_Kumar.vcf');
        await people.submit();
        await people.expectAlertContains('Do not leave.');
    });

    test('add-person-with-csv-import', async () => {
      navmenu = new NavigationPage(page)
      const people = new PeoplePage(page);
      await navmenu.goToPage('People')
      await people.navigateToPeople();
      await people.openCsvImport();

      await people.uploadFile('tests/uploadfiles/sample.csv');
      await people.submit();
      await people.expectAlertContains('Do not leave.');
    });

    test('add-person-with-resume-import', async () => {
      navmenu = new NavigationPage(page)
      const people = new PeoplePage(page);
      await navmenu.goToPage('People')
      await people.navigateToPeople();
      await people.openResumeImport();

      await people.uploadFile('tests/uploadfiles/Profile.pdf');
      await people.submit();
        await people.expectAlertContains('Do not leave.');
    });
    
    test.afterAll(async({},testInfo) =>{
        //logout
        //const {url} = envData
        await loginpage.logout()
        //await expect(page).toHaveURL(url+'/session/new')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}/session/new`);
    })   
    
  });








// import { test, expect } from '@playwright/test';
// import { LogInPage } from '../pages/logInPage';
// import { credentials } from '../testData/credentials';
// import { NavigationPage } from '../pages/navigationPage';
// import { PeoplePage } from '../pages/peoplePage';
// import { staticdata } from '../testData/staticdata';

// let loginpage;
// let navmenu;
// let envData;

// test.describe('Project view', () => {

//   test.beforeEach(async ({ page }) => {
//     loginpage = new LogInPage(page);

//     const env = 'qa';
//     envData = credentials[env];
//     const {firmname,accountUrl} = envData

//     await loginpage.gotoAccountsPage(accountUrl)
//     await loginpage.selectFirm(firmname)
//   });

//   test('add-person-with-static-data', async ({ page }) => {
//     navmenu = new NavigationPage(page)
//     const people = new PeoplePage(page);
//     const { personName, personEmail } = staticdata;

//     await navmenu.goToPage('People');
//     await people.navigateToPeople();
//     await people.openAddPerson();
//     await people.fillPersonForm(personName, personEmail);
//     await people.submit();
//     await people.expectAlertContains(personName);
//   });

//   test('add-person-with-vcard-import', async ({ page }) => {
//     navmenu = new NavigationPage(page);
//     const people = new PeoplePage(page);

//     await navmenu.goToPage('People');
//     await people.navigateToPeople();
//     await people.openVcardImport();

//     await people.uploadFile('tests/uploadfiles/Yogesh_Kumar.vcf');
//     await people.submit();
//     await people.expectAlertContains('Do not leave.');
//   });

//   test('add-person-with-csv-import', async ({ page }) => {
//     navmenu = new NavigationPage(page);
//     const people = new PeoplePage(page);

//     await navmenu.goToPage('People');
//     await people.navigateToPeople();
//     await people.openCsvImport();

//     await people.uploadFile('tests/uploadfiles/sample.csv');
//     await people.submit();
//     await people.expectAlertContains('Do not leave.');
//   });

//   test('add-person-with-resume-import', async ({ page }) => {
//     navmenu = new NavigationPage(page);
//     const people = new PeoplePage(page);

//     await navmenu.goToPage('People');
//     await people.navigateToPeople();
//     await people.openResumeImport();

//     await people.uploadFile('tests/uploadfiles/Profile.pdf');
//     await people.submit();
//     await people.expectAlertContains('Do not leave.');
//   });

//   test.afterEach(async ({ page }) => {
//     const { url } = envData;
//     await loginpage.logout();
//     //await expect(page).toHaveURL(url + '/session/new');
//   });

// });
