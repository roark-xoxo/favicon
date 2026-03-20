"use client";

import { useAtomValue } from "jotai";
import { getFaviconGeometry, store } from "@/lib/stores";
import { Footer } from "@/components/footer";
import { DownloadButton } from "@/components/download-button";

export function Canvas() {
	const values = useAtomValue(store);
	const { innerRadius } = getFaviconGeometry(values);

	return (
		<CanvasWrapper>
			<div className="flex min-h-[calc(100vh-6rem)] flex-col items-center justify-between space-y-4">
				<div className="ml-auto">
					<DownloadButton />
				</div>
				<div className="flex h-full w-full flex-col items-center justify-center">
					<div
						id="favicon"
						style={{
							borderWidth: `${values.borderWidth}px`,
							borderRadius: `${values.rounded}px`,
							borderColor: `${values.borderColor}`,
							borderStyle: "solid",
						}}
						className="box-border flex size-80 items-center justify-center"
					>
						<div
							style={{
								backgroundColor: `${values.bgColor}`,
								borderRadius: `${innerRadius}px`,
							}}
							className="flex size-full items-center justify-center overflow-hidden"
						>
							<span
								data-favicon-text="true"
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
				</div>
				<Footer />
			</div>
		</CanvasWrapper>
	);
}

export function CanvasWrapper({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<div className="h-full min-h-[100vh] w-full pt-20 pr-4 pb-4 pl-78">
				{children}
			</div>
		</div>
	);
}
