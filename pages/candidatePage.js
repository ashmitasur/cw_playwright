export class CandidatePage{
    constructor(page){
        this.page = page
        this.exportReportButton = page.locator('a#export_report');
        this.confirmExportButton = page.locator('a.export_report_button:has-text("Generate Report")');
    }

    async exportReport() {
    await this.exportReportButton.click();
    await this.confirmExportButton.click();
    }
}