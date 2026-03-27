import type { FaviconValues } from "@/lib/stores";

export type FaviconExportMetadata = Pick<
	FaviconValues,
	"appName" | "shortName" | "bgColor"
>;

export type FaviconExportVariant = "standard" | "maskable";

export type FaviconPngAsset = {
	filename: string;
	size: number;
	variant: FaviconExportVariant;
};

export const ICO_ICON_SIZES = [16, 32, 48] as const;

export const PNG_EXPORTS: readonly FaviconPngAsset[] = [
	{
		filename: "favicon-16x16.png",
		size: 16,
		variant: "standard",
	},
	{
		filename: "favicon-32x32.png",
		size: 32,
		variant: "standard",
	},
	{
		filename: "apple-touch-icon.png",
		size: 180,
		variant: "standard",
	},
	{
		filename: "apple-touch-icon-120x120.png",
		size: 120,
		variant: "standard",
	},
	{
		filename: "apple-touch-icon-152x152.png",
		size: 152,
		variant: "standard",
	},
	{
		filename: "apple-touch-icon-167x167.png",
		size: 167,
		variant: "standard",
	},
	{
		filename: "apple-touch-icon-180x180.png",
		size: 180,
		variant: "standard",
	},
	{
		filename: "icon-192x192.png",
		size: 192,
		variant: "standard",
	},
	{
		filename: "icon-512x512.png",
		size: 512,
		variant: "standard",
	},
	{
		filename: "icon-maskable-192x192.png",
		size: 192,
		variant: "maskable",
	},
	{
		filename: "icon-maskable-512x512.png",
		size: 512,
		variant: "maskable",
	},
] as const;

export const MASKABLE_ICON_SCALE = 0.8;

type WebManifestIcon = {
	src: string;
	sizes: string;
	type: "image/png";
	purpose?: "maskable";
};

export function getMaskableIconLayout(size: number) {
	const normalizedSize = Math.max(1, Math.round(size));
	const padding = Math.max(
		0,
		Math.round(normalizedSize * ((1 - MASKABLE_ICON_SCALE) / 2))
	);
	const iconSize = Math.max(1, normalizedSize - padding * 2);

	if (padding * 2 + iconSize !== normalizedSize) {
		throw new Error("Maskable icon layout must fill the target canvas.");
	}

	return {
		iconSize,
		padding,
	};
}

export function getWebManifest(metadata: FaviconExportMetadata) {
	const { appName, bgColor, shortName } = normalizeMetadata(metadata);

	return {
		name: appName,
		short_name: shortName,
		start_url: "/",
		display: "standalone" as const,
		background_color: bgColor,
		theme_color: bgColor,
		icons: getWebManifestIcons(),
	};
}

export function createSiteWebManifest(metadata: FaviconExportMetadata) {
	return `${JSON.stringify(getWebManifest(metadata), null, 2)}\n`;
}

export function createFaviconTags(metadata: FaviconExportMetadata) {
	const { appName, bgColor } = normalizeMetadata(metadata);

	return [
		'<link rel="icon" href="/favicon.ico">',
		'<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">',
		'<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">',
		'<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
		'<link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png">',
		'<link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png">',
		'<link rel="apple-touch-icon" sizes="167x167" href="/apple-touch-icon-167x167.png">',
		'<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon-180x180.png">',
		'<link rel="manifest" href="/site.webmanifest">',
		`<meta name="application-name" content="${escapeHtmlAttribute(appName)}">`,
		`<meta name="apple-mobile-web-app-title" content="${escapeHtmlAttribute(appName)}">`,
		`<meta name="theme-color" content="${escapeHtmlAttribute(bgColor)}">`,
	].join("\n")
		.concat("\n");
}

function getWebManifestIcons(): WebManifestIcon[] {
	return [
		{
			src: "/icon-192x192.png",
			sizes: "192x192",
			type: "image/png",
		},
		{
			src: "/icon-512x512.png",
			sizes: "512x512",
			type: "image/png",
		},
		{
			src: "/icon-maskable-192x192.png",
			sizes: "192x192",
			type: "image/png",
			purpose: "maskable",
		},
		{
			src: "/icon-maskable-512x512.png",
			sizes: "512x512",
			type: "image/png",
			purpose: "maskable",
		},
	];
}

function normalizeMetadata(metadata: FaviconExportMetadata) {
	const appName = normalizeString(metadata.appName, metadata.shortName);
	const shortName = normalizeString(metadata.shortName, appName);

	return {
		appName,
		bgColor: metadata.bgColor,
		shortName,
	};
}

function normalizeString(value: string, fallback: string) {
	const trimmedValue = value.trim();
	if (trimmedValue) {
		return trimmedValue;
	}

	const trimmedFallback = fallback.trim();
	if (trimmedFallback) {
		return trimmedFallback;
	}

	return "favicon";
}

function escapeHtmlAttribute(value: string) {
	return value
		.replaceAll("&", "&amp;")
		.replaceAll('"', "&quot;")
		.replaceAll("<", "&lt;")
		.replaceAll(">", "&gt;");
}
