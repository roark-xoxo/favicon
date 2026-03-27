import type { FaviconValues } from "@/lib/stores";

export function updateTextMetadata(
	current: FaviconValues,
	text: string
): FaviconValues {
	const appName = current.appNameLinked ? text : current.appName;
	const shortName = current.shortNameLinked ? appName : current.shortName;

	return {
		...current,
		appName,
		shortName,
		text,
	};
}

export function updateAppNameMetadata(
	current: FaviconValues,
	appName: string
): FaviconValues {
	return {
		...current,
		appName,
		appNameLinked: false,
		shortName: current.shortNameLinked ? appName : current.shortName,
	};
}

export function updateShortNameMetadata(
	current: FaviconValues,
	shortName: string
): FaviconValues {
	return {
		...current,
		shortName,
		shortNameLinked: false,
	};
}
