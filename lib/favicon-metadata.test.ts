import { describe, expect, test } from "bun:test";
import {
	updateAppNameMetadata,
	updateShortNameMetadata,
	updateTextMetadata,
} from "./favicon-metadata";
import { initialFaviconValues } from "./stores";

describe("favicon metadata linking", () => {
	test("keeps app and short name linked to text by default", () => {
		const next = updateTextMetadata(initialFaviconValues, "mark");

		expect(next).toMatchObject({
			text: "mark",
			appName: "mark",
			shortName: "mark",
			appNameLinked: true,
			shortNameLinked: true,
		});
	});

	test("detaches app name from text while keeping short name linked to app name", () => {
		const manualAppName = updateAppNameMetadata(initialFaviconValues, "Brand");
		const afterTextChange = updateTextMetadata(manualAppName, "icon");

		expect(manualAppName).toMatchObject({
			appName: "Brand",
			shortName: "Brand",
			appNameLinked: false,
			shortNameLinked: true,
		});
		expect(afterTextChange).toMatchObject({
			text: "icon",
			appName: "Brand",
			shortName: "Brand",
			appNameLinked: false,
			shortNameLinked: true,
		});
	});

	test("detaches short name from later app-name changes", () => {
		const manualShortName = updateShortNameMetadata(
			initialFaviconValues,
			"Mini"
		);
		const afterAppNameChange = updateAppNameMetadata(manualShortName, "Brand");

		expect(manualShortName).toMatchObject({
			shortName: "Mini",
			shortNameLinked: false,
		});
		expect(afterAppNameChange).toMatchObject({
			appName: "Brand",
			shortName: "Mini",
			appNameLinked: false,
			shortNameLinked: false,
		});
	});

	test("same-value manual overrides still stay detached", () => {
		const manuallyDetached = updateAppNameMetadata(
			initialFaviconValues,
			initialFaviconValues.text
		);
		const afterTextChange = updateTextMetadata(manuallyDetached, "new");
		const manuallyDetachedShortName = updateShortNameMetadata(
			afterTextChange,
			afterTextChange.appName
		);
		const afterSecondAppNameChange = updateAppNameMetadata(
			manuallyDetachedShortName,
			"brand"
		);

		expect(manuallyDetached.appNameLinked).toBe(false);
		expect(afterTextChange.appName).toBe("ico");
		expect(manuallyDetachedShortName.shortNameLinked).toBe(false);
		expect(afterSecondAppNameChange.shortName).toBe("ico");
	});
});
