"use client";
import { usePathname } from "next/navigation";
import Link from "next/link";

export function Nav() {
	const pathname = usePathname();
	const links = [
		{ title: "About", href: "/about" },
		{ title: "History", href: "/history" },
		{ title: "Legal", href: "/legal" },
	];

	return (
		<div className="fixed left-72 right-4 top-4">
			<div className="flex h-12 w-full items-center justify-between rounded-xl bg-yellow-400/65 px-4 py-1 text-3xl">
				<Link href="/" className="text-left leading-none">
					{pathname === "/" && <span>favicon</span>}
					{pathname !== "/" && (
						<span className="inline-flex items-center justify-center">
							<span>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									strokeWidth={3}
									stroke="currentColor"
									className="size-4"
								>
									<path
										strokeLinecap="round"
										strokeLinejoin="round"
										d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
									/>
								</svg>
							</span>
							<span className="pl-1">back</span>
						</span>
					)}
				</Link>
				<ul className="flex space-x-4">
					{links.map(({ title, href }) => (
						<li key={href + title}>
							<Link
								className={href === pathname ? "underline" : "hover:underline"}
								href={href}
							>
								{title}
							</Link>
						</li>
					))}
				</ul>
			</div>
		</div>
	);
}
