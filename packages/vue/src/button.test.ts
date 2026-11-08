import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { Button } from "./index";
import { cn } from "./lib/utils";

describe("Button", () => {
	it("renders a button element", () => {
		const wrapper = mount(Button, { slots: { default: "Click me" } });
		expect(wrapper.element.tagName).toBe("BUTTON");
		expect(wrapper.text()).toBe("Click me");
	});

	it("applies variant classes", () => {
		const wrapper = mount(Button, { props: { variant: "destructive" } });
		expect(wrapper.classes().join(" ")).toContain("destructive");
	});
});

describe("cn", () => {
	it("merges tailwind classes", () => {
		expect(cn("px-2", "px-4")).toBe("px-4");
	});
});
