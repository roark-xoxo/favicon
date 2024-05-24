import * as LabelRadix from "@radix-ui/react-label";

export function Label({
	children,
	htmlFor,
	className,
}: {
	children: React.ReactNode;
	htmlFor: string;
	className?: string;
}) {
	return (
		<LabelRadix.Root className={className} htmlFor={htmlFor}>
			{children}
		</LabelRadix.Root>
	);
}
