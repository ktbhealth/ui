<script setup lang="ts">
import { ProgressIndicator, ProgressRoot } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		modelValue?: number | null;
		max?: number;
		getValueLabel?: (value: number, max: number) => string;
	}>(),
	{ modelValue: 0, max: 100 },
);

const classes = computed(() =>
	cn(
		"relative flex h-1 w-full items-center overflow-x-hidden rounded-full bg-muted",
		props.class,
	),
);
const indicatorStyle = computed(() => ({
	transform: `translateX(-${100 - ((props.modelValue ?? 0) / (props.max || 100)) * 100}%)`,
}));
const valueText = computed(() =>
	props.getValueLabel
		? props.getValueLabel(props.modelValue ?? 0, props.max || 100)
		: `${Math.round(((props.modelValue ?? 0) / (props.max || 100)) * 100)}%`,
);
</script>

<template>
	<ProgressRoot
		data-slot="progress"
		class="flex w-full flex-col gap-3"
		:model-value="modelValue"
		:max="max"
		:aria-valuetext="valueText"
	>
		<ProgressIndicator data-slot="progress-track" :class="classes" :style="indicatorStyle" />
		<div v-if="$slots.default" class="flex items-center justify-between text-sm">
			<span data-slot="progress-label" class="font-medium"><slot name="label" /></span>
			<span data-slot="progress-value" class="ml-auto text-sm text-muted-foreground tabular-nums">
				<slot name="value">{{ valueText }}</slot>
			</span>
		</div>
	</ProgressRoot>
</template>
