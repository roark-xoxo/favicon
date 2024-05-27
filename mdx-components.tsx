import type { MDXComponents } from "mdx/types";
import type {
	DetailedHTMLProps,
	HTMLAttributes,
	AnchorHTMLAttributes,
	ReactNode,
} from "react";

export function useMDXComponents(components: MDXComponents): MDXComponents {
	return {
		...components,
		h1: H1,
		h2: H2,
		h3: H3,
		p: P,
		a: A,
	};
}

type HeadingProps = DetailedHTMLProps<
	HTMLAttributes<HTMLHeadingElement>,
	HTMLHeadingElement
> & {
	children?: ReactNode;
};

function H1({ children, ...props }: HeadingProps) {
	return (
		<h1 {...props} className="text-5xl font-bold">
			{children}
		</h1>
	);
}

function H2({ children, ...props }: HeadingProps) {
	return (
		<h2 {...props} className="text-4xl font-semibold">
			{children}
		</h2>
	);
}

function H3({ children, ...props }: HeadingProps) {
	return (
		<h3 {...props} className="text-3xl font-medium">
			{children}
		</h3>
	);
}

type PProps = DetailedHTMLProps<
	HTMLAttributes<HTMLParagraphElement>,
	HTMLParagraphElement
> & {
	children?: ReactNode;
};

function P({ children, ...props }: PProps) {
	return (
		<p {...props} className="text-base leading-7">
			{children}
		</p>
	);
}

type AProps = DetailedHTMLProps<
	AnchorHTMLAttributes<HTMLAnchorElement>,
	HTMLAnchorElement
> & {
	children?: ReactNode;
};

function A({ children, ...props }: AProps) {
	return (
		<a {...props} className="text-blue-600 hover:underline">
			{children}
		</a>
	);
}
