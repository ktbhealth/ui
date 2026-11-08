<script setup lang="ts">
import { computed, provide, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { chartConfigKey, type ChartConfig } from "../lib/chart";

const props = defineProps<{
	class?: HTMLAttributes["class"];
	config?: ChartConfig;
}>();

provide(chartConfigKey, props.config ?? {});

const style = computed(() => {
	const vars: Record<string, string> = {};
	for (const [key, item] of Object.entries(props.config ?? {})) {
		const color = "color" in item ? item.color : undefined;
		if (color) vars[`--color-${key}`] = color;
	}
	return vars;
});

const classes = computed(() => cn("flex aspect-video justify-center text-xs", props.class));
</script>

<template>
	<div data-slot="chart" :class="classes" :style="style">
		<slot />
	</div>
</template>
