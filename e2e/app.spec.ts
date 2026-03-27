import { expect, test, type Page } from "@playwright/test";
import JSZip from "jszip";
import { PNG } from "pngjs";

const EXPECTED_BUNDLE_FILES = [
	"favicon.ico",
	"favicon-16x16.png",
	"favicon-32x32.png",
	"apple-touch-icon.png",
	"apple-touch-icon-120x120.png",
	"apple-touch-icon-152x152.png",
	"apple-touch-icon-167x167.png",
	"apple-touch-icon-180x180.png",
	"icon-192x192.png",
	"icon-512x512.png",
	"icon-maskable-192x192.png",
	"icon-maskable-512x512.png",
	"site.webmanifest",
	"favicon-tags.html",
] as const;

function parseIcoEntries(buffer: Uint8Array) {
	const view = new DataView(buffer.buffer, buffer.byteOffset, buffer.byteLength);
	const count = view.getUint16(4, true);

	return Array.from({ length: count }, (_, index) => {
		const offset = 6 + index * 16;

		return {
			size: view.getUint8(offset) || 256,
			length: view.getUint32(offset + 8, true),
			dataOffset: view.getUint32(offset + 12, true),
		};
	});
}

function getPixel(
	png: PNG,
	x: number,
	y: number
) {
	const index = (png.width * y + x) * 4;
	return Array.from(png.data.slice(index, index + 4));
}

async function waitForPendingDownloadState(page: Page) {
	await page.evaluate(() => {
		const windowWithTracking = window as typeof window & {
			__downloadPendingObserver?: MutationObserver;
			__sawPendingDownloadState?: boolean;
		};
		const sawPendingDownloadState = () => {
			return Array.from(document.querySelectorAll("button")).some((button) => {
				return (
					button.textContent?.includes("Preparing...") &&
					button.getAttribute("aria-busy") === "true" &&
					button instanceof HTMLButtonElement &&
					button.disabled
				);
			});
		};

		windowWithTracking.__downloadPendingObserver?.disconnect();
		windowWithTracking.__sawPendingDownloadState = sawPendingDownloadState();

		if (windowWithTracking.__sawPendingDownloadState) {
			return;
		}

		const observer = new MutationObserver(() => {
			if (!sawPendingDownloadState()) {
				return;
			}

			windowWithTracking.__sawPendingDownloadState = true;
			observer.disconnect();
		});

		observer.observe(document.body, {
			subtree: true,
			childList: true,
			characterData: true,
			attributes: true,
			attributeFilter: ["aria-busy", "disabled"],
		});

		windowWithTracking.__downloadPendingObserver = observer;
	});
}

async function waitForIdleDownloadState(page: Page) {
	await page.waitForFunction(() => {
		return Array.from(document.querySelectorAll("button")).some((button) => {
			return (
				button.textContent?.includes("Download") &&
				button.getAttribute("aria-busy") === "false" &&
				button instanceof HTMLButtonElement &&
				!button.disabled
			);
		});
	});

	const sawPendingDownloadState = await page.evaluate(() => {
		const windowWithTracking = window as typeof window & {
			__downloadPendingObserver?: MutationObserver;
			__sawPendingDownloadState?: boolean;
		};

		windowWithTracking.__downloadPendingObserver?.disconnect();
		return windowWithTracking.__sawPendingDownloadState === true;
	});

	expect(sawPendingDownloadState).toBe(true);
}

test("editor metadata linking behaves deterministically", async ({ page }) => {
	await page.goto("/");

	const textInput = page.getByLabel("Enter Text");
	const appNameInput = page.getByLabel("App name");
	const shortNameInput = page.getByLabel("Short name");

	await expect(textInput).toHaveValue("ico");
	await expect(appNameInput).toHaveValue("ico");
	await expect(shortNameInput).toHaveValue("ico");

	await textInput.fill("mk");
	await expect(appNameInput).toHaveValue("mk");
	await expect(shortNameInput).toHaveValue("mk");

	await shortNameInput.fill("mini");
	await textInput.fill("brand");
	await expect(appNameInput).toHaveValue("brand");
	await expect(shortNameInput).toHaveValue("mini");

	await appNameInput.fill("studio");
	await textInput.fill("logo");
	await expect(appNameInput).toHaveValue("studio");
	await expect(shortNameInput).toHaveValue("mini");
});

test("download generates one archive with the expected artifacts", async ({
	page,
}) => {
	await page.addInitScript(() => {
		const originalToBlob = HTMLCanvasElement.prototype.toBlob;

		HTMLCanvasElement.prototype.toBlob = function (...args) {
			const [callback, type, quality] = args;

			setTimeout(() => {
				originalToBlob.call(this, callback, type, quality);
			}, 150);
		};
	});
	await page.goto("/");

	await page.getByLabel("Enter Text").fill("");
	await page.getByLabel("App name").fill("Pixel App");
	await page.getByLabel("Short name").fill("Px");
	await page.getByRole("slider", { name: "Border radius" }).focus();
	await page.keyboard.press("Home");
	await page.getByLabel("Border color").fill("#ff0000ff");
	await page.getByLabel("Background color").fill("#00ff00ff");

	const downloadButton = page.getByRole("button", { name: "Download" });
	const downloads: string[] = [];
	page.on("download", (download) => {
		downloads.push(download.suggestedFilename());
	});

	await waitForPendingDownloadState(page);
	const downloadPromise = page.waitForEvent("download");
	await downloadButton.dblclick();
	const download = await downloadPromise;
	await waitForIdleDownloadState(page);

	expect(download.suggestedFilename()).toBe("favicons.zip");
	expect(downloads).toEqual(["favicons.zip"]);

	const archive = await download.createReadStream();
	const chunks: Uint8Array[] = [];
	for await (const chunk of archive!) {
		chunks.push(chunk);
	}
	const zip = await JSZip.loadAsync(Buffer.concat(chunks));
	const fileNames = Object.keys(zip.files);

	expect(new Set(fileNames)).toEqual(new Set(EXPECTED_BUNDLE_FILES));

	const manifest = JSON.parse(
		await zip.file("site.webmanifest")!.async("string")
	);
	expect(manifest.name).toBe("Pixel App");
	expect(manifest.short_name).toBe("Px");
	expect(manifest.background_color).toBe("#00ff00ff");

	const tags = await zip.file("favicon-tags.html")!.async("string");
	expect(tags).toContain(
		'<meta name="application-name" content="Pixel App">'
	);
	expect(tags).toContain('<meta name="theme-color" content="#00ff00ff">');

	const icoEntries = parseIcoEntries(
		await zip.file("favicon.ico")!.async("uint8array")
	);
	expect(icoEntries.map((entry) => entry.size)).toEqual([16, 32, 48]);

	const favicon32 = PNG.sync.read(
		Buffer.from(await zip.file("favicon-32x32.png")!.async("uint8array"))
	);
	expect(favicon32.width).toBe(32);
	expect(favicon32.height).toBe(32);
	expect(getPixel(favicon32, 0, 0)).toEqual([255, 0, 0, 255]);
	expect(getPixel(favicon32, 16, 16)).toEqual([0, 255, 0, 255]);

	const maskable192 = PNG.sync.read(
		Buffer.from(
			await zip.file("icon-maskable-192x192.png")!.async("uint8array")
		)
	);
	expect(maskable192.width).toBe(192);
	expect(maskable192.height).toBe(192);
	expect(getPixel(maskable192, 0, 0)).toEqual([0, 255, 0, 255]);
	expect(getPixel(maskable192, 20, 20)).toEqual([255, 0, 0, 255]);
});

test("download failures surface one toast and do not trigger a download", async ({
	page,
}) => {
	await page.addInitScript(() => {
		HTMLCanvasElement.prototype.toBlob = function (callback) {
			setTimeout(() => {
				callback(null);
			}, 150);
		};
	});
	await page.goto("/");

	await page.getByLabel("Enter Text").fill("err");
	await expect(page.getByLabel("App name")).toHaveValue("err");

	const downloadButton = page.getByRole("button", { name: "Download" });
	const downloads: string[] = [];
	page.on("download", (download) => {
		downloads.push(download.suggestedFilename());
	});

	await waitForPendingDownloadState(page);
	await downloadButton.click();
	await expect(page.getByText("Export failed")).toHaveCount(1);
	await expect(
		page.getByText("Unable to create the favicon bundle. Please try again.")
	).toHaveCount(1);
	await waitForIdleDownloadState(page);
	await page.waitForTimeout(250);
	expect(downloads).toEqual([]);
});

test("static routes render and navigate back to the editor", async ({ page }) => {
	await page.goto("/about");
	await expect(page.getByRole("heading", { level: 1, name: "About" })).toBeVisible();
	await page.getByRole("link", { name: "Back" }).click();
	await expect(page).toHaveURL(/\/$/);
	await expect(page.getByRole("button", { name: "Download" })).toBeVisible();

	await page.goto("/history");
	await expect(
		page.getByRole("heading", { level: 1, name: "The History of the Favicon" })
	).toBeVisible();

	await page.goto("/legal");
	await expect(page.getByRole("heading", { level: 1, name: "Legal" })).toBeVisible();
});
