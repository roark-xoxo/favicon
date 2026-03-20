export type IcoImage = {
	size: number;
	pngData: Uint8Array;
};

export function createIcoBuffer(images: readonly IcoImage[]) {
	const headerSize = 6;
	const directoryEntrySize = 16;
	const directorySize = directoryEntrySize * images.length;
	const imageDataSize = images.reduce(
		(total, image) => total + image.pngData.byteLength,
		0
	);
	const buffer = new ArrayBuffer(headerSize + directorySize + imageDataSize);
	const view = new DataView(buffer);
	const bytes = new Uint8Array(buffer);

	view.setUint16(0, 0, true);
	view.setUint16(2, 1, true);
	view.setUint16(4, images.length, true);

	let dataOffset = headerSize + directorySize;

	images.forEach((image, index) => {
		const entryOffset = headerSize + index * directoryEntrySize;

		view.setUint8(entryOffset, image.size === 256 ? 0 : image.size);
		view.setUint8(entryOffset + 1, image.size === 256 ? 0 : image.size);
		view.setUint8(entryOffset + 2, 0);
		view.setUint8(entryOffset + 3, 0);
		view.setUint16(entryOffset + 4, 1, true);
		view.setUint16(entryOffset + 6, 32, true);
		view.setUint32(entryOffset + 8, image.pngData.byteLength, true);
		view.setUint32(entryOffset + 12, dataOffset, true);

		bytes.set(image.pngData, dataOffset);
		dataOffset += image.pngData.byteLength;
	});

	return buffer;
}
