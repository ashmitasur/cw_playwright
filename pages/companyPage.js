import { expect } from '@playwright/test';
export class CompanyPage{
    constructor(page){
        this.page =page
        this.threeDotsMenu = page.locator('button#right-menu')
        this.addCompanybtn = page.locator('[data-testid="add"]')
        this.formAddBtn = page.locator('.form-actions__buttons > button.pri-button')
        this.exportCompanyBtn = page.locator('[data-testid="export"]')
        this.companyList = page.locator('.company-view__company-name--link')
        this.notePanleOpenBtn = page.locator('[data-testid="note-text"]');
        this.addNoteBtn = page.locator('.company-notes-list__add');
        this.ckEditor = page.locator('.ck-content[contenteditable="true"]');
        this.saveButton = page.locator('.pri-button');
        this.noteActionMenu = page.locator('button[id$="_companyNotes"]').first()
        this.notePanelDdMenu = page.locator('[data-slot="dropdown-menu-content"]')
        this.editOption = page.locator('[data-testid="edit"]');
        this.replyOption = page.locator('[data-testid="reply"]');
        this.deleteOption = page.locator('[data-testid="delete"]');
        this.deleteDialog = page.getByRole('alertdialog');
        this.searchInput = page.locator('.companies__header input#text-search-input');    
        this.mergeBtn = page.locator('[title="Merge"]');
        this.checkboxes = page.locator('.list-view__tbody button[role="checkbox"]')  
        this.addDocumentBtn = page.getByRole('button', {name: '+ Add Document'});
        this.getDocumentList = page.locator('ul.document-card > li:nth-child(1)');
        this.docDeleteBtn = page.getByTestId('active-form').getByRole('button', {name: 'Delete'});
        this.addBoardMemberBtn = page.getByRole('button', {name: '+ Add Board Member'});
        this.boardMemberNameInput = page.locator('input[placeholder="Board Member Name"]')
        this.selectMemberDD = page.locator('.input-groups ul li').first()
        this.startMonth = page.locator('#startMonth');
        this.startYear = page.locator('#startYear');
        this.firstElement = page.locator('[role="menuitem"]').first();
        this.companyProfilecard = page.locator('[data-testid="companyProfile"]')
    }
    async addCompany(companyName,companySubtitle) {
        await this.threeDotsMenu.click();
        await this.addCompanybtn.waitFor({ state: 'visible' });
        await this.addCompanybtn.click();
        await this.page.locator("input[placeholder='Company Name']").fill(companyName)
        await this.page.locator("input[placeholder='Subtitle']").fill(companySubtitle)
        await this.selectDropdown('preferredIndustryDropdown')
        await this.formAddBtn.waitFor({ state: 'visible' });
        await this.formAddBtn.click();
    }
    async selectDropdown(buttonId) {
        await this.page.locator(`button[id="${buttonId}"]`).click();
        await this.page.locator('.search-select ul li').nth(1).click();
    }
    async searchSelectDropdown(buttonId) {
        await this.page.locator(`button[id="${buttonId}"]`).click();
        await this.page.locator('.search-select-multi ul li').nth(1).click();
    }
    async exportCompany(){
        await this.threeDotsMenu.click()
        await this.page.getByRole("menu").waitFor({ state: 'visible' });
        await this.exportCompanyBtn.click()
        await this.formAddBtn.click()
    }
    async mergeCompany(companyName){
        await this.searchInput.fill(companyName);
        await this.searchInput.press('Enter');
        await this.searchInput.press('Enter');
        await this.page.waitForSelector('.list-view__tbody button[role="checkbox"]')
        const count = await this.checkboxes.count();
        for (let i = 0; i < count; i++) {
            await this.checkboxes.nth(i).click();
        }
        await this.mergeBtn.click();
        await this.saveButton.click();    
    }
    async selectCompanyByName(companyName) {
        await this.companyList.filter({ hasText: companyName }).click();
    }
    async addCompanyDoc(filepath){
        await this.addDocumentBtn.click()
        const fileChooserPromise = this.page.waitForEvent('filechooser')
        // click the dropzone
        await this.page.locator('.dz-message').click()
        const fileChooser = await fileChooserPromise
        await fileChooser.setFiles(filepath)
        await this.formAddBtn.click()
    }
    async deleteCompanyDoc(){
        await this.getDocumentList.click()        
        await this.docDeleteBtn.click()
        await this.deleteDialog.locator('.delete-confirm-btn').click();
    }
    async updateProfile(companySubtitle){
        await this.companyProfilecard.click()
        await this.page.locator("input[placeholder='Subtitle']").fill(companySubtitle+' updated')
        await this.selectDropdown('preferredIndustryDropdown')
        await this.searchSelectDropdown('investors-dropdown')
        await this.page.locator('[data-testid="filter-dropdown-content-buttons-apply-button"]')
        .getByText('Apply').click()
        await this.selectDropdown('fundingStageDropdown')
        await this.saveButton.click()
    }
    async openNotePanle(){
        await this.notePanleOpenBtn.click()
    }
    async addNote(note) {
        await this.addNoteBtn.click();
        await this.ckEditor.click();
        await this.ckEditor.type(note);
        await this.saveButton.click();
    }
    async editNote(note) {
        await this.noteActionMenu.click();
        await this.notePanelDdMenu.waitFor({ state: 'visible' });
        await this.editOption.click();
        await this.ckEditor.click();
        await this.ckEditor.type(note+"edited");
        await this.saveButton.click();
        await this.ckEditor.waitFor({ state: 'hidden' });
    }
    async replyToNote(note) {
        await this.noteActionMenu.click();
        await this.notePanelDdMenu.waitFor({ state: 'visible' });
        await this.replyOption.click();
        await this.ckEditor.click();
        await this.ckEditor.type(note+"reply");
        await this.saveButton.click();
    }
    async deleteNote() {
        await this.noteActionMenu.click();
        await this.notePanelDdMenu.waitFor({ state: 'visible' });
        await this.deleteOption.click();
        await this.deleteDialog.locator('.delete-confirm-btn').click();
    }
    async addBoardMember(personName){
        await this.addBoardMemberBtn.click()
        await this.boardMemberNameInput.fill(personName)
        await this.startMonth.click()
        await this.firstElement.click()
        await this.startYear.click()
        await this.firstElement.click()
        await this.saveButton.click()

    }
}