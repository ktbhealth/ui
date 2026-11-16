// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { useState } from "react";

import {
	RichTextEditor,
	htmlToRichText,
	richTextToHtml,
	sanitizeRichTextHref,
} from "./rich-text-editor";

afterEach(cleanup);

function ControlledEditor({
	initial = "",
	onChange,
}: {
	initial?: string;
	onChange?: (html: string) => void;
}) {
	const [value, setValue] = useState(initial);
	return (
		<RichTextEditor
			value={value}
			onChange={(html) => {
				setValue(html);
				onChange?.(html);
			}}
		/>
	);
}

describe("RichTextEditor", () => {
	it("renders the toolbar and editable region", () => {
		render(<RichTextEditor value="<p>Hello</p>" />);
		expect(screen.getByRole("toolbar", { name: "Formatting" })).toBeTruthy();
		for (const label of [
			"Heading 2",
			"Heading 3",
			"Bold",
			"Italic",
			"Underline",
			"Bulleted list",
			"Numbered list",
			"Link",
		]) {
			expect(screen.getByRole("button", { name: label })).toBeTruthy();
		}
		expect(
			screen.getByRole("textbox", { name: "Rich text editor" }),
		).toBeTruthy();
	});

	it("emits sanitized HTML when a list is toggled", async () => {
		const onChange = vi.fn();
		render(<ControlledEditor initial="<p>one</p><p>two</p>" onChange={onChange} />);
		fireEvent.click(screen.getByRole("button", { name: "Bulleted list" }));
		await waitFor(() => expect(onChange).toHaveBeenCalled());
		const html = onChange.mock.calls.at(-1)?.[0] as string;
		expect(html).toContain("<ul>");
		expect(html).toContain("<li>one</li>");
		expect(html).not.toContain("<script");
	});

	it("emits sanitized HTML when a link is applied", async () => {
		const onChange = vi.fn();
		render(<ControlledEditor onChange={onChange} />);
		fireEvent.click(screen.getByRole("button", { name: "Link" }));
		const input = screen.getByRole("textbox", { name: "Link URL" });
		fireEvent.change(input, { target: { value: "https://example.com" } });
		fireEvent.click(screen.getByRole("button", { name: "Apply link" }));
		await waitFor(() => expect(onChange).toHaveBeenCalled());
		const html = onChange.mock.calls.at(-1)?.[0] as string;
		expect(html).toContain('<a href="https://example.com"');
	});

	it("rejects unsafe link schemes in the link input", () => {
		const onChange = vi.fn();
		render(<ControlledEditor onChange={onChange} />);
		fireEvent.click(screen.getByRole("button", { name: "Link" }));
		const input = screen.getByRole("textbox", { name: "Link URL" });
		fireEvent.change(input, { target: { value: "javascript:alert(1)" } });
		fireEvent.click(screen.getByRole("button", { name: "Apply link" }));
		expect(onChange).not.toHaveBeenCalled();
	});
});

describe("richTextToHtml / htmlToRichText", () => {
	it("serializes the supported node set", () => {
		const html = richTextToHtml([
			{ type: "h2", children: [{ text: "Title" }] },
			{
				type: "p",
				children: [
					{ text: "bold", bold: true },
					{ text: " " },
					{ text: "italic", italic: true },
					{ text: " " },
					{ text: "under", underline: true },
				],
			},
			{
				type: "p",
				children: [
					{
						type: "a",
						url: "https://example.com",
						children: [{ text: "link" }],
					},
				],
			},
		] as never);
		expect(html).toBe(
			'<h2>Title</h2><p><strong>bold</strong> <em>italic</em> <u>under</u></p>' +
				'<p><a href="https://example.com" target="_blank" rel="noopener noreferrer">link</a></p>',
		);
	});

	it("serializes lists with nesting and ordered style", () => {
		const html = richTextToHtml([
			{ type: "p", listStyleType: "disc", indent: 1, children: [{ text: "a" }] },
			{ type: "p", listStyleType: "disc", indent: 1, children: [{ text: "b" }] },
			{ type: "p", listStyleType: "decimal", indent: 1, children: [{ text: "c" }] },
		] as never);
		expect(html).toBe(
			"<ul><li>a</li><li>b</li></ul><ol><li>c</li></ol>",
		);
	});

	it("round-trips HTML through the value format", () => {
		const input =
			"<h2>Title</h2><p>Hello <strong>bold</strong> and <em>italic</em></p>" +
			'<ul><li>one</li><li>two</li></ul>' +
			'<p><a href="https://example.com">site</a></p>';
		const value = htmlToRichText(input);
		const html = richTextToHtml(value);
		expect(html).toContain("<h2>Title</h2>");
		expect(html).toContain("<strong>bold</strong>");
		expect(html).toContain("<em>italic</em>");
		expect(html).toContain("<ul><li>one</li><li>two</li></ul>");
		expect(html).toContain("<a");
		expect(html).toContain("https://example.com");
	});

	it("drops scripts, event handlers and unknown tags", () => {
		const value = htmlToRichText(
			'<p onclick="alert(1)">hi<script>alert(1)</script><span style="color:red">s</span><img src="x" onerror="alert(2)"></p>',
		);
		const html = richTextToHtml(value);
		expect(html).not.toContain("script");
		expect(html).not.toContain("onclick");
		expect(html).not.toContain("onerror");
		expect(html).not.toContain("<img");
		expect(html).not.toContain("style=");
		expect(html).toContain("hi");
		expect(html).toContain("s");
	});

	it("drops disallowed link schemes but keeps the text", () => {
		const value = htmlToRichText(
			'<p><a href="javascript:alert(1)">bad</a> <a href="https://ok.com">good</a></p>',
		);
		const html = richTextToHtml(value);
		expect(html).not.toContain("javascript:");
		expect(html).toContain("bad");
		expect(html.match(/<a /g)).toHaveLength(1);
		expect(html).toContain('href="https://ok.com"');
	});

	it("parses nested lists", () => {
		const value = htmlToRichText(
			"<ul><li>one<ul><li>sub</li></ul></li><li>two</li></ul>",
		);
		const html = richTextToHtml(value);
		expect(html).toContain("<ul><li>one<ul><li>sub</li></ul></li><li>two</li></ul>");
	});

	it("returns an empty document for empty or invalid input", () => {
		expect(htmlToRichText("")).toEqual([{ type: "p", children: [{ text: "" }] }]);
		expect(richTextToHtml([])).toBe("");
		expect(richTextToHtml(htmlToRichText(""))).toBe("");
	});
});

describe("sanitizeRichTextHref", () => {
	it("allows only http(s) and mailto", () => {
		expect(sanitizeRichTextHref("https://a.com")).toBe("https://a.com");
		expect(sanitizeRichTextHref("http://a.com")).toBe("http://a.com");
		expect(sanitizeRichTextHref("mailto:a@b.c")).toBe("mailto:a@b.c");
		expect(sanitizeRichTextHref("HTTPS://A.COM")).toBe("HTTPS://A.COM");
		expect(sanitizeRichTextHref("javascript:alert(1)")).toBeNull();
		expect(sanitizeRichTextHref("data:text/html,x")).toBeNull();
		expect(sanitizeRichTextHref("//evil.com")).toBeNull();
		expect(sanitizeRichTextHref("/relative")).toBeNull();
		expect(sanitizeRichTextHref("")).toBeNull();
		expect(sanitizeRichTextHref(42)).toBeNull();
	});
});
