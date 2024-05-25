export function MdxWrapper({ children }: { children: React.ReactNode }) {
	return (
		<div className="flex h-full w-full flex-col space-y-4 rounded-xl bg-white/75 p-4 text-lg">
			{children}
		</div>
	);
}
