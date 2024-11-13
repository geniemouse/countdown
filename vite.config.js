import { resolve } from "node:path";
import { defineConfig, normalizePath } from "vite";

export default defineConfig({
	assetsInclude: ["**/*.md"],
	base: "/countdown/",
	build: {
		rollupOptions: {
			input: {
				// Route path mapping
				main: normalizePath(resolve(__dirname, "index.html")),
				// For GitHub Pages
				docs: normalizePath(resolve(__dirname, "docs/README.md")),
			},
		},
	},
	server: {
		open: true,
	},
	plugins: [],
});
