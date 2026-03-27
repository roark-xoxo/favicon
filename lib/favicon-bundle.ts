import JSZip from "jszip";
import {
	createFaviconTags,
	createSiteWebManifest,
	ICO_ICON_SIZES,
	PNG_EXPORTS,
	type FaviconExportMetadata,
} from "@/lib/favicon-export";
import { createIcoBuffer } from "@/lib/favicon-ico";
import {
	renderFaviconCanvas,
	type FaviconFontStyles,
} from "@/lib/favicon-renderer";
import type { FaviconValues } from "@/lib/stores";

export async function createFaviconBundle({
	values,
	fontStyles,
}: {
	values: FaviconValues;
	fontStyles: FaviconFontStyles;
}) {
	const renderedCanvases = new Map<string, HTMLCanvasElement>();
	const getCanvas = ({
		size,
		variant,
	}: {
		size: number;
		variant: "standard" | "maskable";
	}) => {
		const cacheKey = `${variant}:${size}`;
		const existingCanvas = renderedCanvases.get(cacheKey);
		if (existingCanvas) {
			return existingCanvas;
		}

		const canvas = renderFaviconCanvas({
			fontStyles,
			size,
			values,
			variant,
		});
		renderedCanvases.set(cacheKey, canvas);
		return canvas;
	};
	const icoBuffer = await createIcoBufferFromCanvases(getCanvas);
	const metadata = getExportMetadata(values);

	const zip = new JSZip();
	zip.file("favicon.ico", icoBuffer);
	for (const asset of PNG_EXPORTS) {
		zip.file(
			asset.filename,
			canvasToBase64Png(
				getCanvas({
					size: asset.size,
					variant: asset.variant,
				})
			),
			{ base64: true }
		);
	}
	zip.file("site.webmanifest", createSiteWebManifest(metadata));
	zip.file("favicon-tags.html", createFaviconTags(metadata));

	return zip.generateAsync({ type: "uint8array" });
}

async function createIcoBufferFromCanvases(
	getCanvas: ({
		size,
		variant,
	}: {
		size: number;
		variant: "standard" | "maskable";
	}) => HTMLCanvasElement
) {
	const images = await Promise.all(
		ICO_ICON_SIZES.map(async (size) => {
			const blob = await canvasToBlob(
				getCanvas({
					size,
					variant: "standard",
				})
			);

			return {
				size,
				pngData: new Uint8Array(await blob.arrayBuffer()),
			};
		})
	);

	return createIcoBuffer(images);
}

function canvasToBase64Png(canvas: HTMLCanvasElement) {
	return canvas.toDataURL("image/png").split(",")[1];
}

function canvasToBlob(canvas: HTMLCanvasElement) {
	return new Promise<Blob>((resolve, reject) => {
		canvas.toBlob((blob) => {
			if (blob) {
				resolve(blob);
				return;
			}

			reject(new Error("Failed to create blob from canvas."));
		}, "image/png");
	});
}

function getExportMetadata(values: {
	appName: string;
	bgColor: string;
	shortName: string;
}): FaviconExportMetadata {
	return {
		appName: values.appName,
		bgColor: values.bgColor,
		shortName: values.shortName,
	};
}
