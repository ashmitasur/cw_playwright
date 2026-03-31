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

    await expect(this.personInList.first()).toBeVisible();
  }

  async openPeoplePanle(searchPeople) {
    const person = this.page.locator('.people-grid-view__person-name__link', {hasText: searchPeople})
    .first();
    await expect(person).toBeVisible();
    await person.click();
  } 

  async addPeopleToProject(searchToSelectProject){
    //const cardCollapsed = this.candidateInProjectCrad.locator(this.collapsedCardAccordian);
    // if(cardCollapsed.count() > 0){
    //     await this.cardExpandCollapseButton.click()
    // }
    const addBtn = this.candidateInProjectCrad.locator(this.addRecordBtnLocator);
    await expect(addBtn).toBeVisible();
    await addBtn.click();
    await this.searchNSelect(searchToSelectProject)
    await this.page.locator('[data-testid="filter-dropdown-content-buttons-apply-button"]').click()
  }

  async searchNSelect(searchToSelectProject){
    await expect(this.page.locator('.search-select-multi.relative.search-list-dropdown__search'))
    .toBeVisible()
    await this.page.locator('.search-list-dropdown__search input[type="text"]').fill(searchToSelectProject)
    await expect(this.page.locator('.search-list-dropdown__search')).toBeVisible()
    await this.page.locator('.search-list-dropdown__search > div > ul > li:nth-child(4)').click()
  }

  async uploadResume(filepath,title){
    // const cardCollapsed = this.documentCard.locator(this.collapsedCardAccordian);
    // if(cardCollapsed.count() > 0){
    //     await this.cardExpandCollapseButton.click()
    // }
    const addBtn = this.documentCard.locator(this.addRecordBtnLocator);
    await expect(addBtn).toBeVisible();
    await addBtn.click();
    await this.uploadInput.setInputFiles(filepath)
    await this.title.fill(title)
    await this.documentCard.locator(this.documentType).click()
    await this.singleSelectDD(this.documentCard)
    await this.resumeparseCheckbox.click()
    await this.documentCard.locator(this.cardAddButton).click()
    await expect(this.documentCard.locator(this.cardAddButton)).toBeDisabled()
  }

  async addPosition(positionTitle,companyName){
    const addBtn = this.positionCard.locator(this.addRecordBtnLocator);
    await expect(addBtn).toBeVisible();
    await addBtn.click();
    await this.page.locator('input[name="title"]').fill(positionTitle)
    await this.page.locator('.company-dd-floating-ui').click()
    await this.page.getByRole("listbox").locator('input').fill(companyName)
    await this.singleSelectDD(this.positionCard) 
    await this.positionCard.locator(this.cardAddButton).click()
    await expect(this.positionCard.locator(this.cardAddButton)).toBeDisabled()
  }

  async addPeopleEducation(degree,schoolName){
    const addBtn = this.educationCard.locator(this.addRecordBtnLocator);
    await expect(addBtn).toBeVisible();
    await addBtn.click();
    await this.page.locator('input[placeholder="School Name"]').fill(schoolName)
    await this.page.locator('ul li[role="option"]:nth-child(1)').click()
    await this.page.locator('input[name="degree"]').fill(degree)
    await this.educationCard.locator(this.cardAddButton).click()
    await expect(this.educationCard.locator(this.cardAddButton)).toBeDisabled()
  }  

  async singleSelectDD(container){
    await container.locator('.list-items > [role="option"]:nth-child(1)').click()
  }

  async closePeoplePanle(){
    await this.page.locator('[class="side-panel__controls__item close-item"]').click()
  }
}
