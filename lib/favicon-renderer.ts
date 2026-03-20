"use client";

import { getFaviconGeometry, type FaviconValues } from "@/lib/stores";
import { getMaskableIconLayout, type FaviconExportVariant } from "@/lib/favicon-export";

export type FaviconFontStyles = {
	fontFamily: string;
	fontStyle: string;
	fontWeight: string;
};

export function renderFaviconCanvas({
	fontStyles,
	size,
	values,
	variant = "standard",
}: {
	fontStyles: FaviconFontStyles;
	size: number;
	values: FaviconValues;
	variant?: FaviconExportVariant;
}) {
	if (variant === "maskable") {
		return renderMaskableFaviconCanvas({
			fontStyles,
			size,
			values,
		});
	}

	const canvas = createCanvas(size);
	const context = getCanvasContext(canvas);

	renderStandardFavicon({
		context,
		fontStyles,
		size,
		values,
	});

	return canvas;
}

function renderMaskableFaviconCanvas({
	fontStyles,
	size,
	values,
}: {
	fontStyles: FaviconFontStyles;
	size: number;
	values: FaviconValues;
}) {
	const canvas = createCanvas(size);
	const context = getCanvasContext(canvas);
	const { iconSize, padding } = getMaskableIconLayout(size);
	const iconCanvas = createCanvas(iconSize);
	const iconContext = getCanvasContext(iconCanvas);

	context.fillStyle = values.bgColor;
	context.fillRect(0, 0, size, size);

	renderStandardFavicon({
		context: iconContext,
		fontStyles,
		size: iconSize,
		values,
	});
	context.drawImage(iconCanvas, padding, padding);

	return canvas;
}

function renderStandardFavicon({
	context,
	fontStyles,
	size,
	values,
}: {
	context: CanvasRenderingContext2D;
	fontStyles: FaviconFontStyles;
	size: number;
	values: FaviconValues;
}) {
	const geometry = getFaviconGeometry(values, size);

	fillRoundedRect(
		context,
		0,
		0,
		size,
		size,
		geometry.outerRadius,
		values.borderColor
	);

	if (geometry.innerSize <= 0) {
		return;
	}

	fillRoundedRect(
		context,
		geometry.borderWidth,
		geometry.borderWidth,
		geometry.innerSize,
		geometry.innerSize,
		geometry.innerRadius,
		values.bgColor
	);

	if (!values.text || geometry.textSize <= 0) {
		return;
	}

	context.save();
	addRoundedRectPath(
		context,
		geometry.borderWidth,
		geometry.borderWidth,
		geometry.innerSize,
		geometry.innerSize,
		geometry.innerRadius
	);
	context.clip();
	context.translate(size / 2, size / 2);
	context.rotate((values.rotation * Math.PI) / 180);
	context.fillStyle = values.textColor;
	context.font = [
		fontStyles.fontStyle,
		fontStyles.fontWeight,
		`${geometry.textSize}px`,
		fontStyles.fontFamily,
	].join(" ");
	context.textAlign = "center";
	context.textBaseline = "middle";
	context.fillText(values.text, 0, 0);
	context.restore();
}

function createCanvas(size: number) {
	const canvas = document.createElement("canvas");
	canvas.width = size;
	canvas.height = size;

	return canvas;
}

function getCanvasContext(canvas: HTMLCanvasElement) {
	const context = canvas.getContext("2d");
	if (!context) {
		throw new Error("Failed to get 2D context");
	}

	return context;
}

function fillRoundedRect(
	context: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number,
	color: string
) {
	context.save();
	addRoundedRectPath(context, x, y, width, height, radius);
	context.fillStyle = color;
	context.fill();
	context.restore();
}

function addRoundedRectPath(
	context: CanvasRenderingContext2D,
	x: number,
	y: number,
	width: number,
	height: number,
	radius: number
) {
	const clampedRadius = Math.max(0, Math.min(radius, width / 2, height / 2));

	context.beginPath();

	if (clampedRadius === 0) {
		context.rect(x, y, width, height);
		context.closePath();
		return;
	}

	context.moveTo(x + clampedRadius, y);
	context.lineTo(x + width - clampedRadius, y);
	context.arcTo(x + width, y, x + width, y + clampedRadius, clampedRadius);
	context.lineTo(x + width, y + height - clampedRadius);
	context.arcTo(
		x + width,
		y + height,
		x + width - clampedRadius,
		y + height,
		clampedRadius
	);
	context.lineTo(x + clampedRadius, y + height);
	context.arcTo(x, y + height, x, y + height - clampedRadius, clampedRadius);
	context.lineTo(x, y + clampedRadius);
	context.arcTo(x, y, x + clampedRadius, y, clampedRadius);
	context.closePath();
}
