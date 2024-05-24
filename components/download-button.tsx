"use client";

import { domToPng } from "modern-screenshot";
import JSZip from "jszip";
import { saveAs } from "file-saver";

export function DownloadButton() {
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

		// ICO header
		icoHeader.set([0x00, 0x00, 0x01, 0x00, 0x01, 0x00], 0);

		// Icon directory entry
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

			const zip = new JSZip();
			zip.file("favicon.png", pngDataUrl.split(",")[1], { base64: true });
			zip.file("favicon.ico", icoBuffer);

			zip.generateAsync({ type: "blob" }).then((blob) => {
				saveAs(blob, "favicons.zip");
			});
		} catch (error) {
			console.error("Error creating ICO file:", error);
		}
	};

	return (
		<button
			onClick={downloadFiles}
			className="rounded-full border border-zinc-950 bg-zinc-50 px-6 py-2 uppercase hover:bg-yellow-300"
		>
			Download
		</button>
	);
}
