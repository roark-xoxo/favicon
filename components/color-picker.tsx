"use client";

import { Label } from "@/components/label";
import { HexAlphaColorPicker, HexColorInput } from "react-colorful";

export function ColorPicker({
	id,
	label,
	color,
	onChange,
}: {
	id: string;
	label: string;
	color: string;
	onChange: (color: string) => void;
}) {
	return (
		<div className="space-y-1.5">
			<Label htmlFor={id} className="sr-only">
				{label}
			</Label>
			<HexAlphaColorPicker color={color} onChange={onChange} />
			<div className="flex w-full">
				<HexColorInput
					id={id}
					color={color}
					className="w-full border border-canvas-700 bg-canvas-900 px-2 py-1.5 text-xs tracking-wide text-canvas-100 uppercase placeholder:text-canvas-600 focus:border-amber-600/60 focus:outline-none focus:ring-1 focus:ring-amber-500/25"
					onChange={onChange}
					prefixed={true}
					alpha={true}
					aria-label={label}
				/>
			</div>
		</div>
	);
}
