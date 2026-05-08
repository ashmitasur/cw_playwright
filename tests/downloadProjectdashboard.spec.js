import { test, expect, chromium } from '@playwright/test';
import { LogInPage } from '../pages/logInPage';
import { credentials } from '../testData/credentials';
import { NavigationPage } from '../pages/navigationPage';
import { ProjectPage } from '../pages/project';
import { staticdata } from '../testData/staticdata';
import { ProjectDashboard } from '../pages/projectDashboard';

let browser;
let context;
let page;
let loginpage;
let navmenu;
let envData;
let projectpage;
let projectdashboardpage;

test.describe('Project Girdview',() =>{
    test.beforeAll(async() =>{
        browser = await chromium.launch({headless: false})
        context = await browser.newContext()
        page = await context.newPage()

        loginpage = new LogInPage(page)
        navmenu = new NavigationPage(page)
        projectpage = new ProjectPage(page)
        projectdashboardpage = new ProjectDashboard(page)
        const env = process.env.PLATFORM
        envData = credentials[env]
        const {firmname,accountUrl} = envData

        await loginpage.gotoAccountsPage(accountUrl)
        await loginpage.selectFirm(firmname)
    })

    test("Downlaod project Dashboard", async({},testInfo)=>{
        await navmenu.goToPage('projects/gridview')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/firm/projects/gridview')  
        const{searchProject} = staticdata      
        const newPage = await projectpage.openProject(context,searchProject)
        await projectpage.openSection(newPage,'dashboard')
        expect(await newPage.url()).toContain('dashboard')   
        await projectdashboardpage.downloadProjectDashboardInPdf(newPage)
        await expect(newPage.getByText('Dashboard print is downloaded successfully.'))
        .toBeVisible({timeout:20000})
        await projectdashboardpage.downloadProjectDashboardInImage(newPage)
        await expect(newPage.getByText('Dashboard print is downloaded successfully.'))
        .toBeVisible({timeout:20000})
    })

     test.afterAll(async({},testInfo) =>{
        //logout
        await loginpage.logout()
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/session/new')
    })   
})
