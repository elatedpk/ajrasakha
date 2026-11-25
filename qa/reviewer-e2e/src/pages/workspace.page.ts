import { expect, type Page } from "@playwright/test";

export class WorkspacePage {
  constructor(private readonly page: Page) {}

  async openHome(): Promise<void> {
    await this.page.goto("/home");
    await expect(this.page).toHaveURL(/\/home\/?(?:\?.*)?$/);
  }

  async openTab(name: string): Promise<void> {
    await this.page.getByRole("tab", { name, exact: true }).click();
  }

  async openNotifications(): Promise<void> {
    await this.page.getByRole("button", { name: /notifications/i }).click();
  }
}
