import { expect } from '@playwright/test';
export class ProjectPage{
    constructor(page){
        this.page = page  
        this.keyWordSearch = page.locator("[class='project-list-view__header-section__keyword-search'] input[id='text-search-input']");
        this.bulkUpdateBtn = page.locator('.project-list-view__bulk-update-btn');  
        this.threeDotsMenu = page.locator('button#right-menu');
        this.addProjectBtn = page.locator('[data-testid="add"]');
        this.exportProjectBtn = page.locator('[data-testid="export"]');
        this.addTeamMember = 'button[title="Add Team Member"]'
        this.addTeamPopUp = '.add-user-popup-content'
        this.ddApplyButton = '[data-testid="filter-dropdown-content-buttons-apply-button"]'
        this.teamMemberGroup = '[data-testid="project-team"]'
        this.eachTeamMember = '[data-testid="project-team"] div.team-card__container'
        this.toolTip = '.tooltip-modal'

    }

    // Add project
    async clickAddProject() {
        await this.threeDotsMenu.click();
        await expect(this.addProjectBtn).toBeVisible();
        await this.addProjectBtn.click();
    }

    async selectDropdown(buttonId) {
        await this.page.locator(`button[id="${buttonId}"]`).click();
        await this.page.locator('.search-select > :nth-child(1)').click();
    }

    async fillProjectForm(projectName, companySearch) {
        await this.page.locator('#projectName').fill(projectName);
        await this.selectDropdown('projectType');
        await this.page.locator('input[name="company"]').fill(companySearch);
        await this.page.locator('ul > li[role="option"] > :nth-child(1)').click()
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

    async exportProject() {
        await this.threeDotsMenu.click();
        await this.page.waitForSelector('[data-slot="dropdown-menu-content"]');
        await expect(this.exportProjectBtn).toBeVisible();
        await this.exportProjectBtn.click();
        await this.page.locator('form.project-list-view__export-form .form-actions__buttons .btn').click()
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

    async downloadProjectDashboardInPdf(newPage){
        await newPage.locator('.project-dashboard__action-bar__download').click();
        await newPage.locator('.dashboard-download-manager__view .radio-button-wrapper__input input[value="Firm View Print"]')
        .check()
        await newPage.locator('.dashboard-download-manager__download  .radio-button-wrapper .radio-button-wrapper__input input[value="PDF"]')
        .check()
        await newPage.locator('.form-actions__buttons > .pri-button').click();
    }

    async downloadProjectDashboardInImage(newPage){
        await newPage.locator('.project-dashboard__action-bar__download').click();
        await newPage.locator('.dashboard-download-manager__view .radio-button-wrapper__input input[value="Firm View Print"]')
        .check()
        await newPage.locator('.dashboard-download-manager__download  .radio-button-wrapper .radio-button-wrapper__input input[value="JPEG"]')
        .check()
        await newPage.locator('.form-actions__buttons > .pri-button').click();
    }

    async searchNSelect(newPage,searchPeople){
        await expect(newPage.locator('.search-select-multi.relative.search-list-dropdown__search'))
        .toBeVisible()
        await newPage.locator('.search-list-dropdown__search input[type="text"]').fill(searchPeople)
        await expect(newPage.locator('.search-list-dropdown__search')).toBeVisible()
        await newPage.locator('.search-list-dropdown__search > div > ul > li:nth-child(1)').click()
    }

    async addTeam(newPage,searchPeople){
        await newPage.locator(this.addTeamMember).click()
        await expect(newPage.locator(this.addTeamPopUp)).toBeVisible()
        await this.searchNSelect(newPage,searchPeople)
        const members = newPage.locator(this.eachTeamMember);
        // capture count before
        const initialCount = await members.count();
        await newPage.locator(this.ddApplyButton).click();
        // wait until count increases
        await expect(members).toHaveCount(initialCount + 1);
        await newPage.locator(this.eachTeamMember).last().hover()
        await expect(newPage.locator(this.toolTip)).toBeVisible();
        await expect(newPage.locator(this.toolTip).getByText(searchPeople)).toBeVisible();
    }

    async deleteTeam(newPage){
        await newPage.locator(this.eachTeamMember).last().hover()
        await expect(newPage.locator(this.toolTip)).toBeVisible();
        await newPage.locator('.remove-icon').click();
        await newPage.locator('.delete-button').click();
    }
    
}