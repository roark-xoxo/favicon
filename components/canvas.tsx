"use client";

import { useAtomValue } from "jotai";
import { store } from "@/lib/stores";
import { Footer } from "@/components/footer";

export function Canvas() {
	const values = useAtomValue(store);
	return (
		<div className="flex h-full w-full flex-col items-center justify-center p-4">
			<div className="flex h-full w-full flex-col items-center justify-center">
				<div
				id="favicon"
					style={{
						borderWidth: `${values.borderWidth}px`,
						borderRadius: `${values.rounded}px`,
						backgroundColor: `${values.bgColor}`,
						borderColor: `${values.borderColor}`,
					}}
					className="flex size-80 items-center justify-center overflow-hidden"
				>
					<span
						style={{
							fontSize: `${values.fontSize}px`,
							rotate: `${values.rotation}deg`,
							color: `${values.textColor}`,
						}}
						className="leading-none"
					>
						{values.text}
					</span>
				</div>
			</div>
			<Footer />
		</div>
	);
}
