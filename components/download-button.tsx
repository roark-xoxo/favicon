"use client";

import { saveAs } from "file-saver";
import { useStore } from "jotai";
import JSZip from "jszip";
import { useRef, useState } from "react";
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
import { store } from "@/lib/stores";

export function DownloadButton() {
	const jotaiStore = useStore();
	const isDownloadingRef = useRef(false);
	const [isDownloading, setIsDownloading] = useState(false);

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
