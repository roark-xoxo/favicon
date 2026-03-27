"use client";

import { Toast } from "@base-ui/react/toast";
import { saveAs } from "file-saver";
import { useStore } from "jotai";
import { useRef, useState } from "react";
import { flushSync } from "react-dom";
import { createFaviconBundle } from "@/lib/favicon-bundle";
import type { FaviconFontStyles } from "@/lib/favicon-renderer";
import { store } from "@/lib/stores";

const MIN_PENDING_STATE_MS = 300;

export function DownloadButton() {
	const jotaiStore = useStore();
	const toastManager = Toast.useToastManager();
	const isDownloadingRef = useRef(false);
	const [isDownloading, setIsDownloading] = useState(false);

	const downloadFiles = async () => {
		if (isDownloadingRef.current) {
			return;
		}

		isDownloadingRef.current = true;
		flushSync(() => {
			setIsDownloading(true);
		});
		const pendingStateStartedAt = getNow();
		await waitForNextFrame();

		try {
			await waitForFonts();

			const values = jotaiStore.get(store);
			const fontStyles = getPreviewFontStyles();
			const bundle = await createFaviconBundle({
				values,
				fontStyles,
			});
			const blob = new Blob([bundle as unknown as BlobPart], {
				type: "application/zip",
			});
			saveAs(blob, "favicons.zip");
		} catch (error) {
			console.error("Error creating favicon bundle:", error);
			toastManager.add({
				title: "Export failed",
				description: "Unable to create the favicon bundle. Please try again.",
			});
		} finally {
			await waitForMinimumPendingState(pendingStateStartedAt);
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

function waitForNextFrame() {
	return new Promise<void>((resolve) => {
		if (typeof requestAnimationFrame === "function") {
			requestAnimationFrame(() => resolve());
			return;
		}

		setTimeout(resolve, 0);
	});
}

async function waitForMinimumPendingState(startedAt: number) {
	const remainingMs = MIN_PENDING_STATE_MS - (getNow() - startedAt);

	if (remainingMs > 0) {
		await new Promise<void>((resolve) => {
			setTimeout(resolve, remainingMs);
		});
	}
}

function getNow() {
	if (typeof performance !== "undefined") {
		return performance.now();
	}

	return Date.now();
}
