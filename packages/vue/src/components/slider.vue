<script setup lang="ts">
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		modelValue?: number[];
		defaultValue?: number[];
		min?: number;
		max?: number;
		step?: number;
		orientation?: "horizontal" | "vertical";
		disabled?: boolean;
		minStepsBetweenThumbs?: number;
	}>(),
	{ modelValue: undefined, defaultValue: undefined, min: 0, max: 100, step: 1, orientation: "horizontal", disabled: false, minStepsBetweenThumbs: undefined },
);

const emits = defineEmits<{
	(e: "update:modelValue", value: number[]): void;
}>();

const model = computed({
	get: () => props.modelValue ?? props.defaultValue ?? [props.min],
	set: (v: number[]) => emits("update:modelValue", v ?? []),
});

const classes = computed(() =>
	cn(
		"relative flex w-full touch-none items-center select-none data-disabled:opacity-50 data-vertical:h-full data-vertical:min-h-40 data-vertical:w-auto data-vertical:flex-col",
		props.class,
	),
);
const trackClasses = computed(() =>
	cn(
		"relative grow overflow-hidden rounded-full bg-muted select-none data-horizontal:h-1 data-horizontal:w-full data-vertical:h-full data-vertical:w-1",
	),
);
const rangeClasses = computed(() =>
	cn("absolute bg-primary select-none data-horizontal:h-full data-vertical:w-full"),
);
const thumbClasses = computed(() =>
	cn(
		"relative block size-3 shrink-0 rounded-full border border-ring bg-white ring-ring/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50",
	),
);
</script>

<template>
	<SliderRoot
		data-slot="slider"
		:class="classes"
		:model-value="model"
		:min="min"
		:max="max"
		:step="step"
		:orientation="orientation"
		:disabled="disabled"
		:min-steps-between-thumbs="minStepsBetweenThumbs"
		@update:model-value="(v) => (model = (v ?? []) as number[])"
	>
		<SliderTrack data-slot="slider-track" :class="trackClasses">
			<SliderRange data-slot="slider-range" :class="rangeClasses" />
		</SliderTrack>
		<SliderThumb
			v-for="(_, i) in model"
			:key="i"
			data-slot="slider-thumb"
			:class="thumbClasses"
		/>
	</SliderRoot>
</template>
