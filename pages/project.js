import { expect } from '@playwright/test';
export class ProjectPage{
    constructor(page){
        this.page = page              
    }
    async openProject(context,projectName){
        const pagePromise = context.waitForEvent('page')
        await this.page.waitForSelector('[data-testid="project-title"]')
        const projectTitle = await this.page.getByTestId('project-title').getByText(projectName)
        await projectTitle.click()
        const newPage = await pagePromise
        await expect(newPage.locator('.project-container__project-title'))
        .toHaveText(/Central Communications Assistant/)
        return newPage
    }
    async openSection(newPage,sectionTitle){
        await expect(newPage.locator('.navigation-sidebar__right__list')).toBeVisible()
        await newPage.locator(`a[title= '${sectionTitle}']`).click()
    }
}