import withMDX from "@next/mdx";

const mdxConfig = withMDX({
	extension: /\.mdx?$/,
	options: {
		remarkPlugins: [],
		rehypePlugins: [],
	},
});

/** @type {import('next').NextConfig} */
const nextConfig = {
	pageExtensions: ["js", "jsx", "ts", "tsx", "md", "mdx"],
	output: "export",
	experimental: {
		mdxRs: true,
	},
};

export default mdxConfig(nextConfig);
