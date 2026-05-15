import { afterEach, describe, expect, test } from "bun:test";
import { renderFaviconCanvas } from "./favicon-renderer";
import { initialFaviconValues } from "./stores";

type Operation = {
	name: string;
	fillStyle?: string;
};

const operations: Operation[] = [];

class RecordingCanvas {
	width = 0;
	height = 0;

	getContext(type: string) {
		if (type !== "2d") {
			return null;
		}

		const context = {
			fillStyle: "",
			font: "",
			textAlign: "left" as CanvasTextAlign,
			textBaseline: "alphabetic" as CanvasTextBaseline,
			save() {},
			restore() {},
			fillRect() {
				operations.push({ name: "fillRect", fillStyle: this.fillStyle });
			},
			drawImage() {},
			beginPath() {},
			rect() {},
			closePath() {},
			moveTo() {},
			lineTo() {},
			arcTo() {},
			fill() {
				operations.push({ name: "fill", fillStyle: this.fillStyle });
			},
			clip() {},
			translate() {},
			rotate() {},
			fillText() {},
		};

		return context as unknown as CanvasRenderingContext2D;
	}
}

describe("favicon renderer", () => {
	const originalDocument = globalThis.document;

	afterEach(() => {
		operations.length = 0;

		if (originalDocument) {
			globalThis.document = originalDocument;
			return;
		}

		delete (globalThis as Partial<typeof globalThis>).document;
	});

	test("renders zero-width rounded borders as a single background fill", () => {
		(globalThis as typeof globalThis & { document: Document }).document = {
			createElement(tagName: string) {
				if (tagName !== "canvas") {
					throw new Error(`Unexpected element: ${tagName}`);
				}

				return new RecordingCanvas() as unknown as HTMLElement;
			},
		} as Document;

		renderFaviconCanvas({
			fontStyles: {
				fontFamily: "sans-serif",
				fontStyle: "normal",
				fontWeight: "400",
			},
			size: 180,
			values: {
				...initialFaviconValues,
				bgColor: "#eef1ed",
				borderColor: "#20252b",
				borderWidth: 0,
				rounded: 180,
			},
		});

		expect(operations.filter((operation) => operation.name === "fill")).toEqual([
			{ name: "fill", fillStyle: "#eef1ed" },
		]);
	});

	test("renders non-zero borders before the inner background", () => {
		(globalThis as typeof globalThis & { document: Document }).document = {
			createElement(tagName: string) {
				if (tagName !== "canvas") {
					throw new Error(`Unexpected element: ${tagName}`);
				}

				return new RecordingCanvas() as unknown as HTMLElement;
			},
		} as Document;

		renderFaviconCanvas({
			fontStyles: {
				fontFamily: "sans-serif",
				fontStyle: "normal",
				fontWeight: "400",
			},
			size: 180,
			values: {
				...initialFaviconValues,
				bgColor: "#eef1ed",
				borderColor: "#20252b",
				borderWidth: 9,
				rounded: 180,
			},
		});

		expect(operations.filter((operation) => operation.name === "fill")).toEqual([
			{ name: "fill", fillStyle: "#20252b" },
			{ name: "fill", fillStyle: "#eef1ed" },
		]);
	});
});
