import { RoarkLogo } from "@/components/icons";

export function Footer() {
	return (
		<footer className="mt-auto flex">
			<a
				target="_blank"
				href="https://roark.at"
				className="flex flex-col items-center justify-center space-y-2"
			>
				<span className="text-center leading-none text-zinc-950 dark:text-zinc-50">
					built by
				</span>
				<span>
					<RoarkLogo />
				</span>
			</a>
		</footer>
	);
}
