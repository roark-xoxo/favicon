import { Footer } from "@/components/footer";

export function Canvas() {
	return (
		<div className="flex h-full w-full flex-col items-center justify-center p-4">
			<div className="flex h-full w-full flex-col items-center justify-center">
				<div
					style:border-width={`${$store.borderWidth}px`}
					style:border-radius={`${$store.rounded}px`}
					style:background-color={`${$store.bgColor.hex}`}
					style:border-color={`${$store.border.color.hex}`}
					className="flex size-80 items-center justify-center overflow-hidden"
				>
					<span
						style:font-size={`${$store.fontSize}px`}
						style:rotate={`${$store.rotation}deg`}
						style:color={`${$store.textColor.hex}`}
						className="leading-none"
					>
						{$store.text}
					</span>
				</div>
			</div>
			<Footer />
		</div>
	);
}
