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
		<div id="sidebar" className="fixed bottom-4 left-4 top-4">
			<div className="flex h-full w-64 flex-col items-center space-y-4 rounded-3xl bg-rose-400/75 py-4 dark:text-zinc-100">
				<div className="flex w-full overflow-scroll px-6">
					<form className="space-y-5">
						<Section>
							<SectionHeader>Text</SectionHeader>
							<div className="pb-2">
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
									className="w-full rounded-xl border border-zinc-950 px-4 text-2xl placeholder:text-zinc-400"
									placeholder="Enter Text"
								/>
							</div>
							<div className="pb-2">
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
							<div className="">
								<div className="flex items-center justify-between">
									<h3>Size</h3>
									<p>{values.fontSize} px</p>
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
							<div className="">
								<div className="flex items-center justify-between">
									<h3>Rotation</h3>
									<p>{values.rotation}°</p>
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
							<div>
								<ColorPicker
									id="background-color-picker"
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
							<div className="space-y-1">
								<div className="flex items-center justify-between">
									<h3>Width</h3>
									<p>{values.borderWidth} px</p>
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
								<div className="flex items-center justify-between">
									<h3>Radius</h3>
									<p>{values.rounded} px</p>
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
							<div className="pb-1">
								<ColorPicker
									id="background-color-picker"
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
	return <section>{children}</section>;
}

function SectionHeader({ children }: { children: React.ReactNode }) {
	return (
		<h2 className="pb-3 text-center text-xl font-bold leading-none">
			{children}
		</h2>
	);
}
