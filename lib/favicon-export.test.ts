import { describe, expect, test } from "bun:test";
import {
	createFaviconTags,
	createSiteWebManifest,
	getMaskableIconLayout,
	getWebManifest,
} from "./favicon-export";

function toIconKey(icon: {
	src: string;
	sizes: string;
	type: string;
	purpose?: string;
}) {
	return [icon.src, icon.sizes, icon.type, icon.purpose ?? ""].join("|");
}

describe("favicon export helpers", () => {
	test("normalizes blank metadata when creating the manifest", () => {
		const manifest = getWebManifest({
			appName: "  Favicon Builder  ",
			bgColor: "#101010",
			shortName: "   ",
		});

		expect(manifest).toMatchObject({
			name: "Favicon Builder",
			short_name: "Favicon Builder",
			start_url: "/",
			display: "standalone",
			background_color: "#101010",
			theme_color: "#101010",
		});
		expect(new Set(manifest.icons.map(toIconKey))).toEqual(
			new Set([
				"/icon-192x192.png|192x192|image/png|",
				"/icon-512x512.png|512x512|image/png|",
				"/icon-maskable-192x192.png|192x192|image/png|maskable",
				"/icon-maskable-512x512.png|512x512|image/png|maskable",
			])
		);
	});

	test("serializes manifest JSON with favicon fallbacks and a trailing newline", () => {
		const manifestText = createSiteWebManifest({
			appName: "  ",
			bgColor: "#ffffff",
			shortName: " ",
		});
		const manifest = JSON.parse(manifestText);

		expect(manifest.name).toBe("favicon");
		expect(manifest.short_name).toBe("favicon");
		expect(manifest.theme_color).toBe("#ffffff");
		expect(manifestText.endsWith("\n")).toBe(true);
	});

	test("creates escaped favicon tags for the generated assets", () => {
		const tags = createFaviconTags({
			appName: '<App "Name" & Co>',
			bgColor: "#ffffff",
			shortName: "Builder",
		});
		const lines = tags.trim().split("\n");

		expect(lines).toContain('<link rel="icon" href="/favicon.ico">');
		expect(lines).toContain('<link rel="manifest" href="/site.webmanifest">');
		expect(lines).toContain(
			'<meta name="application-name" content="&lt;App &quot;Name&quot; &amp; Co&gt;">'
		);
		expect(lines).toContain(
			'<meta name="apple-mobile-web-app-title" content="&lt;App &quot;Name&quot; &amp; Co&gt;">'
		);
		expect(
			lines.filter((line) => line.includes('rel="manifest"')).length
		).toBe(1);
		expect(
			lines.filter((line) => line.includes('name="theme-color"')).length
		).toBe(1);
	});

	test("keeps the maskable layout inside the canvas for a wide size range", () => {
		for (let size = 1; size <= 1024; size += 1) {
			const { iconSize, padding } = getMaskableIconLayout(size);

			expect(iconSize).toBeGreaterThanOrEqual(1);
			expect(padding).toBeGreaterThanOrEqual(0);
			expect(padding * 2 + iconSize).toBe(size);
		}
	});

	test("normalizes zero, negative, and fractional sizes before layout", () => {
		expect(getMaskableIconLayout(-10)).toEqual({
			iconSize: 1,
			padding: 0,
		});
		expect(getMaskableIconLayout(0)).toEqual({
			iconSize: 1,
			padding: 0,
		});
		expect(getMaskableIconLayout(10.4)).toEqual({
			iconSize: 8,
			padding: 1,
		});
		expect(getMaskableIconLayout(10.6)).toEqual({
			iconSize: 9,
			padding: 1,
		});
	});
});
