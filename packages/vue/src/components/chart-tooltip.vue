<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { chartConfigKey } from "../lib/chart";

const props = defineProps<{
	class?: HTMLAttributes["class"];
	nameKey?: string;
	payload?: Record<string, unknown>;
}>();

const config = inject(chartConfigKey, {});
const classes = computed(() =>
	cn(
		"grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-background px-2.5 py-1.5 text-xs shadow-xl",
		props.class,
	),
);
</script>

<template>
	<div data-slot="chart-tooltip" :class="classes">
		<slot />
	</div>
</template>
