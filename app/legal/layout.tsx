import { CanvasWrapper } from "@/components/canvas";
import { MdxWrapper } from "@/components/mdx";

export default function MdxLayout({ children }: { children: React.ReactNode }) {
	return (
		<CanvasWrapper>
			<MdxWrapper>{children}</MdxWrapper>
		</CanvasWrapper>
	);
}
