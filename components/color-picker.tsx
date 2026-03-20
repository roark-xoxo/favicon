"use client";

import { HexAlphaColorPicker, HexColorInput } from "react-colorful";

export function ColorPicker({
	id,
	color,
	onChange,
}: {
	id: string;
	color: string;
	onChange: (color: string) => void;
}) {
	return (
		<div className="space-y-1.5">
			<HexAlphaColorPicker color={color} onChange={onChange} />
			<div className="flex w-full">
				<HexColorInput
					id={id}
					color={color}
					className="w-full border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs tracking-wide text-zinc-100 uppercase placeholder:text-zinc-600 focus:border-amber-600/60 focus:outline-none focus:ring-1 focus:ring-amber-500/25"
					onChange={onChange}
					prefixed={true}
					alpha={true}
				/>
			</div>
		</div>
	);
}
