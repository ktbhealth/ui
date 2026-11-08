<script lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const spinnerVariants = cva("size-4 animate-spin", {
	variants: {
		size: {
			default: "size-4",
			sm: "size-3",
			lg: "size-6",
		},
	},
	defaultVariants: { size: "default" },
});

type SpinnerVariants = VariantProps<typeof spinnerVariants>;
export { spinnerVariants };
export type { SpinnerVariants };
</script>

<script setup lang="ts">
import { LoaderCircleIcon } from "lucide-vue-next";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		size?: SpinnerVariants["size"];
	}>(),
	{ size: "default" },
);

const classes = computed(() => cn(spinnerVariants({ size: props.size }), props.class));
</script>

<template>
	<LoaderCircleIcon data-slot="spinner" :class="classes" />
</template>
