import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	base: "/countdown/",
	build: {
		rollupOptions: {
			input: {
				// Route path mapping
				main: resolve(__dirname, "index.html"),
				docs: resolve(__dirname, "docs/README.md"), // For GitHub Pages
			},
		},
	},
	server: {
		open: true,
	},
	plugins: [],
});
