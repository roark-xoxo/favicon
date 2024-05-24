import { DownloadButton } from "@/components/download-button";

export function Header() {
	return (
		<div className="pb-3 pr-3">
			<header className="flex items-center justify-end space-x-4 rounded-3xl bg-teal-400/65 px-2 py-2 leading-tight dark:bg-slate-900">
				<div>
					<DownloadButton />
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
