import { defineConfig } from "@terrazzo/cli";
import css from "@terrazzo/plugin-css";

/**
 * Emit token values verbatim. The parser normalizes colors through
 * Culori which loses precision (oklch chroma/hue drift + unwanted
 * color-gamut media queries). originalValue keeps the raw string.
 */
const rawValue = (t: { originalValue?: unknown; $value?: unknown }) => {
	const ov = t.originalValue;
	if (typeof ov === "string") return ov;
	if (typeof ov === "object" && ov !== null && "$value" in ov) {
		const v = (ov as { $value?: unknown }).$value;
		if (typeof v === "string") return v;
	}
	return typeof t.$value === "string" ? t.$value : undefined;
};

export default defineConfig({
	tokens: ["tokens/tokens.json"],
	outDir: "./src/generated",
	plugins: [
		css({
			filename: "tokens.css",
			variableName: (t) =>
				`ktb-${t.id.split(".").pop()!.replace(/_/g, "-")}`,
			modeSelectors: [{ mode: "dark", selectors: [".dark"] }],
			transform: rawValue,
		}),
	],
});
