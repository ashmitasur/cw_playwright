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
    }
    async addCompany(companyName,companySubtitle) {
        await this.threeDotsMenu.click();
        await expect(this.addCompanybtn).toBeVisible();
        await this.addCompanybtn.click();
        await this.page.locator("input[placeholder='Company Name']").fill(companyName)
        await this.page.locator("input[placeholder='Subtitle']").fill(companySubtitle)
        await this.selectDropdown('preferredIndustryDropdown')
        await expect(this.formAddBtn).toBeEnabled()
        await this.formAddBtn.click();
    }
    async selectDropdown(buttonId) {
        await this.page.locator(`button[id="${buttonId}"]`).click();
        await this.page.locator('.search-select ul li').nth(0).click();
    }
    async exportCompany(){
        await this.threeDotsMenu.click()
        await expect(this.page.getByRole("menu")).toBeVisible()
        await this.exportCompanyBtn.click()
        await this.formAddBtn.click()
    }
    async mergeCompany(companyName){
        await this.searchInput.fill(companyName);
        await this.searchInput.press('Enter');
        await this.searchInput.press('Enter');
        await this.page.waitForSelector('.list-view__tbody button[role="checkbox"]')
        const count = await this.checkboxes.count();
        console.log(count)
        for (let i = 0; i < count; i++) {
            await this.checkboxes.nth(i).click();
            await expect(this.checkboxes.nth(i)).toBeChecked()
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
        await expect(this.deleteDialog).toBeVisible();
        await expect(this.deleteDialog).toContainText('Delete Document');
        await this.deleteDialog.locator('.delete-confirm-btn').click();
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
        await expect(this.notePanelDdMenu).toBeVisible()
        await this.editOption.click();
        await this.ckEditor.click();
        await this.ckEditor.type(note+"edited");
        await this.saveButton.click();
        await expect(this.ckEditor).not.toBeVisible();
    }
    async replyToNote(note) {
        await this.noteActionMenu.click();
        await expect(this.notePanelDdMenu).toBeVisible()
        await this.replyOption.click();
        await this.ckEditor.click();
        await this.ckEditor.type(note+"reply");
        await this.saveButton.click();
    }
     async deleteNote() {
        await this.noteActionMenu.click();
        await expect(this.notePanelDdMenu).toBeVisible()
        await this.deleteOption.click();
        await expect(this.deleteDialog).toBeVisible();
        await this.deleteDialog.locator('.delete-confirm-btn').click();
    }
}