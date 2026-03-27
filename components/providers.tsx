"use client";

import { Toast } from "@base-ui/react/toast";
import { ToastRegion } from "@/components/toast-region";
import { Provider } from "jotai";

export const Providers = ({ children }: { children: React.ReactNode }) => {
	return (
		<Provider>
			<Toast.Provider>
				{children}
				<ToastRegion />
			</Toast.Provider>
		</Provider>
	);
};
