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
		<div className="fixed top-4 right-4 left-78 z-10 [font-family:var(--font-terminal),ui-monospace,monospace]">
			<div className="flex h-10 w-full items-center justify-between rounded-sm border border-zinc-700/90 bg-zinc-950 px-3 text-zinc-300 shadow-[0_0_0_1px_rgba(0,0,0,0.5),0_12px_32px_rgba(0,0,0,0.35)]">
				<Link
					href="/"
					className="text-left leading-none text-amber-500/95 transition-colors hover:text-amber-400"
				>
					{pathname === "/" && (
						<span className="text-xs font-medium tracking-[0.18em] uppercase">
							Favicon
						</span>
					)}
					{pathname !== "/" && (
						<span className="inline-flex items-center gap-1.5 text-xs font-medium tracking-[0.14em] text-zinc-400 uppercase hover:text-amber-500/90">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
								strokeWidth={2}
								stroke="currentColor"
								className="size-3.5 shrink-0 text-amber-500/90"
								aria-hidden
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
								/>
							</svg>
							Back
						</span>
					)}
				</Link>
				<ul className="flex items-center gap-0.5">
					{links.map(({ title, href }) => (
						<li key={href + title}>
							<Link
								className={
									href === pathname
										? "border-l-2 border-amber-500 bg-zinc-900/80 py-1 pr-2.5 pl-2 text-[10px] font-medium tracking-[0.12em] text-amber-500/95 uppercase"
										: "border-l-2 border-transparent py-1 pr-2.5 pl-2 text-[10px] font-medium tracking-[0.12em] text-zinc-500 uppercase transition-colors hover:bg-zinc-900/50 hover:text-zinc-300"
								}
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
