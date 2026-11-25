import { expect, type Page } from "@playwright/test";

export class AuthPage {
  constructor(private readonly page: Page) {}

  async open(): Promise<void> {
    await this.page.goto("/auth");
    await expect(this.page.getByLabel("Email Address")).toBeVisible();
    await expect(this.page.getByLabel("Password", { exact: true })).toBeVisible();
  }

  async login(email: string, password: string): Promise<void> {
    await this.open();
    await this.page.getByLabel("Email Address").fill(email);
    await this.page.getByLabel("Password", { exact: true }).fill(password);
    await this.page.getByRole("button", { name: "Sign In" }).click();
    await expect(this.page).toHaveURL(/\/(home|pae-expert)\/?(?:\?.*)?$/);
  }
}
