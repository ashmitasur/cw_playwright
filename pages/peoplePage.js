import { expect } from '@playwright/test';

export class PeoplePage {
  constructor(page) {
    this.page = page;
    this.rightMenu = page.locator('button#right-menu');
    this.addPersonOption = page.locator('[data-testid="addPerson"]');
    this.vcardOption = page.locator('[data-testid="vcard"]');
    this.csvOption = page.locator('[data-testid="csv"]');
    this.resumeOption = page.locator('[data-testid="resume"]');
    this.nameInput = page.getByPlaceholder('Enter name');
    this.emailInput = page.getByPlaceholder('Email Address');
    this.uploadInput = page.locator('.dz-hidden-input');
    this.submitBtn = page.locator('.form-actions__buttons > .pri-button');
    this.keywordSearchBox = page.locator('#text-search-input');
    this.personInList = page.locator('.people-grid-view__person-name__link');
    this.checkboxes = page.locator('.list-view__tbody button[type="button"]');
    this.addBulkNoteButton = page.locator('button[title="Add Note"]');
    this.addBulkEmailButton = page.locator('button[title="Email"]');
    this.bulkEditButton = page.locator('button[title="Bulk Edit"]');
    this.ckEditor = page.locator('.ck-content[contenteditable="true"]');
    this.saveButton = page.locator('.form-actions__buttons > .pri-button');
    this.emailSubjectInput = page.locator('.mass-mailer-popup-form .input-groups input[name="subject"]')
  }

  async clickOn3Dots() {
    await expect(this.page).toHaveURL(/people/)
    await this.rightMenu.click();
  }

  async openAddPerson() {
    await this.addPersonOption.click();
  }

  async openVcardImport() {
    await this.vcardOption.click();
  }

  async openCsvImport() {
    await this.csvOption.click();
  }

  async openResumeImport() {
    await this.resumeOption.click();
  }

  async fillPersonForm(name, email) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
  }

  async uploadFile(filePath) {
    await this.uploadInput.setInputFiles(filePath);
  }

  async submit() {
    await this.submitBtn.click();
  }

  async exportPeople(){            
    await expect(this.page.locator('[data-testid="export"]')).toBeVisible();
    await this.page.locator('[data-testid="export"]').click();
    await this.page.locator('form.people-export-fields .form-actions__buttons .btn', {hasText: 'Ok'})
          .click()
  }

  async searchPeople(searchPeopleByEmail){
    // Enter search text and press Enter twice
    await this.keywordSearchBox.first().fill(searchPeopleByEmail);
    await this.keywordSearchBox.first().press('Enter');
    await this.keywordSearchBox.first().press('Enter');

    // Wait for API response
    await this.page.waitForResponse(response =>
      response.url().includes('/spapi/people_list') && response.status() === 200);

    await expect(this.personInList.first()).toBeVisible();
  }

  async selectAllPeople() {
    const count = await this.checkboxes.count();
    for (let i = 0; i < count; i++) {
      await this.checkboxes.nth(i).check();
      await expect(this.checkboxes.nth(i)).toBeChecked();
    }
  }

  async addNote(note) {
    await expect(this.addBulkNoteButton).toBeEnabled()
    await this.addBulkNoteButton.click();

    // Handle CKEditor
    await this.ckEditor.click();
    await this.ckEditor.type(note);
    // await this.page.evaluate((note) => {
    //   const el = document.querySelector('.ck-content[contenteditable="true"]');
    //   if (el && el.ckeditorInstance) {
    //     el.ckeditorInstance.setData(note);
    //   }
    // }, note);

    await this.saveButton.click();
  }

  async addEmail(emailSubject,emailContent){
    await expect(this.addBulkEmailButton).toBeEnabled()
    await this.addBulkEmailButton.click();
    await this.emailSubjectInput.fill(emailSubject);
    await this.ckEditor.click();
    await this.ckEditor.type(emailContent);
    await this.saveButton.click();
  }

  async singleSelectDropdown(buttonId) {
      await this.page.locator(`button[id="${buttonId}"]`).click();
      await this.page.locator('[data-slot="dropdown-menu-content"] > :nth-child(1)').click();
  }

  async bulkEdit(){
    await expect(this.bulkEditButton).toBeEnabled()
    await this.bulkEditButton.click();
    await this.singleSelectDropdown('country-add');
    await this.saveButton.click();
  }
  
}
