// @vitest-environment jsdom
import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { SearchableSelect } from "./searchable-select";

class ResizeObserverStub {
	observe() {}
	unobserve() {}
	disconnect() {}
}
(globalThis as { ResizeObserver?: unknown }).ResizeObserver ??= ResizeObserverStub;
Element.prototype.getAnimations ??= () => [];

const ITEMS = [
	{ value: "1", label: "Ana" },
	{ value: "2", label: "João" },
];

function Harness({
	initialValue = null,
	onValueChange = vi.fn(),
	clearable = false,
	disabled = false,
}: {
	readonly initialValue?: string | null;
	readonly onValueChange?: (value: string | null) => void;
	readonly clearable?: boolean;
	readonly disabled?: boolean;
}) {
	const [value, setValue] = useState<string | null>(initialValue);
	return (
		<SearchableSelect
			id="searchable-select"
			ariaLabel="Owner"
			items={ITEMS}
			value={value}
			onValueChange={(next) => {
				setValue(next);
				onValueChange(next);
			}}
			placeholder="Pick one"
			emptyMessage="Nothing found."
			clearable={clearable}
			disabled={disabled}
			className="w-full"
		/>
	);
}

afterEach(cleanup);

describe("SearchableSelect", () => {
	it("filters and selects an item", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(<Harness onValueChange={onValueChange} />);

		await user.click(screen.getByLabelText("Owner"));
		await user.type(screen.getByLabelText("Owner"), "jo");
		expect(screen.queryByRole("option", { name: "Ana" })).toBeNull();
		await user.click(await screen.findByRole("option", { name: "João" }));

		expect(onValueChange).toHaveBeenCalledWith("2");
		await waitFor(() =>
			expect((screen.getByLabelText("Owner") as HTMLInputElement).value).toBe("João"),
		);
	});

	it("shows the empty message when nothing matches", async () => {
		const user = userEvent.setup();
		render(<Harness />);

		await user.type(screen.getByLabelText("Owner"), "zzz");

		expect(await screen.findByText("Nothing found.")).toBeTruthy();
	});

	it("clears the selection when clearable", async () => {
		const user = userEvent.setup();
		const onValueChange = vi.fn();
		render(<Harness initialValue="1" onValueChange={onValueChange} clearable />);

		const clear = document.querySelector('[data-slot="combobox-clear"]') as HTMLButtonElement;
		await user.click(clear);

		expect(onValueChange).toHaveBeenCalledWith(null);
		await waitFor(() =>
			expect((screen.getByLabelText("Owner") as HTMLInputElement).value).toBe(""),
		);
	});

	it("keeps the input disabled", () => {
		render(<Harness disabled />);

		expect((screen.getByLabelText("Owner") as HTMLInputElement).disabled).toBe(true);
	});
});
