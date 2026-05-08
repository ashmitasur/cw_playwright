import { expect } from '@playwright/test';

export class ProjectDashboard{
    constructor(page){
        this.page = page
        this.addTeamMember = 'button[title="Add Team Member"]'
        this.addTeamPopUp = '.add-user-popup-content'
        this.ddApplyButton = '[data-testid="filter-dropdown-content-buttons-apply-button"]'
        this.teamMemberGroup = '[data-testid="project-team"]'
        this.eachTeamMember = '[data-testid="project-team"] div.team-card__container'
        this.toolTip = '.tooltip-modal'
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