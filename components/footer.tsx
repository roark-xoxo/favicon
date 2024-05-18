import { RoarkLogo } from "@/components/icons";

export function Footer() {
	return (
		<footer className="flex justify-between px-4">
			<ul className="flex">
				<li>
					<a
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
				</li>
			</ul>
		</footer>
	);
}
