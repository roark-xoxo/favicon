"use client";

import { domToPng } from "modern-screenshot";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export function DownloadButton() {
	const iconSizes = [16, 32, 96, 192, 512];
	const appleTouchIconSizes = [57, 72, 114, 144, 180];
	const createIcons = async (
		pngDataUrl: string
	): Promise<Record<string, string>> => {
		const icons: Record<string, string> = {};

		for (const size of iconSizes) {
			const icon = await createIcon(pngDataUrl, size, size);
			icons[`favicon-${size}x${size}.png`] = icon;
		}

		for (const size of appleTouchIconSizes) {
			const icon = await createIcon(pngDataUrl, size, size);
			icons[`apple-touch-icon-${size}x${size}.png`] = icon;
		}

		const defaultAppleTouchIcon = await createIcon(pngDataUrl, 180, 180);
		icons["apple-touch-icon.png"] = defaultAppleTouchIcon;

		return icons;
	};

	const createIcon = (
		pngDataUrl: string,
		width: number,
		height: number
	): Promise<string> => {
		const img = new Image();
		img.src = pngDataUrl;

		return new Promise((resolve, reject) => {
			img.onload = () => {
				const canvas = document.createElement("canvas");
				const context = canvas.getContext("2d");
				if (!context) {
					reject(new Error("Failed to get 2D context"));
					return;
				}
				canvas.width = width;
				canvas.height = height;
				context.drawImage(img, 0, 0, width, height);
				resolve(canvas.toDataURL("image/png").split(",")[1]);
			};
			img.onerror = (error) => reject(error);
		});
	};

	const createIco = async (pngDataUrl: string): Promise<ArrayBuffer> => {
		const img = new Image();
		img.src = pngDataUrl;

		return new Promise((resolve, reject) => {
			img.onload = () => {
				const canvas = document.createElement("canvas");
				const context = canvas.getContext("2d");
				if (!context) {
					reject(new Error("Failed to get 2D context"));
					return;
				}
				canvas.width = 32;
				canvas.height = 32;
				context.drawImage(img, 0, 0, 32, 32);

				canvas.toBlob(async (blob) => {
					if (blob) {
						const arrayBuffer = await blob.arrayBuffer();
						const icoBuffer = createIcoBuffer(arrayBuffer);
						resolve(icoBuffer);
					} else {
						reject(new Error("Failed to create blob from canvas."));
					}
				}, "image/png");
			};
			img.onerror = (error) => reject(error);
		});
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
		const faviconEl = document.querySelector("#favicon");
		if (!faviconEl) return;

		try {
			const pngDataUrl = await domToPng(faviconEl);
			const icoBuffer = await createIco(pngDataUrl);

			const icons = await createIcons(pngDataUrl);

			const zip = new JSZip();
			zip.file("favicon.ico", icoBuffer);
			for (const [name, data] of Object.entries(icons)) {
				zip.file(name, data, { base64: true });
			}

			zip.generateAsync({ type: "blob" }).then((blob) => {
				saveAs(blob, "favicons.zip");
			});
		} catch (error) {
			console.error("Error creating ICO file:", error);
		}
	};

	return (
		<button
			onMouseDown={downloadFiles}
			className="group inline-flex h-11 items-center rounded-full border border-zinc-950 bg-zinc-50/75 px-6 text-lg uppercase leading-none shadow-md hover:bg-yellow-300/75"
		>
			<span className="pr-1.5">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 20 20"
					fill="currentColor"
					className="size-4 transition-all group-hover:translate-y-[1px] group-hover:text-yellow-900"
				>
					<path d="M10.75 2.75a.75.75 0 0 0-1.5 0v8.614L6.295 8.235a.75.75 0 1 0-1.09 1.03l4.25 4.5a.75.75 0 0 0 1.09 0l4.25-4.5a.75.75 0 0 0-1.09-1.03l-2.955 3.129V2.75Z" />
					<path d="M3.5 12.75a.75.75 0 0 0-1.5 0v2.5A2.75 2.75 0 0 0 4.75 18h10.5A2.75 2.75 0 0 0 18 15.25v-2.5a.75.75 0 0 0-1.5 0v2.5c0 .69-.56 1.25-1.25 1.25H4.75c-.69 0-1.25-.56-1.25-1.25v-2.5Z" />
				</svg>
			</span>
			<span className="group-hover:text-zinc-950">Download</span>
		</button>
	);
}
