import { expect } from '@playwright/test';
export class ProjectGridViewPage{
    constructor(page){
        this.page = page  
        this.addButton = page.locator('button[title="add"]')
        this.quickSearchButton = page.locator('.add-candidates-options__item__text',{hasText:'Quick Search People'})
        this.candidateList = page.locator('.search-candidates__list')
        this.checkboxes = page.locator('ul.search-candidates__list li button[role="checkbox"]')
        this.selectAllCheckboxes = page.locator('[title="Select All / None"]')
        this.ddMenu = page.locator('div[data-slot="dropdown-menu-content"]')
        this.doneButton = page.locator('button.pri-button',{hasText:'Done'})
    }
    async addCandidate(candidateName){
        await this.addButton.click()
        await this.quickSearchButton.click()
        await expect(this.candidateList).toBeVisible()
        const checkboxes = this.checkboxes;
        await expect(checkboxes.first()).toBeVisible();
        const uncheckbox = this.page.locator('ul.search-candidates__list li', {hasText: candidateName})
        .locator('button[role="checkbox"][data-state="unchecked"]');
        await uncheckbox.click();
        await this.page.locator("div[class='modal-title__main'] svg").click()                
    }
    async removeCandidate(){
        await this.selectAllCheckboxes.click()
        const statusDD = this.page.getByRole('button', { name: 'Status' })
        await statusDD.click();
        const visibleMenu = this.page.locator('[role="menu"]:visible');
        await visibleMenu.getByRole('menuitem', { name: 'Remove From Project' }).click();
        await this.doneButton.click()

    }
}