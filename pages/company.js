import { expect } from '@playwright/test';
export class CompanyPage{
    constructor(page){
        this.page =page
        this.threeDotsMenu = page.locator('button#right-menu')
    }
    async clickAddCompany() {
        await this.threeDotsMenu.click();
        await expect(this.page.locator('[data-testid="add"]')).toBeVisible();
        await this.page.locator('[data-testid="add"]').click();
    }
    async fillCompanyForm(companyName,companySubtitle){
        await this.page.locator("input[placeholder='Company Name']").fill(companyName)
        await this.page.locator("input[placeholder='Subtitle']").fill(companySubtitle)
        await this.selectDropdown('preferredIndustryDropdown')


    }
    async selectDropdown(buttonId) {
        await this.page.locator(`button[id="${buttonId}"]`).click();
        await this.page.locator('.search-select ul li').nth(0).click();
    }
    async submitAddCompanyForm() {
        await expect(this.page.locator('.form-actions__buttons > .pri-button')).toBeEnabled()
        await this.page.locator('.form-actions__buttons > .pri-button').click();
    }
}