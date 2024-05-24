import type { Metadata } from "next";
import { Jersey_25 } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";

const font = Jersey_25({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
	title: "Favioncs",
	description: "Create your favicon.",
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
					{children}
				</body>
			</Providers>
		</html>
	);
}
