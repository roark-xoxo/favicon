"use client";

import { useState } from "react";
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
		<div className="space-y-2">
			<HexAlphaColorPicker color={color} onChange={onChange} />
			<div className="flex w-full">
				<HexColorInput
					id={id}
					color={color}
					className="w-full rounded-md bg-white px-2"
					onChange={onChange}
					prefixed={true}
					alpha={true}
				/>
			</div>
		</div>
	);
}
