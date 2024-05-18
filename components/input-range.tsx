export function InputRange({
	id,
	value,
	min,
	max,
}: {
	id: string;
	value: number;
	min: number;
	max: number;
}) {
	let internalValue = $state(value);
	return (
		<div className="flex h-auto w-full cursor-text items-center rounded-xl border border-zinc-900 text-left text-sm text-zinc-900">
			<div className="flex w-full">
				<label className="sr-only" for={id}>
					Size
				</label>
				<input
					value={internalValue}
					oninput={(e) => {
						const target = e?.target as HTMLInputElement;
						internalValue = +target?.value;
						value = internalValue;
					}}
					id={id}
					name={id}
					type="range"
					min={min}
					max={max}
					className="w-full bg-transparent"
				/>
			</div>
		</div>
	);
}
