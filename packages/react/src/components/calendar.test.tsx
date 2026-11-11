// @vitest-environment jsdom
import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { ptBR } from "react-day-picker/locale/pt-BR";

import { Calendar } from "./calendar";

const month = new Date(2025, 0, 15);

function monthDropdownOptions(container: HTMLElement): string[] {
	const select = Array.from(container.querySelectorAll("select")).find(
		(el) => el.options.length === 12,
	);
	return Array.from(select?.options ?? []).map((option) => option.text);
}

function expectedMonthLabels(code: string): string[] {
	return Array.from({ length: 12 }, (_, i) =>
		new Date(2025, i, 1).toLocaleString(code, { month: "short" }),
	);
}

describe("Calendar", () => {
	it("formats the month dropdown with en-US when locale is undefined", () => {
		const { container } = render(
			<Calendar captionLayout="dropdown" month={month} />,
		);
		expect(monthDropdownOptions(container)).toEqual(expectedMonthLabels("en-US"));
	});

	it("honors a provided locale in the month dropdown", () => {
		const { container } = render(
			<Calendar captionLayout="dropdown" month={month} locale={ptBR} />,
		);
		expect(monthDropdownOptions(container)).toEqual(expectedMonthLabels("pt-BR"));
	});

	it("formats data-day with en-US when locale is undefined", () => {
		const { container } = render(<Calendar month={month} mode="single" />);
		const dataDays = Array.from(
			container.querySelectorAll("button[data-day]"),
		).map((el) => el.getAttribute("data-day"));
		expect(dataDays).toContain(month.toLocaleDateString("en-US"));
	});
});
