import { expect } from '@playwright/test';
export class ProjectPage{
    constructor(page){
        this.page = page              
    }

    // Add project
    async clickAddProject() {
        await this.page
        .locator(':nth-child(4) > [tabindex="-1"] > [data-testid="single-select-btn"] > [data-testid="single-select-btn-button"] > img')
        .click();

        await this.page.locator('.add-resource-btn').click();
    }

    async fillProjectForm(projectName, companySearch, location) {
        await this.page.locator('#projectName').fill(projectName);
        await this.selectDropdown('projectType');
        await this.selectDropdown('projectSpecialty');
        await this.selectDropdown('projectSeniority');
        await this.selectDropdown('projectDepartment');

        await this.page.locator('input[name="company"]').fill(companySearch);
        await this.page
        .locator('.companyProfile > :nth-child(3) > [data-testid="single-search-dd"] > [data-testid="single-search-dd-button"]')
        .click();

        await this.page.locator('.search-select__list > :nth-child(2)').click();

        await this.page.locator('#location').fill(location);
    }

    async selectDropdown(buttonId) {
        await this.page.locator(`button[id="${buttonId}"]`).click();
        await this.page.locator('.search-select__list > :nth-child(1)').click();
    }

    async submitForm() {
        await this.page.locator('.form-actions__buttons > .pri-button').click();
    }

    async selectFirstNProjects(count) {
        const checkboxes = this.page.locator('.checkbox-wrapper input[type="checkbox"]');
        const total = await checkboxes.count();

        for (let i = 1; i <= count && i < total; i++) {
        await checkboxes.nth(i).check();
        await expect(checkboxes.nth(i)).toBeChecked();
        }
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
        await expect(newPage.locator('.navigation-sidebar__right__list')).toBeVisible()
        await newPage.locator(`a[title= '${sectionTitle}']`).click()
    }
}