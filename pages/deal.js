import { expect } from '@playwright/test';
export class DealPage{
    constructor(page){
        this.page =page
        this.threeDotsMenu = page.locator('button#right-menu')
        this.addDealBtn = page.locator('[data-testid="add"]')
        this.formBtn = page.locator('.form-actions__buttons > .pri-button')
        this.exportDealBtn = page.locator('[data-testid="export"]')
        this.dealList = page.locator('.new-v2-view');
        this.profileCard = page.locator('[data-key="profile"] > .card-view > div > .card-view__body');
        this.dealSizeInput = page.locator('input[placeholder="Deal Size"]');
        this.saveButton = page.locator('.pri-button');
        this.dealDatesContainer = page.locator('.deal-dates__container__body');
        this.activationDateInput = page.locator('#activationDate');
        this.addTargetCompaniesBtn = page.getByRole('button', {name: '+ Add Target Companies'});
        this.companyListFirstItem = page.locator('.list-items > button:nth-child(1)');
    }
    async clickAddDeal() {
        await this.threeDotsMenu.click();
        await expect(this.addDealBtn).toBeVisible();
        await this.addDealBtn.click();
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
        await expect(this.formBtn).toBeEnabled()
        await this.formBtn.click();
    }
    async exportDeal(){
        await this.threeDotsMenu.click()
        await this.exportDealBtn.click()
        await this.formBtn.click()
    }
    async selectDealByName(dealName) {
        await this.dealList.filter({ hasText: dealName }).click();
    }
    async updateDealProfile(size){
        await this.profileCard.click();
        await this.dealSizeInput.fill(size);
        await this.saveButton.click()
    }
    async updateDealdate(date){
        await this.dealDatesContainer.click();
        await this.activationDateInput.fill(date)
        await this.saveButton.click()
    }
    async addDealCompanies(){
       await this.addTargetCompaniesBtn.click()
       await this.companyListFirstItem.click()
       await this.saveButton.click()
    }
    async closeDealPanel(){
        await this.page.locator('.side-panel__controls__item.close-item').click()
    }
}