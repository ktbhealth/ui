<script lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const inputGroupButtonVariants = cva("flex items-center gap-2 text-sm shadow-none", {
	variants: {
		size: {
			xs: "h-6 gap-1 rounded-[calc(var(--radius)-3px)] px-1.5 [&>svg:not([class*='size-'])]:size-3.5",
			sm: "",
			"icon-xs": "size-6 rounded-[calc(var(--radius)-3px)] p-0 has-[>svg]:p-0",
			"icon-sm": "size-8 p-0 has-[>svg]:p-0",
		},
	},
	defaultVariants: { size: "xs" },
});

type InputGroupButtonVariants = VariantProps<typeof inputGroupButtonVariants>;
export { inputGroupButtonVariants };
export type { InputGroupButtonVariants };
</script>

<script setup lang="ts">
import { computed, type ButtonHTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import Button from "./button.vue";

const props = withDefaults(
	defineProps<{
		class?: ButtonHTMLAttributes["class"];
		size?: InputGroupButtonVariants["size"];
		type?: "button" | "submit" | "reset";
		variant?: "default" | "secondary" | "outline" | "ghost" | "destructive" | "link";
	}>(),
	{ size: "xs", type: "button", variant: "ghost" },
);

const classes = computed(() => cn(inputGroupButtonVariants({ size: props.size }), props.class));
</script>

<template>
	<Button data-slot="input-group-button" :type="type" :variant="variant" :class="classes">
		<slot />
	</Button>
</template>
