import { describe, expect, test } from "bun:test";
import { createIcoBuffer } from "./favicon-ico";

describe("ico encoding", () => {
	test("writes headers, offsets, and payload bytes correctly", () => {
		const images = [
			{ size: 16, pngData: new Uint8Array([1, 2, 3]) },
			{ size: 32, pngData: new Uint8Array([4, 5]) },
			{ size: 256, pngData: new Uint8Array([6, 7, 8, 9]) },
		] as const;
		const buffer = createIcoBuffer(images);
		const view = new DataView(buffer);
		const bytes = new Uint8Array(buffer);

		expect(view.getUint16(0, true)).toBe(0);
		expect(view.getUint16(2, true)).toBe(1);
		expect(view.getUint16(4, true)).toBe(images.length);

		const entries = images.map((_, index) => {
			const offset = 6 + index * 16;

			return {
				width: view.getUint8(offset),
				height: view.getUint8(offset + 1),
				bitCount: view.getUint16(offset + 6, true),
				length: view.getUint32(offset + 8, true),
				dataOffset: view.getUint32(offset + 12, true),
			};
		});

		expect(entries).toEqual([
			{
				width: 16,
				height: 16,
				bitCount: 32,
				length: 3,
				dataOffset: 54,
			},
			{
				width: 32,
				height: 32,
				bitCount: 32,
				length: 2,
				dataOffset: 57,
			},
			{
				width: 0,
				height: 0,
				bitCount: 32,
				length: 4,
				dataOffset: 59,
			},
		]);

		expect(entries[0].dataOffset).toBeLessThan(entries[1].dataOffset);
		expect(entries[1].dataOffset).toBeLessThan(entries[2].dataOffset);
		expect([...bytes.slice(entries[0].dataOffset, entries[0].dataOffset + 3)]).toEqual([1, 2, 3]);
		expect([...bytes.slice(entries[1].dataOffset, entries[1].dataOffset + 2)]).toEqual([4, 5]);
		expect([...bytes.slice(entries[2].dataOffset, entries[2].dataOffset + 4)]).toEqual([6, 7, 8, 9]);
	});
});
