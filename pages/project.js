import { expect } from '@playwright/test';
export class ProjectPage{
    constructor(page){
        this.page = page  
        this.keyWordSearch = page.locator("[class='project-list-view__header-section__keyword-search'] input[id='text-search-input']");
        this.bulkUpdateBtn = page.locator('.project-list-view__bulk-update-btn');    
    }

    // Add project
    async clickAddProject() {
        await this.page
        .locator('.responsive-action-bar__left button[data-testid="single-select-btn"]')
        .click();

        await this.page.locator('[data-testid="add"]').click();
    }

    async fillProjectForm(projectName, companySearch) {
        await this.page.locator('#projectName').fill(projectName);
        await this.selectDropdown('projectType');

        await this.page.locator('input[name="company"]').fill(companySearch);
        await this.page
        .locator('.companyProfile > :nth-child(3) > [data-testid="single-search-dd"] > [data-testid="single-search-dd-button"]')
        .click();

        await this.page.locator('.search-select__list > :nth-child(2)').click();
    }

    async selectDropdown(buttonId) {
        await this.page.locator(`button[id="${buttonId}"]`).click();
        await this.page.locator('.search-select > :nth-child(1)').click();
    }

    async submitAddProjectForm() {
        await this.page.locator('.form-actions__buttons > .pri-button').click();
    }

    async searchProject(projectName) {
        await this.keyWordSearch.fill(projectName);
        const searchResponse = this.page.waitForResponse(
        res => res.url().includes('/spapi/projects?filter') && res.status() === 200
        );
        await this.keyWordSearch.press('Enter');
        await this.keyWordSearch.press('Enter');
        await searchResponse;
    }

    async selectFirstNProjects(count) {
        const checkboxes = this.page.locator('div.shadcn-checkbox > button[type="button"]');
        const total = await checkboxes.count();

        for (let i = 1; i <= count && i < total; i++) {
        await checkboxes.nth(i).check();
        await expect(checkboxes.nth(i)).toBeChecked();
        }
    }

    async bulkEdit() {
        await this.bulkUpdateBtn.click();
        await this.selectDropdown('add-country')
    }

    async bulkUpdateSave(buttonName){
        await expect(this.page.locator(`.project-bulk-edit__save-btn[name="${buttonName}"]`)).toBeEnabled()
        await this.page.locator(`.project-bulk-edit__save-btn[name="${buttonName}"]`).click()
    }

    async closeBulkEditModal(){
        await this.page.locator("div[class='modal-title__main'] svg g use").click()
    }
    
    async scrollProjectListToTop() {
        await this.page.locator('.list-view__tbody').evaluate(el => {
        el.scrollTo({ top: 0 });
        });
    }


    async openProject(context,projectName){
        const pagePromise = context.waitForEvent('page')
        await this.page.waitForSelector('[data-testid="project-title"]')
        const projectTitle = await this.page.getByTestId('project-title').getByText(projectName)
        await projectTitle.click()
        const newPage = await pagePromise
        await expect(newPage.locator('.project-container__project-title'))
        .toHaveText(new RegExp(projectName))
        return newPage
    }
    async openSection(newPage,sectionTitle){
        await expect(newPage.locator('#sidebar-container')).toBeVisible()
        const sectionLink = newPage.locator(`a[href^="/firm/projects/"][href$="/${sectionTitle}"]`)
        await expect(sectionLink).toBeVisible({timeout:10000})
        await sectionLink.click()
        //await newPage.locator(`a[href^="/firm/projects/"][href$="/${sectionTitle}"]`).click()
    }
}