export function Header() {
	return (
		<div className="pb-3 pr-3">
			<header className="flex items-center justify-between space-x-4 rounded-3xl bg-teal-400/65 px-6 pb-2 pt-4 leading-tight dark:bg-slate-900">
				<div className="space-y-1">
					<h1 className="text-4xl leading-6 text-zinc-900 dark:text-zinc-100">
						Create your favicon
					</h1>
					<p className="text-2xl leading-none text-zinc-800 dark:text-zinc-300">
						It is free and fun.
					</p>
				</div>
				<div>
					<button className="rounded-full border border-zinc-950 bg-zinc-50 px-6 py-2 uppercase hover:bg-yellow-300">
						Download
					</button>
				</div>
			</header>
		</div>
	);
}

export function Nav() {
	return (
		<div className="px-3 pb-4 pt-3">
			<div className="flex w-full items-center justify-between rounded-xl bg-yellow-400/65 px-6 py-1 text-2xl">
				<a href="/" className="text-left leading-none">
					<span>fav</span>
					<span>-icon</span>.<span>io</span>
				</a>
				<ul className="flex space-x-4">
					<li>
						<a href="legal">About</a>
					</li>
					<li>
						<a href="legal">History</a>
					</li>
					<li>
						<a href="legal">Legal</a>
					</li>
				</ul>
			</div>
		</div>
	);
}
