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
// The mark is the existing KTB Health product icon (open book + medical
// cross); this script only standardizes it into logo lockups and backgrounds.
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
const token = (name) => {
	const m = lightBlock.match(new RegExp(`--ktb-${name}:\\s*oklch\\(([^)]+)\\)`));
	if (!m) throw new Error(`token --ktb-${name} not found`);
	const [l, c, h] = m[1].trim().split(/\s+/).map(Number);
	return { l, c, h: h ?? 0 };
};

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
const COLORS = {
	primary: oklchToHex(primaryTok),
	ink: oklchToHex(token("foreground")),
	white: "#ffffff",
	accent: oklchToHex(token("accent")),
	// Brand-hue tints/shades derived from the primary hue (same chroma family).
	deep: oklchToHex({ l: 0.22, c: 0.05, h: primaryTok.h }),
	deepAlt: oklchToHex({ l: 0.3, c: 0.09, h: primaryTok.h }),
	soft: oklchToHex({ l: 0.985, c: 0.008, h: primaryTok.h }),
};

// ---------- mark (the product icon, on a 64 grid) ----------
// Same geometry as the 32 grid favicon, scaled x2.
const markSvgInner = ({ tile, book }) => `
	<rect width="64" height="64" rx="14" fill="${tile}"/>
	<path d="M32 14c-6.4 0-11 2-14 5.2V48c3-3.2 7.6-5.2 14-5.2s11 2 14 5.2V19.2C43 16 38.4 14 32 14z" fill="${book}" opacity=".95"/>
	<path d="M32 14v28.8" stroke="${tile}" stroke-width="3.2"/>
	<path d="M41 9v10M36 14h10" stroke="${tile}" stroke-width="9" stroke-linecap="round"/>
	<path d="M41 9v10M36 14h10" stroke="${book}" stroke-width="3.6" stroke-linecap="round"/>`;

const mark = { tile: COLORS.primary, book: COLORS.white };
const markInverse = { tile: COLORS.white, book: COLORS.primary };

// ---------- wordmark outlines (Geist) ----------
const fontFile = (w) =>
	require.resolve(`@fontsource/geist/files/geist-latin-${w}-normal.woff`);
const loadFont = (w) => {
	const buf = readFileSync(fontFile(w));
	return opentype.parse(buf.buffer.slice(buf.byteOffset, buf.byteOffset + buf.byteLength));
};
const bold = loadFont(700);
const regular = loadFont(400);

/** Returns { d, width, top, bottom } of "KTB" (bold) + " Health" (regular). */
function wordmark(size) {
	const ktb = bold.getPath("KTB", 0, 0, size);
	const gap = size * 0.28;
	const x2 = bold.getAdvanceWidth("KTB", size) + gap;
	const health = regular.getPath("Health", x2, 0, size);
	const b1 = ktb.getBoundingBox();
	const b2 = health.getBoundingBox();
	return {
		ktb: ktb.toPathData(2),
		health: health.toPathData(2),
		width: Math.max(b1.x2, b2.x2) - Math.min(b1.x1, b2.x1),
		top: Math.min(b1.y1, b2.y1),
		bottom: Math.max(b1.y2, b2.y2),
		left: Math.min(b1.x1, b2.x1),
	};
}

/** Horizontal lockup group at scale; returns { svg (group), width, height }. */
function lockup({ inverse = false, markSize = 64 }) {
	const fontSize = markSize * 0.62;
	const w = wordmark(fontSize);
	const textH = w.bottom - w.top;
	const gap = markSize * 0.3;
	const textX = markSize + gap - w.left;
	// Center the glyph box vertically against the mark.
	const baseline = (markSize - textH) / 2 - w.top;
	const ink = inverse ? COLORS.white : COLORS.ink;
	const m = inverse ? markInverse : mark;
	const k = markSize / 64;
	const svg = `
	<g transform="scale(${k})">${markSvgInner(m)}</g>
	<g transform="translate(${textX.toFixed(2)} ${baseline.toFixed(2)})">
		<path d="${w.ktb}" fill="${ink}"/>
		<path d="${w.health}" fill="${inverse ? COLORS.white : COLORS.ink}" opacity="${inverse ? 0.88 : 0.82}"/>
	</g>`;
	return { svg, width: markSize + gap + w.width, height: markSize };
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
	defs: `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${COLORS.soft}"/><stop offset="1" stop-color="${COLORS.accent}"/></linearGradient>`,
	fill: "url(#g)",
};
const darkBg = {
	defs: `<linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${COLORS.deep}"/><stop offset="1" stop-color="${COLORS.deepAlt}"/></linearGradient>`,
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
