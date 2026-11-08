import vue from "@vitejs/plugin-vue";
import { defineConfig } from "vitest/config";

export default defineConfig({
	plugins: [vue()],
	test: {
		environment: "jsdom",
		include: ["src/**/*.test.ts"],
		server: {
			deps: {
				inline: ["vue-sonner"],
			},
		},
	},
});
