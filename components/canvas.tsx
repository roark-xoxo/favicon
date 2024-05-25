"use client";

import { useAtomValue } from "jotai";
import { store } from "@/lib/stores";
import { Footer } from "@/components/footer";
import { DownloadButton } from "@/components/download-button";

export function Canvas() {
	const values = useAtomValue(store);
	return (
		<CanvasWrapper>
			<div className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-between space-y-4">
				<Header />
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
		</CanvasWrapper>
	);
}

export function CanvasWrapper({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<div className="h-full min-h-[100vh] w-full pb-4 pl-72 pr-4 pt-20">
				{children}
			</div>
		</div>
	);
}

export function Header() {
	return (
		<div className="ml-auto">
			<DownloadButton />
		</div>
	);
}
