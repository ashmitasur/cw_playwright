// pages/PeoplePage.js
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

}
