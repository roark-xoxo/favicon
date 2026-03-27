"use client";

import { Toast } from "@base-ui/react/toast";

export function ToastRegion() {
	const { toasts } = Toast.useToastManager();

	return (
		<Toast.Portal>
			<Toast.Viewport className="pointer-events-none fixed right-4 bottom-4 z-50 flex w-[min(22rem,calc(100vw-2rem))] flex-col gap-2 outline-none">
				{toasts.map((toast) => (
					<Toast.Root
						key={toast.id}
						toast={toast}
						className="pointer-events-auto relative rounded-sm border border-amber-600/35 bg-canvas-950/98 p-3 pr-10 shadow-[0_18px_50px_rgba(0,0,0,0.35)] transition-[opacity,transform] duration-200 data-[starting-style]:translate-y-2 data-[starting-style]:opacity-0 data-[ending-style]:translate-y-2 data-[ending-style]:opacity-0"
					>
						<Toast.Content className="space-y-1 overflow-hidden">
							<Toast.Title className="text-[10px] font-medium tracking-[0.14em] text-amber-500/95 uppercase" />
							<Toast.Description className="text-xs leading-5 text-canvas-200" />
							<Toast.Close
								aria-label="Close notification"
								className="absolute top-2 right-2 inline-flex size-6 items-center justify-center rounded-sm border border-canvas-700/80 bg-canvas-900/70 text-canvas-400 transition-colors hover:border-amber-600/50 hover:text-amber-500/90"
							>
								x
							</Toast.Close>
						</Toast.Content>
					</Toast.Root>
				))}
			</Toast.Viewport>
		</Toast.Portal>
	);
}
