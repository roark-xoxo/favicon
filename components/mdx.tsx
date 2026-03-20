export function MdxWrapper({ children }: { children: React.ReactNode }) {
	return (
		<div className="mdx-content w-full max-w-3xl rounded-sm border border-canvas-800/90 bg-canvas-950/75 p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.45),0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-sm">
			{children}
		</div>
	);
}
