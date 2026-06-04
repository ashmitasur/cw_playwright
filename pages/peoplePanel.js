import { expect } from '@playwright/test';

export class PeoplePanel {
  constructor(page) {
    this.page = page;
    this.keywordSearchBox = page.locator('#text-search-input');
    this.personInList = page.locator('.people-grid-view__person-name__link');
    this.candidateInProjectCrad = page.locator('.candidate-in-projects');
    this.documentCard = page.locator("#resume-overview-card");
    this.positionCard = page.locator("#position-overview-card");
    this.educationCard = page.locator("#education-overview-card")
    this.clientOnProjectCard = page.locator("#clientOnProjects-overview-card")
    this.dealCard = page.locator('#personDeals-overview-card')
    this.cardExpandCollapseButton = page.locator('.card-view__collapse-button');
    this.collapsedCardAccordian='.card-view__header--collapsed'
    this.addRecordBtnLocator = '.add-record-btn';
    this.uploadInput = page.locator('.dz-hidden-input');
    this.title = page.locator('#title');
    this.documentType = 'div.select-option-floating';
    this.resumeparseCheckbox = page.getByLabel('Parse');
    this.cardAddButton = '[type="submit"]';
  }

  async searchPeople(searchPeopleByEmail){
    // Enter search text and press Enter twice
    await this.keywordSearchBox.first().fill(searchPeopleByEmail);
    await this.keywordSearchBox.first().press('Enter');
    await this.keywordSearchBox.first().press('Enter');

    // Wait for API response
    await this.page.waitForResponse(response =>
      response.url().includes('/spapi/people_list') && response.status() === 200);

    await this.personInList.first().waitFor({ state: 'visible' });
  }
  async openPeoplePanle(searchPeople) {
    const person = this.page.locator('.people-grid-view__person-name__link', {hasText: searchPeople})
    .first();
    //await expect(person).toBeVisible();
    await person.waitFor({ state: 'visible' })
    await person.click();
  }
  async addPeopleToProject(searchToSelectProject){
    const addBtn = this.candidateInProjectCrad.locator(this.addRecordBtnLocator);
    //await expect(addBtn).toBeVisible();
    await addBtn.waitFor({ state: 'visible' });
    await addBtn.click();
    await this.searchNSelect(searchToSelectProject)
    await this.page.locator('[data-testid="filter-dropdown-content-buttons-apply-button"]').click()
  }
  async searchNSelect(searchToSelectProject){
    await this.page.locator('.search-select-multi.relative.search-list-dropdown__search')
      .waitFor({ state: 'visible' });
    await this.page.locator('.search-list-dropdown__search input[type="text"]').fill(searchToSelectProject)
    await this.page.locator('.search-list-dropdown__search').waitFor({ state: 'visible' });
    await this.page.locator('.search-list-dropdown__search > div > ul > li:nth-child(1)').click()
  }
  async uploadResume(filepath,title){
    const addBtn = this.documentCard.locator(this.addRecordBtnLocator);
    await addBtn.waitFor({ state: 'visible' });
    await addBtn.click();
    await this.uploadInput.setInputFiles(filepath)
    await this.title.fill(title)
    await this.documentCard.locator(this.documentType).click()
    await this.singleSelectDD(this.documentCard)
    await this.resumeparseCheckbox.click()
    await this.documentCard.locator(this.cardAddButton).click()
    await this.documentCard.locator(this.cardAddButton).waitFor({ state: 'hidden' });
  }
  async addPosition(positionTitle,companyName){
    const addBtn = this.positionCard.locator(this.addRecordBtnLocator);
    await addBtn.waitFor({ state: 'visible' });
    await addBtn.click();
    await this.page.locator('input[name="title"]').fill(positionTitle)
    await this.page.locator('.company-dd-floating-ui').click()
    await this.page.getByRole("listbox").locator('input').fill(companyName)
    await this.singleSelectDD(this.positionCard) 
    await this.positionCard.locator(this.cardAddButton).click()
    await this.positionCard.locator(this.cardAddButton).waitFor({ state: 'hidden' });
  }
  async addPeopleEducation(degree,schoolName){
    const addBtn = this.educationCard.locator(this.addRecordBtnLocator);
    await addBtn.waitFor({ state: 'visible' });
    await addBtn.click();
    await this.page.locator('input[placeholder="School Name"]').fill(schoolName)
    await this.page.locator('ul li[role="option"]:nth-child(1)').click()
    await this.page.locator('input[name="degree"]').fill(degree)
    await this.educationCard.locator(this.cardAddButton).click()
    await this.educationCard.locator(this.cardAddButton).waitFor({ state: 'hidden' });
  } 
  async singleSelectDD(container){
    await container.locator('.list-items > [role="option"]:nth-child(1)').click()
  }
  async closePeoplePanle(){
    await this.page.locator('[class="side-panel__controls__item close-item"]').click()
  }
  async sendClientInvitation(searchToSelectProject){
    const addBtn = this.clientOnProjectCard.locator(this.addRecordBtnLocator);
    await addBtn.waitFor({ state: 'visible' });
    await addBtn.click();
    await this.clientOnProjectCard.locator("#projectContext").click()
    await this.searchNSelect(searchToSelectProject)
    await this.page.locator('[data-testid="filter-dropdown-content-buttons-apply-button"]').click()
    await this.clientOnProjectCard.locator(this.cardAddButton).waitFor({ state: 'visible' })
    await this.clientOnProjectCard.locator(this.cardAddButton).click()
  }
  async addPeopleToDeal(){
    const addBtn = this.dealCard.locator(this.addRecordBtnLocator);
    await addBtn.waitFor({ state: 'visible' });
    await addBtn.click();
    await this.page.locator('.search-list-dropdown__search > div > ul > li:nth-child(2)').click()
    await this.page.locator('[data-testid="filter-dropdown-content-buttons-apply-button"]').click()
  }
  async deletePeople(){
    await this.page.locator('.secondary-delete-button').click();
    await this.page.locator('input.delete-confirm-dialog__confirmation-input').type('DELETE');
    await this.page.locator('.delete-confirm-btn').click();
  }
}
