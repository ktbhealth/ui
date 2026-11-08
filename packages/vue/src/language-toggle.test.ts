import { describe, expect, it } from "vitest";
import { mount } from "@vue/test-utils";
import { LanguageToggle } from "./index";

describe("LanguageToggle", () => {
	const locales = ["en", "pt-BR", "es"];
	const labels = { en: "English", "pt-BR": "Português", es: "Español" };

	it("renders an icon-only trigger with an accessible label", () => {
		const wrapper = mount(LanguageToggle, {
			props: { locales, modelValue: "en", labels },
		});
		const trigger = wrapper.find("[data-slot='language-toggle-trigger']");
		expect(trigger.exists()).toBe(true);
		expect(trigger.attributes("aria-label")).toBe("Language");
	});

	it("uses a custom accessible label when provided", () => {
		const wrapper = mount(LanguageToggle, {
			props: { locales, modelValue: "en", label: "Idioma" },
		});
		expect(
			wrapper.find("[data-slot='language-toggle-trigger']").attributes("aria-label"),
		).toBe("Idioma");
	});
});
