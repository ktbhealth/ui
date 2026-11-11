// @vitest-environment jsdom
import { afterEach, describe, expect, it, vi } from "vitest";
import { act, cleanup, fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createElement } from "react";

import { PageContainer } from "./page-container.tsx";
import { PageHeader } from "./page-header.tsx";
import { DataToolbar } from "./data-toolbar.tsx";
import { PaginationMeta, PaginationRange } from "./pagination-meta.tsx";
import { ConfirmDialog } from "./confirm-dialog.tsx";

afterEach(cleanup);

describe("PageContainer", () => {
	it("renders children inside a centered container", () => {
		const { container } = render(
			createElement(PageContainer, null, createElement("p", null, "body")),
		);
		const el = container.querySelector('[data-slot="page-container"]');
		expect(el).toBeTruthy();
		expect(el?.className).toContain("max-w-6xl");
		expect(screen.getByText("body")).toBeTruthy();
	});
});

describe("PageHeader", () => {
	it("renders title, eyebrow, description and actions", () => {
		render(
			createElement(PageHeader, {
				title: "Patients",
				eyebrow: "Console",
				description: "Manage patients",
				actions: createElement("button", null, "New"),
			}),
		);
		expect(screen.getByText("Patients")).toBeTruthy();
		expect(screen.getByText("Console")).toBeTruthy();
		expect(screen.getByText("Manage patients")).toBeTruthy();
		expect(screen.getByText("New")).toBeTruthy();
	});

	it("renders without optional slots", () => {
		const { container } = render(createElement(PageHeader, { title: "Only title" }));
		expect(container.querySelector('[data-slot="page-header-actions"]')).toBeNull();
		expect(container.querySelector('[data-slot="page-header-eyebrow"]')).toBeNull();
	});
});

describe("DataToolbar", () => {
	it("renders search, filters, actions and result count slots", () => {
		render(
			createElement(DataToolbar, {
				search: createElement("input", { "aria-label": "Search" }),
				filters: createElement("span", null, "Filter A"),
				actions: createElement("button", null, "Export"),
				resultCount: { shown: 10, total: 42 },
			}),
		);
		expect(screen.getByLabelText("Search")).toBeTruthy();
		expect(screen.getByText("Filter A")).toBeTruthy();
		expect(screen.getByText("Export")).toBeTruthy();
		expect(screen.getByText("Showing 10 of 42")).toBeTruthy();
	});

	it("renders a ReactNode result count as-is", () => {
		render(createElement(DataToolbar, { resultCount: createElement("em", null, "custom count") }));
		expect(screen.getByText("custom count")).toBeTruthy();
	});
});

describe("PaginationRange", () => {
	it("formats the visible range", () => {
		render(createElement(PaginationRange, { page: 2, pageSize: 10, total: 95 }));
		expect(screen.getByText("Showing 11–20 of 95")).toBeTruthy();
	});

	it("clamps the last page", () => {
		render(createElement(PaginationRange, { page: 10, pageSize: 10, total: 95 }));
		expect(screen.getByText("Showing 91–95 of 95")).toBeTruthy();
	});

	it("handles empty and out-of-range pages", () => {
		const { rerender } = render(
			createElement(PaginationRange, { page: 1, pageSize: 10, total: 0 }),
		);
		expect(screen.getByText("Showing 0–0 of 0")).toBeTruthy();
		rerender(createElement(PaginationRange, { page: 99, pageSize: 10, total: 30 }));
		expect(screen.getByText("Showing 0–0 of 30")).toBeTruthy();
	});

	it("supports a custom formatter", () => {
		render(
			createElement(PaginationRange, {
				page: 1,
				pageSize: 10,
				total: 30,
				formatRange: ({ from, to, total }) => `${from}-${to}/${total}`,
			}),
		);
		expect(screen.getByText("1-10/30")).toBeTruthy();
	});
});

describe("PaginationMeta", () => {
	it("renders meta and children", () => {
		render(
			createElement(
				PaginationMeta,
				{ meta: createElement(PaginationRange, { page: 1, pageSize: 10, total: 30 }) },
				createElement("button", null, "Next"),
			),
		);
		expect(screen.getByText("Showing 1–10 of 30")).toBeTruthy();
		expect(screen.getByText("Next")).toBeTruthy();
	});
});

describe("ConfirmDialog", () => {
	it("renders title, description and labels when open", () => {
		render(
			createElement(ConfirmDialog, {
				open: true,
				onOpenChange: vi.fn(),
				title: "Delete patient?",
				description: "This cannot be undone.",
				confirmLabel: "Delete",
				variant: "destructive",
				onConfirm: vi.fn(),
			}),
		);
		expect(screen.getByText("Delete patient?")).toBeTruthy();
		expect(screen.getByText("This cannot be undone.")).toBeTruthy();
		expect(screen.getByText("Delete")).toBeTruthy();
		expect(screen.getByText("Cancel")).toBeTruthy();
	});

	it("calls onConfirm and closes on success", async () => {
		const onConfirm = vi.fn().mockResolvedValue(undefined);
		const onOpenChange = vi.fn();
		render(
			createElement(ConfirmDialog, {
				open: true,
				onOpenChange,
				title: "Sure?",
				onConfirm,
			}),
		);
		await act(async () => {
			fireEvent.click(screen.getByText("Confirm"));
		});
		expect(onConfirm).toHaveBeenCalledTimes(1);
		expect(onOpenChange).toHaveBeenCalledWith(false);
	});

	it("stays open when onConfirm rejects", async () => {
		const onConfirm = vi.fn().mockRejectedValue(new Error("nope"));
		const onOpenChange = vi.fn();
		render(
			createElement(ConfirmDialog, {
				open: true,
				onOpenChange,
				title: "Sure?",
				onConfirm,
			}),
		);
		await act(async () => {
			fireEvent.click(screen.getByText("Confirm"));
		});
		expect(onConfirm).toHaveBeenCalledTimes(1);
		expect(onOpenChange).not.toHaveBeenCalledWith(false);
		await waitFor(() => expect(screen.getByText("Confirm")).toBeTruthy());
	});

	it("cancel triggers onOpenChange(false)", async () => {
		const onOpenChange = vi.fn();
		render(
			createElement(ConfirmDialog, {
				open: true,
				onOpenChange,
				title: "Sure?",
				onConfirm: vi.fn(),
			}),
		);
		await act(async () => {
			fireEvent.click(screen.getByText("Cancel"));
		});
		expect(onOpenChange.mock.calls[0]?.[0]).toBe(false);
	});
});
