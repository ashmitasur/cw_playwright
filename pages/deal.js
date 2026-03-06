import { expect } from '@playwright/test';
export class DealPage{
    constructor(page){
        this.page =page
        this.threeDotsMenu = page.locator('button#right-menu')
    }
    async clickAddDeal() {
        await this.threeDotsMenu.click();
        await expect(this.page.locator('[data-testid="add"]')).toBeVisible();
        await this.page.locator('[data-testid="add"]').click();
    }
    async fillDealForm(dealName,dealCompany){
        await this.page.locator("#name").fill(dealName)
        await this.page.locator('input[name="company"]').fill(dealCompany);
        await this.selectDropdown('Deal Status')
        await this.selectDropdown('Deal Stage')
    }
    async selectDropdown(buttonId) {
        await this.page.locator(`button[aria-label="${buttonId}"]`).click();
        await this.page.getByRole('menuitem').nth(0).click()
    }
    async submitAddDealForm() {
        await expect(this.page.locator('.form-actions__buttons > .pri-button')).toBeEnabled()
        await this.page.locator('.form-actions__buttons > .pri-button').click();
    }
}