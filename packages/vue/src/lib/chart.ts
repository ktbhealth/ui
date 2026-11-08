import type { InjectionKey } from "vue";

export type ChartConfig = Record<
	string,
	{
		label?: string;
		icon?: unknown;
	} & (
		| { color?: string; theme?: never }
		| { color?: never; theme: Record<"light" | "dark", string> }
	)
>;

export const chartConfigKey: InjectionKey<ChartConfig> = Symbol("ktb-chart-config");

export function useChartConfig() {
	return {};
}
