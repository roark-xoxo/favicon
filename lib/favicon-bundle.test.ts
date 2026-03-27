import { afterEach, beforeEach, describe, expect, test } from "bun:test";
import JSZip from "jszip";
import { createFaviconBundle } from "./favicon-bundle";
import { initialFaviconValues } from "./stores";

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

type CanvasContextStub = {
	fillStyle: string;
	font: string;
	textAlign: CanvasTextAlign;
	textBaseline: CanvasTextBaseline;
	save(): void;
	restore(): void;
	fillRect(): void;
	drawImage(): void;
	beginPath(): void;
	rect(): void;
	closePath(): void;
	moveTo(): void;
	lineTo(): void;
	arcTo(): void;
	fill(): void;
	clip(): void;
	translate(): void;
	rotate(): void;
	fillText(): void;
};

class FakeCanvas {
	width = 0;
	height = 0;
	private readonly returnNullBlob: boolean;

	constructor(returnNullBlob = false) {
		this.returnNullBlob = returnNullBlob;
	}

	getContext(type: string) {
		if (type !== "2d") {
			return null;
		}

		const context: CanvasContextStub = {
			fillStyle: "",
			font: "",
			textAlign: "left",
			textBaseline: "alphabetic",
			save() {},
			restore() {},
			fillRect() {},
			drawImage() {},
			beginPath() {},
			rect() {},
			closePath() {},
			moveTo() {},
			lineTo() {},
			arcTo() {},
			fill() {},
			clip() {},
			translate() {},
			rotate() {},
			fillText() {},
		};

		return context as unknown as CanvasRenderingContext2D;
	}

	toDataURL(type: string) {
		const bytes = Uint8Array.of(this.width, this.height, 1, 2);
		return `data:${type};base64,${Buffer.from(bytes).toString("base64")}`;
	}

	toBlob(
		callback: BlobCallback,
		type?: string
	) {
		if (this.returnNullBlob) {
			callback(null);
			return;
		}

		callback(
			new Blob([Uint8Array.of(this.width, this.height, 3, 4)], {
				type,
			})
		);
	}
}

describe("favicon bundle", () => {
	const originalDocument = globalThis.document;
	let returnNullBlob = false;

	beforeEach(() => {
		returnNullBlob = false;
		(globalThis as typeof globalThis & {
			document: Document;
		}).document = {
			createElement(tagName: string) {
				if (tagName !== "canvas") {
					throw new Error(`Unexpected element: ${tagName}`);
				}

				return new FakeCanvas(returnNullBlob) as unknown as HTMLElement;
			},
		} as Document;
	});

	afterEach(() => {
		if (originalDocument) {
			globalThis.document = originalDocument;
			return;
		}

		delete (globalThis as Partial<typeof globalThis>).document;
	});

	test("packages the expected files and metadata into the archive", async () => {
		const bundle = await createFaviconBundle({
			values: {
				...initialFaviconValues,
				appName: "  <App>  ",
				bgColor: "#123456",
				shortName: "   ",
			},
			fontStyles: {
				fontFamily: "sans-serif",
				fontStyle: "normal",
				fontWeight: "400",
			},
		});
		const zip = await JSZip.loadAsync(bundle);
		const fileNames = Object.keys(zip.files);
		const manifestFile = zip.file("site.webmanifest");
		const tagsFile = zip.file("favicon-tags.html");
		const icoFile = zip.file("favicon.ico");

		expect(new Set(fileNames)).toEqual(new Set(EXPECTED_BUNDLE_FILES));
		expect(manifestFile).toBeDefined();
		expect(tagsFile).toBeDefined();
		expect(icoFile).toBeDefined();

		const manifest = JSON.parse(await manifestFile!.async("string"));
		expect(manifest.name).toBe("<App>");
		expect(manifest.short_name).toBe("<App>");
		expect(manifest.background_color).toBe("#123456");

		const tags = await tagsFile!.async("string");
		expect(tags).toContain(
			'<meta name="application-name" content="&lt;App&gt;">'
		);
		expect(tags).toContain(
			'<meta name="theme-color" content="#123456">'
		);

		const icoBytes = await icoFile!.async("uint8array");
		const view = new DataView(
			icoBytes.buffer,
			icoBytes.byteOffset,
			icoBytes.byteLength
		);
		const encodedSizes = Array.from({ length: 3 }, (_, index) =>
			view.getUint8(6 + index * 16)
		);

		expect(view.getUint16(4, true)).toBe(3);
		expect(encodedSizes).toEqual([16, 32, 48]);
	});

	test("rejects when canvas blobs cannot be created for the ico export", async () => {
		returnNullBlob = true;

		await expect(
			createFaviconBundle({
				values: initialFaviconValues,
				fontStyles: {
					fontFamily: "sans-serif",
					fontStyle: "normal",
					fontWeight: "400",
				},
			})
		).rejects.toThrow("Failed to create blob from canvas.");
	});
});
