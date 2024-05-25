import Link from "next/link";

export function Nav() {
	return (
		<div className="fixed left-72 right-4 top-4">
			<div className="flex h-12 w-full items-center justify-between rounded-xl bg-yellow-400/65 px-4 py-1 text-2xl">
				<Link href="/" className="text-left leading-none">
					<span>favicon</span>
				</Link>
				<ul className="flex space-x-4">
					<li>
						<Link href="/about">About</Link>
					</li>
					<li>
						<Link href="/history">History</Link>
					</li>
					<li>
						<Link href="/legal">Legal</Link>
					</li>
				</ul>
			</div>
		</div>
	);
}
