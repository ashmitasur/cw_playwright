export class FirmSettingsPage{
    constructor(page){
        this.page = page
        this.collapsedNavMenu = page.locator('button svg.lucide-chevron-right')
        this.cwBranding =  page.locator('button').filter(
            {has: page.locator('title:text-is("logo-clockwork-logomark")')});
        this.firmSettingsMenu = page.locator('a[href="/firm/settings"]')
        this.usersMenu = page.locator('a[title="Users"]');
        this.addUserButton = page.getByTitle('add').filter({hasText: '+ Add User'});
        this.addUserForm = page.locator('form.add-user')
        this.nameInput = page.locator('input#name');
        this.emailInput = page.locator('input#email');
        this.userRoleDropdown = page.locator('#userRole');        
        this.adminRoleOption = page.locator('[role="menuitem"][data-testid="Admin"]');
        this.saveButton = page.locator('.form-actions__buttons > .pri-button');
    }
    async addAdminUser(name, email) {
        await this.collapsedNavMenu.click();
        await this.cwBranding.click();
        await this.firmSettingsMenu.waitFor({state: 'visible'})
        await this.firmSettingsMenu.click();
        await this.page.waitForURL('**/firm/settings');
        await this.usersMenu.click();
        await this.page.waitForURL('**/firm/settings/users');
        await this.addUserButton.click();
        await this.addUserForm.waitFor({state:'visible'})
        await this.nameInput.type(name);
        await this.emailInput.type(email);
        await this.userRoleDropdown.click();
        await this.adminRoleOption.click();
        await this.saveButton.click();
    }
}