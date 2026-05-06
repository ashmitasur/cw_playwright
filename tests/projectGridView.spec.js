import { test, expect, chromium } from '@playwright/test';
import { LogInPage } from '../pages/logInPage';
import { credentials } from '../testData/credentials';
import { NavigationPage } from '../pages/navigationPage';
import { ProjectPage } from '../pages/project';
import { ProjectGridViewPage } from '../pages/projectGridView';
import { staticdata } from '../testData/staticdata';


let browser;
let context;
let page;
let loginpage;
let navmenu;
let envData;
let projectpage;
let projectgridview;

test.describe('Project Girdview',() =>{
    test.beforeAll(async() =>{
        browser = await chromium.launch({headless: false})
        context = await browser.newContext()
        page = await context.newPage()

        loginpage = new LogInPage(page)
        navmenu = new NavigationPage(page)
        projectpage = new ProjectPage(page)
        projectgridview = new ProjectGridViewPage(page)
        const env = process.env.PLATFORM
        envData = credentials[env]
        const {firmname,accountUrl} = envData

        await loginpage.gotoAccountsPage(accountUrl)
        await loginpage.selectFirm(firmname)
    })

    test("Open Project Gridview and add Candidate", async({},testInfo)=>{
        await navmenu.goToPage('projects/gridview')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/firm/projects/gridview')  
        const{searchProject,candidateName} = staticdata      
        const newPage = await projectpage.openProject(context,searchProject)
        await projectpage.openSection(newPage,'grid_view')
        expect(await newPage.url()).toContain('grid_view') 
        await projectgridview.addCandidate(newPage,candidateName)  
        await expect(newPage.getByText('Candidate added')).toBeVisible()
        await projectgridview.removeCandidate(newPage)
        await expect(newPage.getByText('candidate has been removed from the project.')).toBeVisible()
    })

     test.afterAll(async({},testInfo) =>{
        //logout
        await loginpage.logout()
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/session/new')
    })   
})
