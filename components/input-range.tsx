"use client";
import * as Slider from "@radix-ui/react-slider";

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
	// let internalValue = $state(value);
	return (
		<div>
			<form>
				<Slider.Root
					className="relative flex h-5 w-[200px] touch-none select-none items-center"
					defaultValue={[50]}
					max={100}
					step={1}
				>
					<Slider.Track className="bg-zinc-700 relative h-[3px] grow rounded-full">
						<Slider.Range className="absolute h-full rounded-full bg-white" />
					</Slider.Track>
					<Slider.Thumb
						className="shadow-blackA4 hover:bg-indigo-400 focus:shadow-blackA5 block h-5 w-5 rounded-[10px] bg-white shadow-[0_2px_10px] focus:shadow-[0_0_0_5px] focus:outline-none"
						aria-label="Volume"
					/>
				</Slider.Root>
			</form>
			<div className="flex h-auto w-full cursor-text items-center rounded-xl border border-zinc-900 text-left text-sm text-zinc-900">
				<div className="flex w-full">
					<label className="sr-only">Size</label>
					<input
						// value={internalValue}
						// oninput={(e) => {
						// 	const target = e?.target as HTMLInputElement;
						// 	internalValue = +target?.value;
						// 	value = internalValue;
						// }}
						id={id}
						name={id}
						type="range"
						min={min}
						max={max}
						className="w-full bg-transparent"
					/>
				</div>
			</div>
		</div>
	);
}
