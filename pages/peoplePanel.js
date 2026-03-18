import { expect } from '@playwright/test';

export class PeoplePanel {
  constructor(page) {
    this.page = page;
    this.keywordSearchBox = page.locator('#text-search-input');
    this.personInList = page.locator('.people-grid-view__person-name__link');
    this.candidateInProjectCrad = page.locator('.candidate-in-projects');
    this.cardExpandCollapseButton = page.locator('.card-view__collapse-button');
    this.collapsedCardAccordian='.card-view__header--collapsed'
    this.addRecordBtnLocator = '.add-record-btn';

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
    const cardCollapsed = this.candidateInProjectCrad.locator(this.collapsedCardAccordian);
    if(cardCollapsed.count() > 0){
        await this.cardExpandCollapseButton.click()
    }
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
  async closePeoplePanle(){
    await this.page.locator('[class="side-panel__controls__item close-item"]').click()
  }
}
