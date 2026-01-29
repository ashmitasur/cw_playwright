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

test.describe('bulk edit project', () => {
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
        
    test('add country in bulk', async ({},testInfo) => {
        const {serachProjectName} = staticdata
        projectpage = new ProjectPage(page)
        await navmenu.goToPage('Projects')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/firm/projects/gridview')
        await projectpage.searchProject(serachProjectName)
        await projectpage.selectFirstNProjects(3)
        await projectpage.bulkEdit()
        await projectpage.bulkUpdateSave('country')        
        await expect(page.locator('.alert-message > p')).toContainText('We are working on your changes',{timeout:10000})
        await projectpage.closeBulkEditModal()
    })

    test.afterAll(async({},testInfo) =>{
        //logout
        await loginpage.logout()
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/session/new')
      })   
});
