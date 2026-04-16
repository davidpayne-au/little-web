import AxeBuilder from "@axe-core/playwright";
import { expect, test, type Page } from "@playwright/test";
import { mockWeatherError, mockWeatherSuccess } from "./fixtures/weatherApi";

async function expectNoA11yViolations(page: Page) {
	const results = await new AxeBuilder({ page }).analyze();
	expect(results.violations).toEqual([]);
}

test.describe("Accessibility", () => {
	test("has no axe violations on initial render", async ({ page }) => {
		await page.goto("");
		await expectNoA11yViolations(page);
	});

	test("has no axe violations for success state", async ({ page }) => {
		await mockWeatherSuccess(page);
		await page.goto("");
		await page.getByRole("button", { name: "Search" }).click();
		await expect(page.getByRole("region", { name: "Weather data" })).toBeVisible();
		await expectNoA11yViolations(page);
	});

	test("has no axe violations for error state", async ({ page }) => {
		await mockWeatherError(page, 500);
		await page.goto("");
		await page.getByRole("button", { name: "Search" }).click();
		await expect(page.getByRole("alert")).toBeVisible();
		await expectNoA11yViolations(page);
	});

	test("supports keyboard navigation to core controls", async ({ page }) => {
		await page.goto("");

		await page.keyboard.press("Tab");
		await expect(page.getByRole("link", { name: "Skip to main content" })).toBeFocused();
		await page.keyboard.press("Enter");
		await expect(page).toHaveURL(/#main-content$/);

		await page.keyboard.press("Tab");
		await expect(page.getByRole("textbox", { name: "Location name" })).toBeFocused();
		await page.keyboard.press("Tab");
		await expect(page.getByRole("button", { name: "Search" })).toBeFocused();
	});
});
