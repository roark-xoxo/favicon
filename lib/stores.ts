import { atom } from "jotai";

export type FaviconValues = {
	text: string;
	fontSize: number;
	rotation: number;
	borderWidth: number;
	rounded: number;
	textColor: string;
	bgColor: string;
	borderColor: string;
};

export const CANONICAL_FAVICON_SIZE = 320;

export const initialFaviconValues: FaviconValues = {
	text: "ico",
	fontSize: 178,
	rotation: 0,
	borderWidth: 9,
	rounded: 94,
	textColor: "#000",
	bgColor: "#fff",
	borderColor: "#000",
};

export function getFaviconGeometry(
	values: FaviconValues,
	size = CANONICAL_FAVICON_SIZE
) {
	const scale = size / CANONICAL_FAVICON_SIZE;
	const borderWidth = Math.min(
		Math.max(values.borderWidth * scale, 0),
		size / 2
	);
	const outerRadius = clampRadius(values.rounded * scale, size / 2);
	const innerSize = Math.max(size - borderWidth * 2, 0);
	const innerRadius = clampRadius(
		Math.max(values.rounded - values.borderWidth, 0) * scale,
		innerSize / 2
	);
	const textSize = Math.max(values.fontSize * scale, 0);

	return {
		borderWidth,
		innerRadius,
		innerSize,
		outerRadius,
		scale,
		size,
		textSize,
	};
}

function clampRadius(radius: number, maxRadius: number) {
	return Math.max(0, Math.min(radius, maxRadius));
}

export const store = atom<FaviconValues>(initialFaviconValues);
