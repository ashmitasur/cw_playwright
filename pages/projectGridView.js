import { expect } from '@playwright/test';
export class ProjectGridViewPage{
    constructor(page){
        this.page = page  
        this.addButton = 'button[title="add"]'
        this.quickSearchButton = '.add-candidates-options__item__text'
        this.candidateList = '.search-candidates__list'
        this.checkboxes = 'ul.search-candidates__list li button[role="checkbox"]'
        this.selectAllCheckboxes = '[title="Select All / None"]'
        this.ddMenu ='div[data-slot="dropdown-menu-content"]'
        this.doneButton = 'button.pri-button'
    }
    async addCandidate(newPage,candidateName){
        await newPage.locator(this.addButton).click()
        await newPage.locator(this.quickSearchButton,{hasText:'Quick Search People'}).click()
        await expect(newPage.locator(this.candidateList)).toBeVisible()
        const checkboxes = newPage.locator(this.checkboxes);
        await expect(checkboxes.first()).toBeVisible();
        const uncheckbox = newPage.locator('ul.search-candidates__list li', {hasText: candidateName})
        .locator('button[role="checkbox"][data-state="unchecked"]');
        await uncheckbox.click();
        await newPage.locator("div[class='modal-title__main'] svg").click()                
    }

    async removeCandidate(newPage){
        await newPage.locator(this.selectAllCheckboxes).click()
        const statusDD = newPage.getByRole('button', { name: 'Status' })
        await statusDD.click();
        const visibleMenu = newPage.locator('[role="menu"]:visible');
        await visibleMenu.getByRole('menuitem', { name: 'Remove From Project' }).click();
        await newPage.locator(this.doneButton,{hasText:'Done'}).click()

    }

}