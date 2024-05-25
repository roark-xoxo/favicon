import { CanvasWrapper } from "@/components/canvas";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
	return (
		<CanvasWrapper>
			<div className="flex h-full w-full flex-col space-y-4 rounded-xl bg-white/75 p-4 text-lg">
				{children}
			</div>
		</CanvasWrapper>
	);
}
