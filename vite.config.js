import { resolve } from "node:path";
import { defineConfig } from "vite";

export default defineConfig({
	server: {
		open: true,
	},
	build: {
		rollupOptions: {
			input: {
				// Route path mapping
				main: resolve(__dirname, "index.html"),
				// docs: resolve(__dirname, "docs/README.md"), // GitHub Pages requirement
			},
		},
	},
	plugins: [],
});