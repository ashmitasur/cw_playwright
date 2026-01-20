// pages/PeoplePage.js
import { expect } from '@playwright/test';

export class PeoplePage {
  constructor(page) {
    this.page = page;
    this.rightMenu = page.locator("img[alt='MoreMenuIcon']");
    this.addPersonOption = page.locator('.simple-option-addPerson > a');
    this.vcardOption = page.locator('.simple-option-vcard > a');
    this.csvOption = page.locator('.simple-option-csv > a');
    this.resumeOption = page.locator('.simple-option-resume > a');
    this.nameInput = page.getByPlaceholder('Enter name');
    this.emailInput = page.getByPlaceholder('Email Address');
    this.uploadInput = page.locator('.dz-hidden-input');
    this.submitBtn = page.locator('.form-actions__buttons > .pri-button');
    this.alertMsg = page.locator('.alert-message > p');
  }

  async navigateToPeople() {
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

  async expectAlertContains(text) {
    await expect(this.alertMsg).toContainText(text,{timeout:20000});
  }
}
