export class NavigationPage{
    constructor(page){
        this.page = page              
    }
    async goToPage(pageName){
        await this.page.locator(`.sidebar__section li a[title="${pageName}"]`).click()
    }
}