"use client";

import { ColorPicker } from "@/components/color-picker";
import { InputRange } from "@/components/input-range";
import { useAtomValue, useSetAtom } from "jotai";
import { store } from "@/lib/stores";
import { Label } from "@/components/label";
export function Sidebar() {
	const values = useAtomValue(store);
	const setValues = useSetAtom(store);
	return (
		<div
			id="sidebar"
			className="fixed top-4 bottom-4 left-4 z-20"
		>
			<div className="flex h-full w-70 flex-col rounded-sm border border-zinc-700/90 bg-zinc-950 py-3 text-zinc-300 shadow-[0_0_0_1px_rgba(0,0,0,0.5),0_16px_48px_rgba(0,0,0,0.45)]">
				<div className="flex min-h-0 w-full flex-1 overflow-y-auto overflow-x-hidden px-3">
					<form className="flex w-full flex-col gap-0">
						<Section>
							<SectionHeader>Text</SectionHeader>
							<div className="pb-2.5">
								<Label htmlFor="text" className="sr-only">
									Enter Text
								</Label>
								<input
									value={values.text}
									onChange={(event) =>
										setValues((atom) => {
											return {
												...atom,
												text: event.target.value,
											};
										})
									}
									name="text"
									id="text"
									className="w-full border border-zinc-700 bg-zinc-900/80 px-2.5 py-2 text-base tracking-tight text-zinc-100 placeholder:text-zinc-600 focus:border-amber-600/60 focus:outline-none focus:ring-1 focus:ring-amber-500/25"
									placeholder="Enter text"
								/>
							</div>
							<div className="pb-2.5">
								<ColorPicker
									id="text-color-picker"
									color={values.textColor}
									onChange={(color) =>
										setValues((atom) => {
											return {
												...atom,
												textColor: color,
											};
										})
									}
								/>
							</div>
							<div className="pb-2">
								<div className="mb-1 flex items-baseline justify-between gap-2">
									<span className="text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase">
										Size
									</span>
									<span className="text-xs tabular-nums text-amber-500/90">
										{values.fontSize}px
									</span>
								</div>
								<InputRange
									id="text-size"
									value={values.fontSize}
									min={0}
									max={700}
									onValueChange={(value) => {
										setValues((store) => {
											return { ...store, fontSize: value[0] };
										});
									}}
								/>
							</div>
							<div>
								<div className="mb-1 flex items-baseline justify-between gap-2">
									<span className="text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase">
										Rotation
									</span>
									<span className="text-xs tabular-nums text-amber-500/90">
										{values.rotation}°
									</span>
								</div>
								<InputRange
									id="text-rotation"
									value={values.rotation}
									min={0}
									max={360}
									onValueChange={(value) => {
										setValues((store) => {
											return { ...store, rotation: value[0] };
										});
									}}
								/>
							</div>
						</Section>
						<Section>
							<SectionHeader>Border</SectionHeader>
							<div className="pb-2">
								<ColorPicker
									id="border-color-picker"
									color={values.borderColor}
									onChange={(color) =>
										setValues((atom) => {
											return {
												...atom,
												borderColor: color,
											};
										})
									}
								/>
							</div>
							<div className="space-y-1 pb-2">
								<div className="mb-1 flex items-baseline justify-between gap-2">
									<span className="text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase">
										Width
									</span>
									<span className="text-xs tabular-nums text-amber-500/90">
										{values.borderWidth}px
									</span>
								</div>
								<InputRange
									id="text-border-width"
									value={values.borderWidth}
									min={0}
									max={160}
									onValueChange={(value) => {
										setValues((store) => {
											return { ...store, borderWidth: value[0] };
										});
									}}
								/>
							</div>
							<div className="space-y-1">
								<div className="mb-1 flex items-baseline justify-between gap-2">
									<span className="text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase">
										Radius
									</span>
									<span className="text-xs tabular-nums text-amber-500/90">
										{values.rounded}px
									</span>
								</div>
								<InputRange
									id="text-border-radius"
									value={values.rounded}
									min={0}
									max={160}
									onValueChange={(value) => {
										setValues((store) => {
											return { ...store, rounded: value[0] };
										});
									}}
								/>
							</div>
						</Section>
						<Section>
							<SectionHeader>Background</SectionHeader>
							<div>
								<ColorPicker
									id="bg-color-picker"
									color={values.bgColor}
									onChange={(color) =>
										setValues((atom) => {
											return {
												...atom,
												bgColor: color,
											};
										})
									}
								/>
							</div>
						</Section>
					</form>
				</div>
			</div>
		</div>
	);
}

function Section({ children }: { children: React.ReactNode }) {
	return (
		<section className="border-b border-zinc-800/90 py-3 first:pt-0 last:border-b-0 last:pb-0">
			{children}
		</section>
	);
}

function SectionHeader({ children }: { children: React.ReactNode }) {
	return (
		<h2 className="mb-2.5 border-l-2 border-amber-500 pl-2 text-[11px] font-medium tracking-[0.14em] text-amber-500/95 uppercase">
			{children}
		</h2>
	);
}
