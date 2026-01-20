export class LogInPage{
    constructor(page){
        this.page = page,
        this.emailInput = page.getByRole('textbox', { name: 'email' })
        this.passwordInput = page.getByRole('textbox', { name: 'password' })
        this.submitButton = page.locator('input[type="submit"]')
        this.profileIcon = page.locator('#site_header_user_menu')
        this.logoutButton = page.locator("a[href='/logout']")
        this.firmNameLink = page.locator('[data-testid="firm-redirect-link"]')
    }

    async gotoLoginPage(url){
        await this.page.goto(url)
    }

    async gotoAccountsPage(accountUrl){
        await this.page.goto(accountUrl)
    }


    async login(email,password){
        await this.emailInput.fill(email)
        await this.passwordInput.fill(password)
        await this.submitButton.click()
    }

    async selectFirm(firmname) {
        await this.firmNameLink.filter({ hasText: firmname }).click()
    }

    async logout(){
        await this.profileIcon.click()
        if (await this.logoutButton.isVisible()) {
            await this.logoutButton.click()
        }
    }
}