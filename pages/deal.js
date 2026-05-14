import { expect } from '@playwright/test';
export class DealPage{
    constructor(page){
        this.page =page
        this.threeDotsMenu = page.locator('button#right-menu')
        this.dealList = page.locator('.new-v2-view');
        this.profileCard = page.locator('[data-key="profile"] > .card-view > div > .card-view__body');
        this.dealSizeInput = page.locator('input[placeholder="Deal Size"]');
        this.saveButton = page.locator('.pri-button');
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
    async selectDealByName(dealName) {
        await this.dealList.filter({ hasText: dealName }).click();
    }
    async updateDealProfile(size){
        await this.profileCard.click();
        await this.dealSizeInput.fill(size);
        await this.saveButton.click()
    }
    async closeDealPanel(){
        await this.page.locator('.side-panel__controls__item.close-item').click()
    }
}