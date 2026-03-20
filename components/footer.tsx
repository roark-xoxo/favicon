import { RoarkLogo } from "@/components/icons";

export function Footer() {
	return (
		<footer className="mt-auto flex">
			<a
				target="_blank"
				href="https://roark.at"
				className="flex flex-col items-center justify-center space-y-2 transition-opacity hover:opacity-90"
			>
				<span className="text-center text-[10px] leading-none font-medium tracking-[0.14em] text-zinc-500 uppercase">
					built by
				</span>
				<span>
					<RoarkLogo />
				</span>
			</a>
		</footer>
	);
}
