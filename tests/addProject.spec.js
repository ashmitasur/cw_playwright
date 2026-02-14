import { test, expect, chromium } from '@playwright/test';
import { LogInPage } from '../pages/logInPage';
import { credentials } from '../testData/credentials';
import { NavigationPage } from '../pages/navigationPage';
import { ProjectPage } from '../pages/project';
import { staticdata } from '../testData/staticdata';

let browser;
let context;
let page;
let loginpage;
let navmenu;
let envData;
let projectpage;


test.describe('Add Project', () => {
    test.beforeAll(async()=>{
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
        
    test('add-project-with-data', async ({},testInfo) => {
        projectpage = new ProjectPage(page)
        const {projectName,companySearch,location} = staticdata
        await navmenu.goToPage('projects/gridview')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/firm/projects/gridview')
        await projectpage.clickAddProject();
        await projectpage.fillProjectForm(projectName,companySearch,location);
        await projectpage.submitAddProjectForm();
        await expect(page.locator('.alert-message > p')).toContainText('successfully created');
    });

    test.afterAll(async({},testInfo) =>{
        //logout
        await loginpage.logout()
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/session/new')
      })   
});
