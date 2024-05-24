"use client";

import { useState } from "react";
import { HexColorInput, HexColorPicker } from "react-colorful";

export function ColorPicker({ id, value }: { id: string; value: string }) {
	const [color, setColor] = useState("#aabbcc");
	return (
		<div className="space-y-2">
			<HexColorPicker id={id} color={color} onChange={setColor} />
			<div className="flex w-full">
				<HexColorInput
					color={color}
					className="w-full rounded-md bg-white px-2"
					onChange={setColor}
					prefixed={true}
					alpha={true}
				/>
			</div>
		</div>
	);
}
