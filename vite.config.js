import { resolve } from "node:path";
import { defineConfig, normalizePath } from "vite";
import { viteStaticCopy } from "vite-plugin-static-copy";

export default defineConfig({
	base: "/countdown/",
	build: {
		rollupOptions: {
			input: {
				// Route path mapping
				main: normalizePath(resolve(__dirname, "index.html")),
				// @todo: For GitHub Pages, use markdown plugin?
				// docs: normalizePath(resolve(__dirname, "docs/README.md")),
			},
		},
	},
	server: {
		open: true,
	},
	plugins: [
		viteStaticCopy({
			targets: [
				// Copy-over markdown documents used by GitHub Pages;
				// can't be part of Vite's `public` directory & work for GH
				{
					src: "./docs/**.md",
					dest: "./docs/",
				},
			],
		}),
	],
});
