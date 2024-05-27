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
				className="relative flex h-4 w-full touch-none select-none items-center"
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
					className="block size-5 rounded-full border border-zinc-50 bg-zinc-950 hover:bg-zinc-800  focus:outline-none focus:ring-2 focus:ring-zinc-900"
					aria-label={id}
				/>
			</Slider.Root>
		</div>
	);
}
