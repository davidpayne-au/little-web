import { expect, test } from "@playwright/test";

test.describe("Cricket page", () => {
	test("navigates to cricket page and shows content", async ({ page }) => {
		await page.goto("");
		const cricketButton = page.getByRole("button", { name: "Cricket in Australia" });
		await expect(cricketButton).toBeVisible();
		await cricketButton.click();
		await expect(page.getByRole("heading", { name: "Cricket in Australia" })).toBeVisible();
	});

	test("navigates back to weather page", async ({ page }) => {
		await page.goto("");
		const cricketButton = page.getByRole("button", { name: "Cricket in Australia" });
		await expect(cricketButton).toBeVisible();
		await cricketButton.click();
		const weatherButton = page.getByRole("button", { name: "Weather" });
		await expect(weatherButton).toBeVisible();
		await weatherButton.click();
		await expect(page.getByRole("heading", { name: "Enter a location name" })).toBeVisible();
	});
});
