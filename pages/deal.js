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
        this.multiSelectListFirstItem = page.locator('.list-items > button:nth-child(1)');
        this.addTargetTeamBtn = page.getByRole('button', {name: '+ Add Team'});
        this.addTargetPeopleBtn = page.getByRole('button', {name: '+ Add Target People'});
        this.targetPeopleDdItem = page.locator('.search-select-multi ul li:nth-child(1)')        
        this.addDocumentBtn = page.getByRole('button', {name: '+ Add Document'});
        this.getDocumentList = page.locator('ul.document-card > li:nth-child(1)');
        this.docDeleteBtn = page.getByTestId('active-form').getByRole('button', {name: 'Delete'});
        this.deleteDialog = page.getByRole('alertdialog')
        this.ckEditor = page.locator('.ck-content[contenteditable="true"]');
        this.addNoteBtn = page.locator('.deal-notes-list__add');
        this.noteActionMenu = page.locator('button[id$="_dealNotes"]').first()
        this.ddMenu = page.locator('[data-slot="dropdown-menu-content"]')
        this.editOption = page.locator('[data-testid="edit"]');
        this.replyOption = page.locator('[data-testid="reply"]');
        this.deleteOption = page.locator('[data-testid="delete"]');
        this.notePanleBtn = page.locator('[data-testid="note-text"]');
        this.addProjectBtn = page.locator('.deal-project__add-action');
        this.editProjectOption = page.locator('.value-with-info__value').first()
        this.deleteProjectBtn = page.locator('.deal-header-form a.secondary-delete-button')
        
    }
    async selectDropdown(buttonId) {
        await this.page.locator(`button[aria-label="${buttonId}"]`).click();
        await this.page.getByRole('menuitem').nth(0).click()
    }
    async searchNSelectDD(buttonId) {
        await this.page.locator(`button[id="${buttonId}"]`).click();
        await this.page.locator('ul li[role="option"]').nth(1).click()
    }
    async addDeal(dealName,dealCompany){
        await this.threeDotsMenu.click();
        await expect(this.addDealBtn).toBeVisible();
        await this.addDealBtn.click();
        await this.page.locator("#name").fill(dealName)
        await this.page.locator('input[name="company"]').fill(dealCompany);
        await this.selectDropdown('Deal Status')
        await this.selectDropdown('Deal Stage')
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
    async addTeam(){
       await this.addTargetTeamBtn.click()
       await this.multiSelectListFirstItem.click()
       await this.saveButton.click()
    }
    async addTargetPeople(){
        await this.addTargetPeopleBtn.click()
        await this.targetPeopleDdItem.click()
        await this.page.getByRole("button",{name:"Apply"}).click()
    }
    async addDealDoc(filepath){
        await this.addDocumentBtn.click()
        const fileChooserPromise = this.page.waitForEvent('filechooser')
        // click the dropzone
        await this.page.locator('.dz-message').click()
        const fileChooser = await fileChooserPromise
        await fileChooser.setFiles(filepath)
        await this.formBtn.click()
    }
    async deleteDealDoc(){
        await this.getDocumentList.click()        
        await this.docDeleteBtn.click()
        await expect(this.deleteDialog).toBeVisible();
        await expect(this.deleteDialog).toContainText('Delete Document');
        await this.deleteDialog.locator('.delete-confirm-btn').click();
    }
    async closeDealPanel(){
        await this.page.locator('.side-panel__controls__item.close-item').click()
    }
    async openNotePanle(){
        await this.notePanleBtn.click()
    }
    async addNote(note) {
        await this.addNoteBtn.click();
        await this.ckEditor.click();
        await this.ckEditor.type(note);
        await this.saveButton.click();
    }
    async editNote(note) {
        await this.noteActionMenu.click();
        await expect(this.ddMenu).toBeVisible()
        await this.editOption.click();
        await this.ckEditor.click();
        await this.ckEditor.type(note+"edited");
        await this.saveButton.click();
        await expect(this.ckEditor).not.toBeVisible();
    }
    async replyToNote(note) {
        await this.noteActionMenu.click();
        await expect(this.ddMenu).toBeVisible()
        await this.replyOption.click();
        await this.ckEditor.click();
        await this.ckEditor.type(note+"reply");
        await this.saveButton.click();
    }
     async deleteNote() {
        await this.noteActionMenu.click();
        await expect(this.ddMenu).toBeVisible()
        await this.deleteOption.click();
        await expect(this.deleteDialog).toBeVisible();
        await this.deleteDialog.locator('.delete-confirm-btn').click();
    }
    async addProjectToDeal() {
        await this.addProjectBtn.click();
        await this.searchNSelectDD('project')
        await this.saveButton.click();
    }
    async deleteProjectFromDeal(){
        await this.editProjectOption.click()
        await this.deleteProjectBtn.click()
    }

}