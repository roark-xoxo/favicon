import { describe, expect, test } from "bun:test";
import {
	CANONICAL_FAVICON_SIZE,
	getFaviconGeometry,
	initialFaviconValues,
} from "./stores";

describe("favicon geometry", () => {
	test("starts with linked metadata defaults", () => {
		expect(initialFaviconValues).toMatchObject({
			text: "ico",
			appName: "ico",
			shortName: "ico",
			appNameLinked: true,
			shortNameLinked: true,
		});
	});

	test("scales within the requested canvas while preserving geometry invariants", () => {
		const geometry = getFaviconGeometry(initialFaviconValues, 16);
		const expectedScale = 16 / CANONICAL_FAVICON_SIZE;

		expect(geometry.size).toBe(16);
		expect(geometry.scale).toBe(expectedScale);
		expect(geometry.borderWidth).toBeCloseTo(
			initialFaviconValues.borderWidth * expectedScale,
			5
		);
		expect(geometry.textSize).toBeCloseTo(
			initialFaviconValues.fontSize * expectedScale,
			5
		);
		expect(geometry.innerSize).toBeCloseTo(
			16 - geometry.borderWidth * 2,
			5
		);
		expect(geometry.outerRadius).toBeGreaterThanOrEqual(0);
		expect(geometry.outerRadius).toBeLessThanOrEqual(8);
		expect(geometry.innerRadius).toBeGreaterThanOrEqual(0);
		expect(geometry.innerRadius).toBeLessThanOrEqual(geometry.innerSize / 2);
	});

	test("clamps negative values and prevents negative inner geometry", () => {
		const geometry = getFaviconGeometry(
			{
				...initialFaviconValues,
				borderWidth: -5,
				fontSize: -2,
				rounded: -10,
			},
			320
		);

		expect(geometry.borderWidth).toBe(0);
		expect(geometry.outerRadius).toBe(0);
		expect(geometry.innerRadius).toBe(0);
		expect(geometry.innerSize).toBe(320);
		expect(geometry.textSize).toBe(0);
	});

	test("clamps oversized borders to half the canvas", () => {
		const geometry = getFaviconGeometry(
			{
				...initialFaviconValues,
				borderWidth: 999,
				rounded: 999,
			},
			320
		);

		expect(geometry.borderWidth).toBe(160);
		expect(geometry.outerRadius).toBe(160);
		expect(geometry.innerSize).toBe(0);
		expect(geometry.innerRadius).toBe(0);
	});
});
