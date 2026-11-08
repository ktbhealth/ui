import type { InjectionKey, Ref } from "vue";

export interface ToggleGroupContext {
	variant?: "default" | "outline";
	size?: "default" | "sm" | "lg";
	spacing?: number;
}

export const toggleGroupKey: InjectionKey<Ref<ToggleGroupContext>> = Symbol("ktb-toggle-group");
