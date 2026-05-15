import { expect } from '@playwright/test';
export class CandidatePage{
    constructor(page){
        this.page = page
        this.exportReportButton = 'a#export_report';
        this.confirmExportButton = 'a.export_report_button:has-text("Generate Report")';
    }

    async exportReport(newPage) {
    await newPage.locator(this.exportReportButton).click();
    await newPage.locator(this.confirmExportButton).click();
    }
}