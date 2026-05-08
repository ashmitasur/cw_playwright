import { expect } from '@playwright/test';
export class CandidatePage{
    constructor(page){
        this.page = page
        this.exportReportButton = '#export_report > span';
        this.confirmExportButton = '#export_report_form > .export_report_button';
    }

    async exportReport(newPage) {
    await newPage.locator(this.exportReportButton).click();
    await newPage.locator(this.confirmExportButton).click();
    }
}