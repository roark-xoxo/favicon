export function ColorPicker({ id, value }: { id: string; value: string }) {
	// let internalValue = $state(value);
	// function updateValue(e: Event) {
	// 	const target = e?.target as HTMLInputElement;
	// 	internalValue = target?.value;
	// 	value = internalValue;
	// }

	return (
		<div className="flex h-auto items-center gap-2 rounded-xl border-2 border-zinc-900 text-left text-zinc-900">
			<div className="relative size-[24px] shrink-0 overflow-hidden rounded-xl border border-zinc-500">
				<input
					type="color"
					id={id}
					name={id}
					className="absolute -left-[5px] -top-[5px] size-[34px]"
					// value={internalValue}
					// oninput={updateValue}
				/>
			</div>
			<input
				type="text"
				id={`${id}-input`}
				name={`${id}-input`}
				aria-label="Color picker"
				className="h-full w-full cursor-text rounded-md border-none bg-transparent pr-2 text-zinc-900 transition-colors dark:text-zinc-100"
				// value={internalValue}
				// oninput={updateValue}
			/>
		</div>
	);
}
