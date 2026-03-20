export function MinusIcon({ classes = "" }: { classes: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			className={classes}
		>
			<path d="M5 12h14" />
		</svg>
	);
}

export function PlusIcon({ classes = "" }: { classes: string }) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			className={classes}
		>
			<path d="M5 12h14" />
			<path d="M12 5v14" />
		</svg>
	);
}
