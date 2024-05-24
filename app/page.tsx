import { Canvas } from "@/components/canvas";
import { Header, Nav } from "@/components/header";
import { Sidebar } from "@/components/sidebar";

export default function Home() {
	return (
		<div className="flex h-screen flex-col">
			<Nav />
			<div className="flex h-full">
				<Sidebar />
				<div className="flex w-full flex-col">
					<Header />
					<Canvas />
				</div>
			</div>
		</div>
	);
}
