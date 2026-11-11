// Generates the KTB Health brand assets into ../assets.
//
//   bun run build        (from packages/brand)
//
// - Colors come from the design tokens (packages/tailwind/src/generated/
//   tokens.css), converted from oklch to hex for the SVG/PNG files.
// - The wordmark is converted to outlines with the Geist font, so the SVGs
//   render identically without any font installed.
// - PNGs are rendered with ImageMagick (`magick`, librsvg delegate).
//
// The mark is the logo from the landing page header (website-draft); this
// script only standardizes it into logo files and video-call backgrounds.
import { execFileSync } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import opentype from "opentype.js";

const here = dirname(fileURLToPath(import.meta.url));
const assets = join(here, "..", "assets");
const require = createRequire(import.meta.url);
mkdirSync(join(assets, "meet"), { recursive: true });

// ---------- colors (from tokens) ----------
const tokensCss = readFileSync(
	join(here, "..", "..", "tailwind", "src", "generated", "tokens.css"),
	"utf8",
);
const lightBlock = tokensCss.slice(tokensCss.indexOf(":root"), tokensCss.indexOf(".dark"));
const darkBlock = tokensCss.slice(tokensCss.indexOf(".dark"));
const readToken = (block, name) => {
	const m = block.match(new RegExp(`--ktb-${name}:\\s*oklch\\(([^)]+)\\)`));
	if (!m) throw new Error(`token --ktb-${name} not found`);
	const [l, c, h] = m[1].trim().split(/\s+/).map(Number);
	return { l, c, h: h ?? 0 };
};
const token = (name) => readToken(lightBlock, name);
const tokenDark = (name) => readToken(darkBlock, name);

function oklchToHex({ l, c, h }) {
	const a = c * Math.cos((h * Math.PI) / 180);
	const b = c * Math.sin((h * Math.PI) / 180);
	const l_ = (l + 0.3963377774 * a + 0.2158037573 * b) ** 3;
	const m_ = (l - 0.1055613458 * a - 0.0638541728 * b) ** 3;
	const s_ = (l - 0.0894841775 * a - 1.291485548 * b) ** 3;
	const lin = [
		4.0767416621 * l_ - 3.3077115913 * m_ + 0.2309699292 * s_,
		-1.2684380046 * l_ + 2.6097574011 * m_ - 0.3413193965 * s_,
		-0.0041960863 * l_ - 0.7034186147 * m_ + 1.707614701 * s_,
	];
	const enc = (v) => {
		const x = Math.min(1, Math.max(0, v));
		return x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055;
	};
	return `#${lin.map((v) => Math.round(enc(v) * 255).toString(16).padStart(2, "0")).join("")}`;
}

const primaryTok = token("primary");
// Every color is a design token (light theme unless noted). Nothing is invented.
const COLORS = {
	primary: oklchToHex(primaryTok), // --primary
	ink: oklchToHex(token("foreground")), // --foreground
	white: "#ffffff",
	background: oklchToHex(token("background")), // --background
	accent: oklchToHex(token("accent")), // --accent
	backgroundDark: oklchToHex(tokenDark("background")), // --background (dark theme)
	accentDark: oklchToHex(tokenDark("accent")), // --accent (dark theme)
};

// ---------- mark: the logo in the landing page header ----------
// A rounded tile in the primary color (rounded-lg on a 32px box = 25% radius)
// holding the lucide "book-plus" icon (ISC license) at 20/32 of the tile.
const BOOK_PLUS = [
	"M12 7v6",
	"M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H19a1 1 0 0 1 1 1v18a1 1 0 0 1-1 1H6.5a1 1 0 0 1 0-5H20",
	"M9 10h6",
];
const markSvgInner = ({ tile, icon }) => `
	<rect width="64" height="64" rx="16" fill="${tile}"/>
	<g transform="translate(12 12) scale(${40 / 24})" fill="none" stroke="${icon}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
		${BOOK_PLUS.map((d) => `<path d="${d}"/>`).join("\n\t\t")}
	</g>`;

const mark = { tile: COLORS.primary, icon: COLORS.white };
const markInverse = { tile: COLORS.white, icon: COLORS.primary };

// ---------- wordmark outlines (Geist bold, tracking-tight like the landing) ----------
const fontFile = (w) =>
	require.resolve(`@fontsource/geist/files/geist-latin-${w}-normal.woff`);
const loadFont = (w) => {
	const buf = readFileSync(fontFile(w));
	return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const bold = loadFont(700);

/** Outlines "KTB Health" in bold with -0.025em tracking and font kerning. */
function wordmark(size) {
	const glyphs = bold.stringToGlyphs("KTB Health");
	const scale = size / bold.unitsPerEm;
	const tracking = -0.025 * size;
	let x = 0;
	const parts = [];
	const boxes = [];
	glyphs.forEach((g, i) => {
		const p = g.getPath(x, 0, size);
		if (p.commands.length) {
			parts.push(p.toPathData(2));
			boxes.push(p.getBoundingBox());
		}
		let adv = g.advanceWidth * scale;
		if (i < glyphs.length - 1) adv += bold.getKerningValue(g, glyphs[i + 1]) * scale + tracking;
		x += adv;
	});
	return {
		d: parts.join(" "),
		left: Math.min(...boxes.map((b) => b.x1)),
		width: Math.max(...boxes.map((b) => b.x2)) - Math.min(...boxes.map((b) => b.x1)),
		top: Math.min(...boxes.map((b) => b.y1)),
		bottom: Math.max(...boxes.map((b) => b.y2)),
	};
}

/** Horizontal lockup: tile + "KTB Health" (landing proportions: 32px tile, 18px text, 10px gap). */
function lockup({ inverse = false, markSize = 64 }) {
	const size = markSize * 0.5625;
	const w = wordmark(size);
	const gap = markSize * 0.3125;
	// Like the browser: the text starts at the flex gap (glyph origin, side
	// bearing included) and the baseline sits so the line box (font ascent +
	// descent) is centered on the tile.
	const textX = markSize + gap;
	const baseline = markSize / 2 + ((bold.ascender + bold.descender) / 2) * (size / bold.unitsPerEm);
	const ink = inverse ? COLORS.white : COLORS.ink;
	const m = inverse ? markInverse : mark;
	const k = markSize / 64;
	const svg = `
	<g transform="scale(${k})">${markSvgInner(m)}</g>
	<path transform="translate(${textX.toFixed(2)} ${baseline.toFixed(2)})" d="${w.d}" fill="${ink}"/>`;
	return { svg, width: markSize + gap + w.left + w.width, height: markSize };
}

const write = (rel, content) => writeFileSync(join(assets, rel), content.replace(/^\n/, ""));
const svgDoc = (w, h, body, extra = "") =>
	`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"${extra}>${body}\n</svg>\n`;

// ---------- logo files ----------
write("logo-mark.svg", svgDoc(64, 64, markSvgInner(mark)));
write("logo-mark-inverse.svg", svgDoc(64, 64, markSvgInner(markInverse)));

const h = lockup({ markSize: 64 });
const hw = Math.ceil(h.width) + 2;
write("logo-horizontal.svg", svgDoc(hw, 64, h.svg));
const hi = lockup({ inverse: true, markSize: 64 });
write("logo-horizontal-inverse.svg", svgDoc(hw, 64, hi.svg));

// ---------- Meet backgrounds (1920x1080) ----------
const W = 1920;
const H = 1080;
const MS = 108; // mark height in the lockup
const MX = 120; // left margin
const MY = 104; // top margin

function meet(name, { bg, inverse, decor }) {
	const l = lockup({ inverse, markSize: MS });
	const body = `
	<defs>${bg.defs ?? ""}</defs>
	<rect width="${W}" height="${H}" fill="${bg.fill}"/>
	${decor}
	<g transform="translate(${MX} ${MY})">${l.svg}</g>`;
	const svg = svgDoc(W, H, body);
	write(`meet/${name}.svg`, svg);
	return svg;
}

// Soft ring motif on the right side, away from where the person sits.
const rings = (stroke, op) => `
	<g fill="none" stroke="${stroke}" stroke-opacity="${op}" stroke-width="2">
		<circle cx="1640" cy="300" r="260"/>
		<circle cx="1640" cy="300" r="380"/>
		<circle cx="1640" cy="300" r="500"/>
		<circle cx="1640" cy="300" r="620"/>
	</g>`;

const lightBg = {
	defs: `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${COLORS.background}"/><stop offset="1" stop-color="${COLORS.accent}"/></linearGradient>`,
	fill: "url(#g)",
};
const darkBg = {
	defs: `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${COLORS.backgroundDark}"/><stop offset="1" stop-color="${COLORS.accentDark}"/></linearGradient>`,
	fill: "url(#g)",
};
const primaryBg = { fill: COLORS.primary };

meet("meet-light", { bg: lightBg, inverse: false, decor: rings(COLORS.primary, 0.18) });
meet("meet-dark", { bg: darkBg, inverse: true, decor: rings(COLORS.white, 0.1) });
meet("meet-primary", { bg: primaryBg, inverse: true, decor: rings(COLORS.white, 0.22) });

// ---------- PNG renders ----------
const png = (src, out, size) =>
	execFileSync("magick", ["-background", "none", "-density", "300", join(assets, src), ...size, join(assets, out)], {
		stdio: "inherit",
	});

png("logo-mark.svg", "logo-mark.png", ["-resize", "512x512"]);
png("logo-mark-inverse.svg", "logo-mark-inverse.png", ["-resize", "512x512"]);
png("logo-horizontal.svg", "logo-horizontal.png", ["-resize", "1600x"]);
png("logo-horizontal-inverse.svg", "logo-horizontal-inverse.png", ["-resize", "1600x"]);
for (const n of ["meet-light", "meet-dark", "meet-primary"]) {
	// Backgrounds are opaque; flatten and force exactly 1920x1080.
	execFileSync(
		"magick",
		["-density", "96", join(assets, `meet/${n}.svg`), "-resize", `${W}x${H}!`, "-background", "white", "-flatten", "-strip", join(assets, `meet/${n}.png`)],
		{ stdio: "inherit" },
	);
}

writeFileSync(
	join(assets, "colors.json"),
	`${JSON.stringify({ ...COLORS, source: "packages/tailwind tokens (oklch converted to sRGB hex)" }, null, "\t")}\n`,
);
console.log("brand assets written to", assets, COLORS);
