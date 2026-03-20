"use client";

import { saveAs } from "file-saver";
import { useStore } from "jotai";
import JSZip from "jszip";
import { useRef, useState } from "react";
import {
	renderFaviconCanvas,
	type FaviconFontStyles,
} from "@/lib/favicon-renderer";
import { store } from "@/lib/stores";

export function DownloadButton() {
	const jotaiStore = useStore();
	const isDownloadingRef = useRef(false);
	const [isDownloading, setIsDownloading] = useState(false);
	const iconSizes = [16, 32, 96, 192, 512];
	const appleTouchIconSizes = [57, 72, 114, 144, 180];
	const createIcons = (
		getCanvas: (size: number) => HTMLCanvasElement
	): Record<string, string> => {
		const icons: Record<string, string> = {};

		for (const size of iconSizes) {
			icons[`favicon-${size}x${size}.png`] = canvasToBase64Png(getCanvas(size));
		}

		for (const size of appleTouchIconSizes) {
			icons[`apple-touch-icon-${size}x${size}.png`] = canvasToBase64Png(
				getCanvas(size)
			);
		}

		icons["apple-touch-icon.png"] = canvasToBase64Png(getCanvas(180));

		return icons;
	};

	const createIco = async (canvas: HTMLCanvasElement): Promise<ArrayBuffer> => {
		const blob = await canvasToBlob(canvas);
		const arrayBuffer = await blob.arrayBuffer();
		return createIcoBuffer(arrayBuffer);
	};

	const createIcoBuffer = (pngBuffer: ArrayBuffer): ArrayBuffer => {
		const pngData = new Uint8Array(pngBuffer);
		const fileHeaderSize = 6;
		const iconDirEntrySize = 16;

		const icoHeader = new Uint8Array(fileHeaderSize + iconDirEntrySize);
		icoHeader.set([0x00, 0x00, 0x01, 0x00, 0x01, 0x00], 0);
		const iconDirEntry = [
			0x20, // Width: 32
			0x20, // Height: 32
			0x00, // Number of colors (0 if no palette)
			0x00, // Reserved
			0x01,
			0x00, // Color planes
			0x20,
			0x00, // Bits per pixel: 32
			...Array.from(new Uint8Array(new Uint32Array([pngData.length]).buffer)), // Image size
			...Array.from(
				new Uint8Array(
					new Uint32Array([fileHeaderSize + iconDirEntrySize]).buffer
				)
			), // Offset to image data
		];
		icoHeader.set(iconDirEntry, fileHeaderSize);

		const icoBuffer = new Uint8Array(icoHeader.length + pngData.length);
		icoBuffer.set(icoHeader, 0);
		icoBuffer.set(pngData, icoHeader.length);

		return icoBuffer.buffer;
	};

	const downloadFiles = async () => {
		if (isDownloadingRef.current) {
			return;
		}

		isDownloadingRef.current = true;
		setIsDownloading(true);

		try {
			await waitForFonts();

			const values = jotaiStore.get(store);
			const fontStyles = getPreviewFontStyles();
			const renderedCanvases = new Map<number, HTMLCanvasElement>();
			const getCanvas = (size: number) => {
				const existingCanvas = renderedCanvases.get(size);
				if (existingCanvas) {
					return existingCanvas;
				}

				const canvas = renderFaviconCanvas({
					fontStyles,
					size,
					values,
				});
				renderedCanvases.set(size, canvas);
				return canvas;
			};
			const icoBuffer = await createIco(getCanvas(32));
			const icons = createIcons(getCanvas);

			const zip = new JSZip();
			zip.file("favicon.ico", icoBuffer);
			for (const [name, data] of Object.entries(icons)) {
				zip.file(name, data, { base64: true });
			}

			const blob = await zip.generateAsync({ type: "blob" });
			saveAs(blob, "favicons.zip");
		} catch (error) {
			console.error("Error creating favicon bundle:", error);
		} finally {
			isDownloadingRef.current = false;
			setIsDownloading(false);
		}
	};

	return (
		<button
			type="button"
			onClick={downloadFiles}
			disabled={isDownloading}
			aria-busy={isDownloading}
			className={`group inline-flex h-9 items-center gap-1.5 rounded-sm border px-3.5 text-[10px] font-medium tracking-[0.14em] uppercase transition-colors ${
				isDownloading
					? "bg-canvas-900 cursor-wait border-amber-600/50 text-amber-500/90"
					: "border-canvas-700/90 bg-canvas-950 text-canvas-400 hover:bg-canvas-900 hover:border-amber-600/50 hover:text-amber-500/90"
			}`}
		>
			<svg
				xmlns="http://www.w3.org/2000/svg"
				viewBox="0 0 20 20"
				fill="currentColor"
				className={`size-3.5 text-amber-500/85 transition-transform ${
					isDownloading ? "" : "group-hover:translate-y-px"
				}`}
				aria-hidden
			>
				<path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
				<path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
			</svg>
			{isDownloading ? "Preparing..." : "Download"}
		</button>
	);
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

function getPreviewFontStyles(): FaviconFontStyles {
	const previewTextEl = document.querySelector<HTMLElement>(
		"[data-favicon-text]"
	);
	const computedStyles = window.getComputedStyle(
		previewTextEl ?? document.body
	);

	return {
		fontFamily: computedStyles.fontFamily || "sans-serif",
		fontStyle: computedStyles.fontStyle || "normal",
		fontWeight: computedStyles.fontWeight || "400",
	};
}

async function waitForFonts() {
	if ("fonts" in document) {
		await document.fonts.ready;
	}
}
