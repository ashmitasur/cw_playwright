// pages/PeoplePage.js
import { expect } from '@playwright/test';

export class PeoplePage {
  constructor(page) {
    this.page = page;
    this.rightMenu = page.locator("img[alt='MoreMenuIcon']");
    this.addPersonOption = page.locator('[data-testid="addPerson"]');
    this.vcardOption = page.locator('[data-testid="vcard"]');
    this.csvOption = page.locator('[data-testid="csv"]');
    this.resumeOption = page.locator('[data-testid="resume"]');
    this.nameInput = page.getByPlaceholder('Enter name');
    this.emailInput = page.getByPlaceholder('Email Address');
    this.uploadInput = page.locator('.dz-hidden-input');
    this.submitBtn = page.locator('.form-actions__buttons > .pri-button');
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

}
