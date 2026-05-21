import { expect } from '@playwright/test';

export class ProjectDashboard{
    constructor(page){
        this.page = page
        this.addTeamMember = page.locator('button[title="Add Team Member"]')
        this.addTeamPopUp = page.locator('.add-user-popup-content')
        this.ddApplyButton = page.locator('[data-testid="filter-dropdown-content-buttons-apply-button"]')
        this.teamMemberGroup = page.locator('[data-testid="project-team"]')
        this.eachTeamMember = page.locator('[data-testid="project-team"] div.team-card__container')
        this.toolTip = page.locator('.tooltip-modal')
    }
    async downloadProjectDashboardInPdf(){
        await this.page.locator('.project-dashboard__action-bar__download').click();
        await this.page.locator('.dashboard-download-manager__view .radio-button-wrapper__input input[value="Firm View Print"]')
        .check()
        await this.page.locator('.dashboard-download-manager__download  .radio-button-wrapper .radio-button-wrapper__input input[value="PDF"]')
        .check()
        await this.page.locator('.form-actions__buttons > .pri-button').click();
    }
    async downloadProjectDashboardInImage(){
        await this.page.locator('.project-dashboard__action-bar__download').click();
        await this.page.locator('.dashboard-download-manager__view .radio-button-wrapper__input input[value="Firm View Print"]')
        .check()
        await this.page.locator('.dashboard-download-manager__download  .radio-button-wrapper .radio-button-wrapper__input input[value="JPEG"]')
        .check()
        await this.page.locator('.form-actions__buttons > .pri-button').click();
    }
    async searchNSelect(searchPeople){
        await expect(this.page.locator('.search-select-multi.relative.search-list-dropdown__search'))
        .toBeVisible()
        await this.page.locator('.search-list-dropdown__search input[type="text"]').fill(searchPeople)
        await expect(this.page.locator('.search-list-dropdown__search')).toBeVisible()
        await this.page.locator('.search-list-dropdown__search > div > ul > li:nth-child(1)').click()
    }
    async addTeam(searchPeople){
        await this.addTeamMember.click()
        await expect(this.addTeamPopUp).toBeVisible()
        await this.searchNSelect(searchPeople)
        const members = this.eachTeamMember;
        // capture count before
        const initialCount = await members.count();
        await this.ddApplyButton.click();
        // wait until count increases
        await expect(members).toHaveCount(initialCount + 1);
        await this.eachTeamMember.last().hover()
        await expect(this.toolTip).toBeVisible();
        await expect(this.toolTip.getByText(searchPeople)).toBeVisible();
    }
    async deleteTeam(){
        await this.eachTeamMember.last().hover()
        await expect(this.toolTip).toBeVisible();
        await this.page.locator('.remove-icon').click();
        await this.page.locator('.delete-button').click();
    }
}