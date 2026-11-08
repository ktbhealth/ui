import type { InjectionKey } from "vue";

export interface ResizablePanelGroupContext {
	direction: "horizontal" | "vertical";
	groupEl: () => HTMLElement | null;
}

export const resizableGroupKey: InjectionKey<ResizablePanelGroupContext> =
	Symbol("ktb-resizable-group");
