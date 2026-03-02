import { test, expect, chromium } from '@playwright/test';
import { credentials } from '../testData/credentials';
import { LogInPage } from '../pages/logInPage';
import { NavigationPage } from '../pages/navigationPage';
import { ProjectPage } from '../pages/project';


let browser;
let context;
let page;
let loginpage;
let navmenu;
let envData;
let projectpage;


test.describe('Export Project', () => {
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
        
    test('Export projects', async ({},testInfo) => {
        projectpage = new ProjectPage(page)
        await navmenu.goToPage('projects/gridview')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/firm/projects/gridview')
        await projectpage.exportProject()
        await expect(page.getByText("We have started to export your projects to excel. We will email you when the job finishes."))
            .toBeVisible({timeout:10000})
    });

    test.afterAll(async({},testInfo) =>{
        //logout
        await loginpage.logout()
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/session/new')
      })   
});
