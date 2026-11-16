"use client";

import * as React from "react";
import { cn } from "cn";
import {
	Bold,
	Heading2,
	Heading3,
	Italic,
	Link2,
	Link2Off,
	List,
	ListOrdered,
	Underline,
} from "lucide-react";
import {
	BaseParagraphPlugin,
	deserializeHtml,
	createSlateEditor,
	type SlateEditor,
	type TElement,
	type Value,
} from "platejs";
import {
	Plate,
	PlateContent,
	PlateElement,
	ParagraphPlugin,
	useEditorRef,
	useEditorSelector,
	usePlateEditor,
	type PlateEditor,
} from "platejs/react";
import {
	BaseBoldPlugin,
	BaseH2Plugin,
	BaseH3Plugin,
	BaseItalicPlugin,
	BaseUnderlinePlugin,
} from "@platejs/basic-nodes";
import {
	BoldPlugin,
	H2Plugin,
	H3Plugin,
	ItalicPlugin,
	UnderlinePlugin,
} from "@platejs/basic-nodes/react";
import { BaseLinkPlugin, unwrapLink, upsertLink } from "@platejs/link";
import { LinkPlugin } from "@platejs/link/react";
import { BaseListPlugin, ListStyleType, someList, toggleList } from "@platejs/list";
import { ListPlugin } from "@platejs/list/react";

/* ------------------------------------------------------------------------ */
/* HTML (de)serialization helpers                                            */
/* ------------------------------------------------------------------------ */

/**
 * Structural node shape used by the serializer. Covers the supported subset:
 * `p`, `h2`, `h3`, inline `a`, and `p` nodes carrying `listStyleType` /
 * `indent` / `listStart` (Plate represents list items as styled paragraphs).
 */
export type RichTextNode = {
	type?: string;
	text?: string;
	children?: RichTextNode[];
	url?: string;
	target?: string;
	listStyleType?: string;
	indent?: number;
	listStart?: number;
	[key: string]: unknown;
};

const ALLOWED_MARKS = ["bold", "italic", "underline"] as const;
const LIST_ITEM_TYPES = new Set([
	"disc",
	"circle",
	"square",
	"disclosure-open",
	"disclosure-closed",
]);
const LIST_STYLE_TYPE_RE = /^[a-zA-Z-]+$/;

const HTML_ESCAPES: Record<string, string> = {
	"&": "&amp;",
	"<": "&lt;",
	">": "&gt;",
	'"': "&quot;",
	"'": "&#39;",
};

function escapeHtml(value: string): string {
	return value.replace(/[&<>"']/g, (char) => HTML_ESCAPES[char] ?? char);
}

/**
 * Only absolute http(s) and mailto URLs survive. Relative URLs, protocol-
 * relative URLs, `javascript:`, `data:` and every other scheme return null.
 */
export function sanitizeRichTextHref(url: unknown): string | null {
	if (typeof url !== "string") return null;
	const trimmed = url.trim();
	if (!trimmed || trimmed.length > 2048) return null;
	if (/^(https?:\/\/|mailto:)/i.test(trimmed)) return trimmed;
	return null;
}

function serializeTextNode(node: RichTextNode): string {
	let html = escapeHtml(node.text ?? "").replace(/\n/g, "<br>");
	if (node.underline) html = `<u>${html}</u>`;
	if (node.italic) html = `<em>${html}</em>`;
	if (node.bold) html = `<strong>${html}</strong>`;
	return html;
}

function serializeInline(nodes: RichTextNode[] | undefined): string {
	if (!Array.isArray(nodes)) return "";
	let html = "";
	for (const node of nodes) {
		if (!node || typeof node !== "object") continue;
		if (typeof node.text === "string") {
			html += serializeTextNode(node);
			continue;
		}
		if (node.type === "a") {
			const href = sanitizeRichTextHref(node.url);
			const inner = serializeInline(node.children);
			html += href
				? `<a href="${escapeHtml(href)}" target="_blank" rel="noopener noreferrer">${inner}</a>`
				: inner;
			continue;
		}
		// Unknown inline elements are unwrapped to their children.
		html += serializeInline(node.children);
	}
	return html;
}

function isListItem(node: RichTextNode | undefined): node is RichTextNode {
	return (
		!!node &&
		typeof node === "object" &&
		typeof node.listStyleType === "string" &&
		LIST_STYLE_TYPE_RE.test(node.listStyleType)
	);
}

function listDepth(node: RichTextNode): number {
	return typeof node.indent === "number" && node.indent > 0 ? node.indent : 1;
}

function listTag(listStyleType: string | undefined): "ul" | "ol" {
	return listStyleType && LIST_ITEM_TYPES.has(listStyleType) ? "ul" : "ol";
}

type HtmlListItem = { content: string; sub: HtmlList[] };
type HtmlList = { tag: "ul" | "ol"; start?: number; items: HtmlListItem[] };

function renderHtmlList(list: HtmlList): string {
	const attrs = list.tag === "ol" && list.start ? ` start="${list.start}"` : "";
	let html = `<${list.tag}${attrs}>`;
	for (const item of list.items) {
		html += `<li>${item.content}`;
		for (const sub of item.sub) html += renderHtmlList(sub);
		html += "</li>";
	}
	return `${html}</${list.tag}>`;
}

/**
 * Serialize a run of consecutive list-item paragraphs into nested
 * `<ul>`/`<ol>` markup, splitting whenever the list style type changes and
 * nesting deeper `indent` values inside the previous `<li>`.
 */
function serializeListRun(items: RichTextNode[]): string {
	const base = Math.min(...items.map(listDepth));
	const roots: HtmlList[] = [];
	const stack: { depth: number; list: HtmlList }[] = [];

	for (const item of items) {
		const depth = listDepth(item) - base;
		const tag = listTag(item.listStyleType);
		while (stack.length) {
			const top = stack[stack.length - 1];
			if (top.depth > depth || (top.depth === depth && top.list.tag !== tag)) {
				stack.pop();
			} else break;
		}
		const top = stack[stack.length - 1];
		if (!top || top.depth !== depth) {
			const list: HtmlList = { tag, items: [] };
			if (typeof item.listStart === "number" && item.listStart > 1) {
				list.start = item.listStart;
			}
			// Attach to the nearest open ancestor list, or to the root.
			let attached = false;
			for (let i = stack.length - 1; i >= 0; i--) {
				if (stack[i].depth < depth) {
					const parentItem = stack[i].list.items[stack[i].list.items.length - 1];
					if (parentItem) {
						parentItem.sub.push(list);
						attached = true;
						break;
					}
				}
			}
			if (!attached) roots.push(list);
			stack.push({ depth, list });
		}
		stack[stack.length - 1].list.items.push({
			content: serializeInline(item.children),
			sub: [],
		});
	}
	return roots.map(renderHtmlList).join("");
}

function hasOnlyInlineChildren(node: RichTextNode): boolean {
	const children = node.children;
	if (!Array.isArray(children) || children.length === 0) return true;
	return children.every(
		(child) =>
			!!child &&
			typeof child === "object" &&
			(typeof child.text === "string" ||
				!child.type ||
				child.type === "a"),
	);
}

function serializeBlock(node: RichTextNode | undefined): string {
	if (!node || typeof node !== "object") return "";
	if (typeof node.text === "string") {
		return `<p>${serializeTextNode(node)}</p>`;
	}
	const inner = serializeInline(node.children);
	switch (node.type) {
		case "h2":
			return `<h2>${inner}</h2>`;
		case "h3":
			return `<h3>${inner}</h3>`;
		case "p":
			return `<p>${inner}</p>`;
		case "a":
			return `<p>${serializeInline([node])}</p>`;
		default:
			break;
	}
	if (hasOnlyInlineChildren(node)) return `<p>${inner}</p>`;
	// Unknown block-level element: serialize each child as its own block.
	return (node.children ?? [])
		.filter((child): child is RichTextNode => !!child && typeof child === "object")
		.map(serializeBlock)
		.join("");
}

/**
 * Serialize a Plate/Slate value to sanitized HTML. Only the supported node
 * set is emitted (`p`, `h2`, `h3`, `a`, lists, `strong`/`em`/`u` marks);
 * every other node is unwrapped or dropped, and link hrefs are restricted
 * to http(s)/mailto.
 */
export function richTextToHtml(value: Value | RichTextNode[]): string {
	const nodes = (Array.isArray(value) ? value : []) as RichTextNode[];
	let html = "";
	let index = 0;
	while (index < nodes.length) {
		const node = nodes[index];
		if (isListItem(node)) {
			const run: RichTextNode[] = [];
			while (index < nodes.length && isListItem(nodes[index])) {
				run.push(nodes[index]);
				index += 1;
			}
			html += serializeListRun(run);
		} else {
			html += serializeBlock(node);
			index += 1;
		}
	}
	// A single empty paragraph is the canonical empty document.
	return html === "<p></p>" ? "" : html;
}

/* ------------------------------ HTML -> value ---------------------------- */

const DROP_TAGS = new Set([
	"SCRIPT",
	"STYLE",
	"NOSCRIPT",
	"TEMPLATE",
	"SVG",
	"MATH",
	"IFRAME",
	"OBJECT",
	"EMBED",
	"APPLET",
	"FRAME",
	"FRAMESET",
	"LINK",
	"META",
	"BASE",
]);

const BLOCK_CHILD_TAGS = new Set([
	"P",
	"DIV",
	"H1",
	"H2",
	"H3",
	"H4",
	"H5",
	"H6",
	"BLOCKQUOTE",
	"PRE",
	"SECTION",
	"ARTICLE",
	"HEADER",
	"FOOTER",
	"MAIN",
	"ASIDE",
	"NAV",
	"FIGURE",
	"FIGCAPTION",
	"DL",
	"DD",
	"DT",
	"TABLE",
	"THEAD",
	"TBODY",
	"TFOOT",
	"TR",
	"TD",
	"TH",
	"FORM",
	"FIELDSET",
]);

function dropUnsafeElements(root: ParentNode): void {
	for (const element of Array.from(root.querySelectorAll("*"))) {
		if (DROP_TAGS.has(element.tagName)) element.remove();
	}
}

/**
 * Plate's list plugin expects `<li>` elements to carry `data-indent` and
 * `data-list-style-type` (normally produced by its paste-time
 * `transformData`). Replicate that preprocessing here so pasted/loaded HTML
 * lists deserialize into list paragraphs.
 */
function prepareListItems(body: HTMLElement): void {
	// Hoist nested lists out of their <li> so they become siblings.
	for (const li of Array.from(body.querySelectorAll("li"))) {
		for (const child of Array.from(li.children)) {
			if (child.tagName === "UL" || child.tagName === "OL") {
				li.parentNode?.insertBefore(child, li.nextSibling);
			}
		}
	}
	for (const li of Array.from(body.querySelectorAll("li"))) {
		// Unwrap block-level children so marks/links stay inline.
		for (const child of Array.from(li.children)) {
			if (BLOCK_CHILD_TAGS.has(child.tagName)) {
				child.replaceWith(...Array.from(child.childNodes));
			}
		}
		let indent = 0;
		let parent = li.parentElement;
		while (parent && parent !== body) {
			if (parent.tagName === "UL" || parent.tagName === "OL") indent += 1;
			parent = parent.parentElement;
		}
		if (indent > 0) li.setAttribute("data-indent", String(indent));
		const explicit =
			li.getAttribute("data-list-style-type") ||
			(li as HTMLElement).style?.listStyleType ||
			"";
		const listParent = li.closest("ul, ol");
		const inherited =
			(listParent as HTMLElement | null)?.style?.listStyleType ||
			(listParent?.tagName === "UL"
				? "disc"
				: listParent?.tagName === "OL"
					? "decimal"
					: "");
		const listStyleType = explicit || inherited;
		if (listStyleType) li.setAttribute("data-list-style-type", listStyleType);
	}
}

const LINK_OPTIONS: {
	allowedSchemes: string[];
	isUrl: (url: string) => boolean;
} = {
	allowedSchemes: ["http", "https", "mailto"],
	// The default `isUrl` rejects `mailto:` — restrict to the supported
	// absolute schemes instead.
	isUrl: (url: string) => /^\s*(https?:\/\/|mailto:)/i.test(url),
};

const STATIC_PLUGINS = [
	BaseParagraphPlugin,
	BaseH2Plugin,
	BaseH3Plugin,
	BaseBoldPlugin,
	BaseItalicPlugin,
	BaseUnderlinePlugin,
	BaseLinkPlugin.configure({ options: LINK_OPTIONS }),
	BaseListPlugin,
];

let sharedStaticEditor: SlateEditor | null = null;

function getStaticEditor(): SlateEditor {
	if (!sharedStaticEditor) {
		sharedStaticEditor = createSlateEditor({
			plugins: STATIC_PLUGINS,
			value: [{ type: "p", children: [{ text: "" }] }],
		});
	}
	return sharedStaticEditor;
}

const EMPTY_VALUE: Value = [{ type: "p", children: [{ text: "" }] }];

/** Path to the first text node, used for the initial caret position. */
function firstTextPath(nodes: RichTextNode[], base: number[] = []): number[] {
	for (let index = 0; index < nodes.length; index += 1) {
		const node = nodes[index];
		if (!node || typeof node !== "object") continue;
		if (typeof node.text === "string") return [...base, index];
		if (Array.isArray(node.children) && node.children.length > 0) {
			const path = firstTextPath(node.children, [...base, index]);
			if (path.length > 0) return path;
		}
	}
	return [];
}

function sanitizeChildren(children: RichTextNode[] | undefined): RichTextNode[] {
	const out: RichTextNode[] = [];
	if (!Array.isArray(children)) return out;
	for (const child of children) {
		if (!child || typeof child !== "object") continue;
		if (typeof child.text === "string") {
			const text: RichTextNode = { text: child.text };
			for (const mark of ALLOWED_MARKS) {
				if (child[mark]) text[mark] = true;
			}
			out.push(text);
			continue;
		}
		if (child.type === "a") {
			const href = sanitizeRichTextHref(child.url);
			const linkChildren = sanitizeChildren(child.children);
			if (href && linkChildren.length > 0) {
				const link: RichTextNode = {
					type: "a",
					url: href,
					children: linkChildren,
				};
				if (typeof child.target === "string") link.target = child.target;
				out.push(link);
			} else {
				// Unsafe or empty link: keep the text, drop the anchor.
				out.push(...linkChildren);
			}
			continue;
		}
		// Unknown elements are unwrapped to their sanitized children.
		out.push(...sanitizeChildren(child.children));
	}
	return out;
}

function normalizeRichTextValue(nodes: unknown): Value {
	if (!Array.isArray(nodes)) return EMPTY_VALUE.map((n) => ({ ...n }));
	const out: RichTextNode[] = [];
	for (const node of nodes as RichTextNode[]) {
		if (!node || typeof node !== "object") continue;
		if (typeof node.text === "string") {
			out.push({ type: "p", children: sanitizeChildren([node]) });
			continue;
		}
		const type = node.type === "h2" || node.type === "h3" ? node.type : "p";
		const children = sanitizeChildren(node.children);
		const element: RichTextNode = {
			type,
			children: children.length > 0 ? children : [{ text: "" }],
		};
		if (type === "p") {
			if (
				typeof node.listStyleType === "string" &&
				LIST_STYLE_TYPE_RE.test(node.listStyleType)
			) {
				element.listStyleType = node.listStyleType;
			}
			if (typeof node.indent === "number") element.indent = node.indent;
			if (typeof node.listStart === "number") element.listStart = node.listStart;
		}
		out.push(element);
	}
	return (out.length > 0 ? out : EMPTY_VALUE) as Value;
}

/**
 * Parse sanitized HTML into a Plate/Slate value. Unknown tags and attributes
 * (including event handlers) are dropped; only the supported node set is
 * preserved. Requires a DOM (`document`/`DOMParser`) — returns an empty
 * document on the server.
 */
export function htmlToRichText(html: string): Value {
	if (typeof html !== "string" || !html.trim()) {
		return EMPTY_VALUE.map((node) => ({ ...node }));
	}
	if (typeof document === "undefined" || typeof DOMParser === "undefined") {
		return EMPTY_VALUE.map((node) => ({ ...node }));
	}
	try {
		const doc = new DOMParser().parseFromString(html, "text/html");
		dropUnsafeElements(doc);
		prepareListItems(doc.body);
		const nodes = deserializeHtml(getStaticEditor(), {
			element: doc.body.innerHTML,
		});
		return normalizeRichTextValue(nodes);
	} catch {
		return EMPTY_VALUE.map((node) => ({ ...node }));
	}
}

/* --------------------------------- editor --------------------------------- */

const EDITOR_PLUGINS = [
	ParagraphPlugin,
	H2Plugin,
	H3Plugin,
	BoldPlugin,
	ItalicPlugin,
	UnderlinePlugin,
	LinkPlugin.configure({ options: LINK_OPTIONS }),
	ListPlugin,
];

// Plate passes the full slate-react render props (element, attributes, path,
// api, plugin context, …); we only rely on a few of them.
type AnyProps = Record<string, any>;
type RichTextElementProps = AnyProps & {
	element: TElement & RichTextNode;
};

function ParagraphElement(props: RichTextElementProps) {
	const isListItem = typeof props.element?.listStyleType === "string";
	return (
		<PlateElement
			{...(props as any)}
			as={isListItem ? "div" : "p"}
			className={cn("m-0", props.className)}
		/>
	);
}

function Heading2Element(props: RichTextElementProps) {
	return (
		<PlateElement
			{...(props as any)}
			as="h2"
			className={cn("mt-3 mb-1 text-lg font-semibold first:mt-0", props.className)}
		/>
	);
}

function Heading3Element(props: RichTextElementProps) {
	return (
		<PlateElement
			{...(props as any)}
			as="h3"
			className={cn("mt-2 mb-1 text-base font-semibold first:mt-0", props.className)}
		/>
	);
}

function LinkElement(props: RichTextElementProps) {
	const href = sanitizeRichTextHref(props.element?.url);
	const attributes = {
		...props.attributes,
		href: href ?? undefined,
		target: "_blank",
		rel: "noopener noreferrer",
	};
	if (!href) {
		return (
			<PlateElement
				{...(props as any)}
				as="span"
				attributes={attributes}
				className={props.className}
			/>
		);
	}
	return (
		<PlateElement
			{...(props as any)}
			as="a"
			attributes={attributes}
			className={cn(
				"text-primary underline underline-offset-2 hover:text-primary/80",
				props.className,
			)}
		/>
	);
}

const EDITOR_COMPONENTS = {
	p: ParagraphElement,
	h2: Heading2Element,
	h3: Heading3Element,
	a: LinkElement,
};

function renderRichTextLeaf({
	attributes,
	children,
	leaf,
}: {
	attributes?: Record<string, unknown>;
	children?: React.ReactNode;
	leaf?: Record<string, unknown>;
}) {
	let content = children;
	if (leaf?.underline) content = <u>{content}</u>;
	if (leaf?.italic) content = <em>{content}</em>;
	if (leaf?.bold) content = <strong>{content}</strong>;
	return <span {...attributes}>{content}</span>;
}

function isDocumentEmpty(editor: PlateEditor): boolean {
	return editor.children.every((node) => {
		if (typeof node !== "object" || node === null || Array.isArray(node)) return true;
		const children = (node as TElement).children;
		if (!Array.isArray(children) || children.length !== 1) return false;
		const only = children[0] as { text?: unknown };
		return typeof only?.text === "string" && only.text.length === 0;
	});
}

/* -------------------------------- toolbar --------------------------------- */

function ToolbarButton({
	pressed,
	onClick,
	label,
	icon: Icon,
	disabled,
}: {
	pressed?: boolean;
	onClick: () => void;
	label: string;
	icon: React.ComponentType<{ className?: string }>;
	disabled?: boolean;
}) {
	return (
		<button
			type="button"
			aria-pressed={pressed}
			aria-label={label}
			title={label}
			disabled={disabled}
			onMouseDown={(event) => event.preventDefault()}
			onClick={onClick}
			className={cn(
				"inline-flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors",
				"hover:bg-accent hover:text-foreground",
				"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
				"aria-pressed:bg-accent aria-pressed:text-foreground",
				"disabled:pointer-events-none disabled:opacity-50",
			)}
		>
			<Icon className="size-4" />
		</button>
	);
}

function useMarkActive(mark: string): boolean {
	return useEditorSelector(
		(editor) => editor.api.hasMark(mark),
		[mark],
	);
}

function useBlockActive(type: string): boolean {
	return useEditorSelector(
		(editor) =>
			editor.api.some({
				at: editor.selection ?? undefined,
				match: { type },
			}),
		[type],
	);
}

function useListActive(listStyleType: ListStyleType): boolean {
	return useEditorSelector(
		(editor) => someList(editor, listStyleType),
		[listStyleType],
	);
}

function useLinkState(): { active: boolean; url: string | null } {
	return useEditorSelector((editor) => {
		const above = editor.api.above({
			at: editor.selection ?? undefined,
			match: { type: editor.getType("a") },
		});
		const node = above?.[0] as (TElement & { url?: string }) | undefined;
		return { active: !!above, url: node?.url ?? null };
	}, []);
}

function Toolbar({ disabled }: { disabled?: boolean }) {
	const editor = useEditorRef();
	const bold = useMarkActive("bold");
	const italic = useMarkActive("italic");
	const underline = useMarkActive("underline");
	const h2 = useBlockActive("h2");
	const h3 = useBlockActive("h3");
	const bullets = useListActive(ListStyleType.Disc);
	const numbers = useListActive(ListStyleType.Decimal);
	const link = useLinkState();
	const [linkDraft, setLinkDraft] = React.useState<string | null>(null);

	const applyLink = () => {
		const url = sanitizeRichTextHref(linkDraft);
		if (!url) return;
		upsertLink(editor, { url });
		setLinkDraft(null);
	};

	const removeLink = () => {
		unwrapLink(editor);
		setLinkDraft(null);
	};

	return (
		<div
			role="toolbar"
			aria-label="Formatting"
			className="flex flex-wrap items-center gap-0.5 border-b border-border px-2 py-1.5"
		>
			<ToolbarButton
				pressed={h2}
				disabled={disabled}
				label="Heading 2"
				icon={Heading2}
				onClick={() => editor.tf.toggleBlock("h2")}
			/>
			<ToolbarButton
				pressed={h3}
				disabled={disabled}
				label="Heading 3"
				icon={Heading3}
				onClick={() => editor.tf.toggleBlock("h3")}
			/>
			<span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
			<ToolbarButton
				pressed={bold}
				disabled={disabled}
				label="Bold"
				icon={Bold}
				onClick={() => editor.tf.toggleMark("bold")}
			/>
			<ToolbarButton
				pressed={italic}
				disabled={disabled}
				label="Italic"
				icon={Italic}
				onClick={() => editor.tf.toggleMark("italic")}
			/>
			<ToolbarButton
				pressed={underline}
				disabled={disabled}
				label="Underline"
				icon={Underline}
				onClick={() => editor.tf.toggleMark("underline")}
			/>
			<span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
			<ToolbarButton
				pressed={bullets}
				disabled={disabled}
				label="Bulleted list"
				icon={List}
				onClick={() => toggleList(editor, { listStyleType: ListStyleType.Disc })}
			/>
			<ToolbarButton
				pressed={numbers}
				disabled={disabled}
				label="Numbered list"
				icon={ListOrdered}
				onClick={() => toggleList(editor, { listStyleType: ListStyleType.Decimal })}
			/>
			<span className="mx-1 h-5 w-px bg-border" aria-hidden="true" />
			<ToolbarButton
				pressed={link.active}
				disabled={disabled}
				label="Link"
				icon={Link2}
				onClick={() =>
					setLinkDraft((draft) => (draft === null ? (link.url ?? "") : null))
				}
			/>
			{linkDraft !== null && (
				<div className="flex items-center gap-1 px-1">
					<input
						type="text"
						inputMode="url"
						aria-label="Link URL"
						placeholder="https://…"
						value={linkDraft}
						onChange={(event) => setLinkDraft(event.target.value)}
						onKeyDown={(event) => {
							if (event.key === "Enter") {
								event.preventDefault();
							applyLink();
							}
							if (event.key === "Escape") setLinkDraft(null);
						}}
						className={cn(
							"h-8 w-44 rounded-md border border-input bg-transparent px-2 text-sm",
							"placeholder:text-muted-foreground",
							"focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
							"outline-none",
						)}
					/>
					<ToolbarButton
						label="Apply link"
						icon={Link2}
						onClick={applyLink}
					/>
					{link.active && (
						<ToolbarButton label="Remove link" icon={Link2Off} onClick={removeLink} />
					)}
				</div>
			)}
		</div>
	);
}

/* -------------------------------- component ------------------------------- */

export interface RichTextEditorProps {
	/** Sanitized HTML value (controlled). */
	value?: string;
	/** Called with sanitized HTML whenever the document changes. */
	onChange?: (html: string) => void;
	className?: string;
	/** Placeholder shown while the document is empty. */
	placeholder?: string;
	/** Render read-only and block toolbar interaction. */
	disabled?: boolean;
	/** Accessible label for the editable region. */
	"aria-label"?: string;
}

/**
 * Controlled rich-text editor (PlateJS/Slate) for the supported node set:
 * paragraphs, h2/h3, bold/italic/underline, links and bulleted/numbered
 * lists. `value`/`onChange` exchange sanitized HTML.
 */
export function RichTextEditor({
	value,
	onChange,
	className,
	placeholder,
	disabled,
	"aria-label": ariaLabel,
}: RichTextEditorProps) {
	const initialValue = React.useRef<Value | null>(null);
	if (initialValue.current === null) {
		initialValue.current = htmlToRichText(value ?? "");
	}
	const plugins = React.useMemo(() => EDITOR_PLUGINS, []);
	const caretPath = React.useMemo(() => {
		const path = firstTextPath(initialValue.current as RichTextNode[]);
		return path.length > 0 ? path : [0, 0];
	}, []);
	const selection = React.useMemo(
		() => ({
			anchor: { path: caretPath, offset: 0 },
			focus: { path: caretPath, offset: 0 },
		}),
		[caretPath],
	);
	const editor = usePlateEditor({
		plugins,
		value: initialValue.current,
		components: EDITOR_COMPONENTS,
		selection,
	});

	const lastHtml = React.useRef<string | null>(null);
	if (lastHtml.current === null) {
		lastHtml.current = richTextToHtml(editor.children as Value);
	}

	const handleValueChange = React.useCallback(() => {
		const html = richTextToHtml(editor.children as Value);
		if (html === lastHtml.current) return;
		lastHtml.current = html;
		onChange?.(html);
	}, [editor, onChange]);

	// Sync external value changes (e.g. form reset, server update) into the
	// editor without echoing them back through onChange.
	React.useEffect(() => {
		if (value === undefined) return;
		const nodes = htmlToRichText(value);
		const canonical = richTextToHtml(nodes);
		if (canonical === lastHtml.current) {
			lastHtml.current = canonical;
			return;
		}
		lastHtml.current = canonical;
		editor.tf.setValue(nodes);
	}, [editor, value]);

	return (
		<div
			data-slot="rich-text-editor"
			className={cn(
				"overflow-hidden rounded-lg border border-input bg-transparent",
				"focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
				"dark:bg-input/30",
				disabled && "pointer-events-none opacity-60",
				className,
			)}
		>
			<Plate editor={editor} onValueChange={handleValueChange} readOnly={disabled}>
				<Toolbar disabled={disabled} />
				<EditableArea placeholder={placeholder} ariaLabel={ariaLabel} />
			</Plate>
		</div>
	);
}

function EditableArea({
	placeholder,
	ariaLabel,
}: {
	placeholder?: string;
	ariaLabel?: string;
}) {
	const empty = useEditorSelector(isDocumentEmpty, []);
	return (
		<div className="relative">
			<PlateContent
				aria-label={ariaLabel ?? "Rich text editor"}
				className={cn("min-h-28 px-3 py-2 text-sm outline-none", "[&_p]:my-1 [&_h2]:my-1 [&_h3]:my-1")}
				renderLeaf={renderRichTextLeaf}
			/>
			{empty && placeholder ? (
				<div className="pointer-events-none absolute top-2 left-3 text-sm text-muted-foreground">
					{placeholder}
				</div>
			) : null}
		</div>
	);
}
