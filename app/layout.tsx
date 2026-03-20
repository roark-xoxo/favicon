import type { Metadata } from "next";
import { IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Nav } from "@/components/nav";
import { Sidebar } from "@/components/sidebar";

const fontSans = IBM_Plex_Mono({
	weight: ["400", "500"],
	subsets: ["latin"],
	variable: "--font-sans-base",
});

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
			<body
				className={`${fontSans.variable} bg-zinc-950 font-sans text-zinc-300 antialiased`}
			>
				<Providers>
					<Sidebar />
					<div className="flex w-full flex-col">
						<Nav />
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
