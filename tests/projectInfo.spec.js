import { test, expect, chromium } from '@playwright/test';
import { LogInPage } from '../pages/logInPage';
import { credentials } from '../testData/credentials';
import { NavigationPage } from '../pages/navigationPage';
import { ProjectPage } from '../pages/project';

let browser;
let context;
let page;
let loginpage;
let navmenu;
let envData;
let projectpage;

test.describe('Project view', () => {
    test.beforeAll(async()=>{
    browser = await chromium.launch({ headless: false})
    context = await browser.newContext()
    page = await context.newPage()

    loginpage = new LogInPage(page)
    navmenu = new NavigationPage(page)
    projectpage = new ProjectPage(page)
    
    const env = 'qa'
    envData = credentials[env]
    const {firmname,accountUrl} = envData

    await loginpage.gotoAccountsPage(accountUrl)
    await loginpage.selectFirm(firmname)
    })
    
    test('should navigate to Projects info page', async () => {
        const {url} = envData
        await navmenu.goToPage('Projects')
        await expect(page).toHaveURL(url+'/firm/projects/gridview')

        const newPage = await projectpage.openProject(context,'Central Communications Assistant')
        await projectpage.openSection(newPage,'Project Info')
        expect(await newPage.url()).toContain('project_info')    
    })    
    
    test.afterAll(async() =>{
        //logout
        const {url} = envData
        await loginpage.logout()
        await expect(page).toHaveURL(url+'/session/new')
    })   
    
  });