export class NavigationPage{
    constructor(page){
        this.page = page              
    }
    async goToPage(pageName){
        await this.page.locator(`nav.space-y-1.py-2 a[href="/firm/${pageName}"]`).click() 
    }
}