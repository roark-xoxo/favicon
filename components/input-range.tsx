"use client";
import * as Slider from "@radix-ui/react-slider";

export function InputRange({
	id,
	value,
	min,
	max,
	onValueChange,
}: {
	id: string;
	value: number;
	min: number;
	max: number;
	onValueChange: (value: number[]) => void;
}) {
	return (
		<div>
			<Slider.Root
				className="relative flex h-5 w-full touch-none select-none items-center"
				value={[value]}
				id={id}
				name={id}
				min={min}
				max={max}
				step={1}
				onValueChange={onValueChange}
			>
				<Slider.Track className="relative h-2 grow rounded-full border border-zinc-900 bg-zinc-200/25">
					<Slider.Range className="absolute h-full rounded-full bg-zinc-100" />
				</Slider.Track>
				<Slider.Thumb
					className="block h-5 w-5 rounded-[10px] border border-zinc-950 bg-rose-500 shadow-[0_2px_6px] shadow-zinc-400 hover:bg-rose-600 focus:shadow-[0_0_0_5px] focus:shadow-zinc-500 focus:outline-none"
					aria-label={id}
				/>
			</Slider.Root>
		</div>
	);
}
