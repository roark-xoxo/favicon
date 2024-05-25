import type { Metadata } from "next";
import { Jersey_25 } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/nav";
import { Sidebar } from "@/components/sidebar";

const font = Jersey_25({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
	title: "FAVICON",
	description: "Create your own favicon.",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<Providers>
				<body
					className={
						font.className + " bg-zinc-50 antialiased dark:bg-zinc-800"
					}
				>
					<Sidebar />
					<div className="flex w-full flex-col">
						<Nav />
						{children}
					</div>
				</body>
			</Providers>
		</html>
	);
}
