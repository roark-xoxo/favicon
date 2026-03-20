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
				className="relative flex h-5 w-full touch-none items-center select-none"
				value={[value]}
				id={id}
				name={id}
				min={min}
				max={max}
				step={1}
				onValueChange={onValueChange}
			>
				<Slider.Track className="relative h-px grow bg-zinc-700">
					<Slider.Range className="absolute h-px bg-amber-500/85" />
				</Slider.Track>
				<Slider.Thumb
					className="block size-2.5 border border-amber-500/90 bg-canvas shadow-[0_0_0_1px_rgba(0,0,0,0.4)] hover:border-amber-400 focus-visible:ring-1 focus-visible:ring-amber-500/50 focus-visible:outline-none"
					aria-label={id}
				/>
			</Slider.Root>
		</div>
	);
}
