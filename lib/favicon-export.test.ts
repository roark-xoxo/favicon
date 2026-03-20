import { describe, expect, test } from "bun:test";
import {
	createFaviconTags,
	getGeneratedBundleFileNames,
	getMaskableIconLayout,
	getWebManifest,
} from "./favicon-export";

describe("favicon export helpers", () => {
	test("returns the modern bundle file set", () => {
		expect(getGeneratedBundleFileNames()).toEqual([
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
		]);

		expect(getGeneratedBundleFileNames()).not.toContain("favicon-96x96.png");
		expect(getGeneratedBundleFileNames()).not.toContain(
			"apple-touch-icon-57x57.png"
		);
	});

	test("creates a manifest with standard and maskable icons", () => {
		const manifest = getWebManifest({
			appName: "Favicon Builder",
			bgColor: "#101010",
			shortName: "Builder",
		});

		expect(manifest).toEqual({
			name: "Favicon Builder",
			short_name: "Builder",
			start_url: "/",
			display: "standalone",
			background_color: "#101010",
			theme_color: "#101010",
			icons: [
				{
					src: "/icon-192x192.png",
					sizes: "192x192",
					type: "image/png",
				},
				{
					src: "/icon-512x512.png",
					sizes: "512x512",
					type: "image/png",
				},
				{
					src: "/icon-maskable-192x192.png",
					sizes: "192x192",
					type: "image/png",
					purpose: "maskable",
				},
				{
					src: "/icon-maskable-512x512.png",
					sizes: "512x512",
					type: "image/png",
					purpose: "maskable",
				},
			],
		});
	});

	test("creates favicon tags for the generated assets", () => {
		const tags = createFaviconTags({
			appName: "Favicon Builder",
			bgColor: "#ffffff",
			shortName: "Builder",
		});

		expect(tags).toContain('<link rel="icon" href="/favicon.ico">');
		expect(tags).toContain(
			'<link rel="manifest" href="/site.webmanifest">'
		);
		expect(tags).toContain(
			'<meta name="apple-mobile-web-app-title" content="Favicon Builder">'
		);
		expect(tags).toContain('<meta name="theme-color" content="#ffffff">');
	});

	test("uses a consistent maskable inset", () => {
		expect(getMaskableIconLayout(192)).toEqual({
			iconSize: 154,
			padding: 19,
		});
		expect(getMaskableIconLayout(512)).toEqual({
			iconSize: 410,
			padding: 51,
		});
	});
});
