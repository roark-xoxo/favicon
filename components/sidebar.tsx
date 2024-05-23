import { ColorPicker } from "@/components/color-picker";
import { InputRange } from "@/components/input-range";

export function Sidebar() {
	return (
		<div className="pb-3 pl-3 pr-4">
			<div className="flex h-full w-64 flex-col items-center space-y-4 rounded-3xl bg-rose-400/65 py-4 dark:text-zinc-100">
				<div className="flex w-full overflow-scroll px-6">
					<form className="space-y-6">
						<div>
							<label for="text" className="sr-only">
								Enter Text
							</label>
							<input
								// bind:value={$store.text}
								name="text"
								className="w-full rounded-xl border border-zinc-950 px-4 text-3xl shadow-sm placeholder:text-zinc-400"
								placeholder="Enter Text"
							/>
						</div>
						<section className="space-y-3">
							<div className="flex items-center justify-between">
								<h2 className="text-3xl font-bold leading-none">Text</h2>
							</div>
							<div>
								<ColorPicker
									id="text-color-picker"
									// bind:value={$store.textColor.hex}
								/>
							</div>
							<div className="space-y-1">
								<div className="flex items-center justify-between">
									<h3>Size</h3>
									{/* <p>{$store.fontSize} px</p> */}
								</div>
								<InputRange
									id="text-size"
									// bind:value={$store.fontSize}
									min={0}
									max={700}
								/>
							</div>
							<div className="space-y-1">
								<div className="flex items-center justify-between">
									<h3>Rotation</h3>
									{/* <p>{$store.rotation}°</p> */}
								</div>
								<InputRange
									id="text-rotation"
									// bind:value={$store.rotation}
									min={0}
									max={360}
								/>
							</div>
						</section>
						<section className="space-y-3">
							<h2 className="text-3xl font-bold leading-none">Border</h2>
							<div>
								<ColorPicker
									id="border-color-picker"
									// bind:value={$store.border.color.hex}
								/>
							</div>
							<div className="space-y-1">
								<div className="flex items-center justify-between">
									<h3>Width</h3>
									{/* <p>{$store.borderWidth} px</p> */}
								</div>
								<InputRange
									id="text-border-width"
									// bind:value={$store.borderWidth}
									min={0}
									max={190}
								/>
							</div>
							<div className="space-y-1">
								<div className="flex items-center justify-between">
									<h3>Radius</h3>
									{/* <p>{$store.rounded} px</p> */}
								</div>
								<InputRange
									id="text-border-radius"
									// bind:value={$store.rounded}
									min={0}
									max={200}
								/>
							</div>
						</section>
						<section>
							<h2 className="text-3xl font-bold leading-none">Background</h2>
							<div>
								<ColorPicker
									id="background-color-picker"
									// bind:value={$store.bgColor.hex}
								/>
							</div>
						</section>
					</form>
				</div>
			</div>
		</div>
	);
}
