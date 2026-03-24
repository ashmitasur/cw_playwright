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
    this.addNoteButton = page.locator('button[title="Add Note"]');
    this.ckEditor = page.locator('.ck-content[contenteditable="true"]');
    this.saveButton = page.locator('.form-actions__buttons > .pri-button');
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
    await expect(this.addNoteButton).toBeEnabled()
    await this.addNoteButton.click();

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

  async openPeoplePanle(searchPeople) {
    const person = this.page.locator('.people-grid-view__person-name__link', {hasText: searchPeople})
    .first();
    await expect(person).toBeVisible();
    await person.click();
  } 
  async closePeoplePanle(){
    await this.page.locator('[class="side-panel__controls__item close-item"]').click()
  }
}
