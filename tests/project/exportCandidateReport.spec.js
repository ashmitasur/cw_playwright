import { test, expect, chromium } from '@playwright/test';
import { LogInPage } from '../../pages/logInPage';
import { credentials } from '../../testData/credentials';
import { NavigationPage } from '../../pages/navigationPage';
import { ProjectPage } from '../../pages/project';
import { CandidatePage } from '../../pages/candidatePage';
import { staticdata } from '../../testData/staticdata';


let browser;
let context;
let page;
let loginpage;
let navmenu;
let envData;
let projectpage;
let candidatepage;

test.describe('Project Girdview',() =>{
    test.beforeAll(async() =>{
        browser = await chromium.launch({headless: false})
        context = await browser.newContext()
        page = await context.newPage()

        loginpage = new LogInPage(page)
        navmenu = new NavigationPage(page)
        projectpage = new ProjectPage(page)
        candidatepage = new CandidatePage(page)
        const env = process.env.PLATFORM
        envData = credentials[env]
        const {firmname,accountUrl} = envData

        await loginpage.gotoAccountsPage(accountUrl)
        await loginpage.selectFirm(firmname)
    })

    test("Open Project Gridview and add Candidate", async({},testInfo)=>{
        await navmenu.goToPage('projects/gridview')
        await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/firm/projects/gridview')  
        const{projectWithCandidate} = staticdata      
        const newPage = await projectpage.openProject(context,projectWithCandidate)
        await projectpage.openSection(newPage,'candidates')
        expect(await newPage.url()).toContain('candidates') 
        await candidatepage.exportReport(newPage);
        await expect(newPage.locator('.message > strong'))
        .toContainText('An email with a link to download the report');
        
    })

    //  test.afterAll(async({},testInfo) =>{
    //     //logout
    //     await loginpage.logout()
    //     await expect(page).toHaveURL(`${testInfo.project.use.baseURL}`+'/session/new')
    // })   
})
