import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";

import Calendar from "./components/calendar.vue";

const jan2025 = new Date(2025, 0, 15);

describe("Calendar", () => {
	it("formats the caption with en-US when locale is undefined", () => {
		const wrapper = mount(Calendar, { props: { modelValue: jan2025 } });
		expect(wrapper.text()).toContain("January 2025");
	});

	it("honors a provided locale", () => {
		const wrapper = mount(Calendar, {
			props: { modelValue: jan2025, locale: "pt-BR" },
		});
		expect(wrapper.text()).toContain("janeiro de 2025");
	});
});
