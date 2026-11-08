<script lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const codeBlockVariants = cva(
	"group/code-block relative flex w-full min-w-0 flex-col overflow-hidden rounded-lg text-sm has-[>[data-slot=code-block-content]:focus-visible]:ring-3 has-[>[data-slot=code-block-content]:focus-visible]:ring-ring/50 data-[size=sm]:text-xs",
	{
		variants: {
			variant: {
				default:
					"border border-input text-foreground has-[>[data-slot=code-block-content]:focus-visible]:border-ring dark:bg-input/30",
				destructive: "border border-destructive/30 text-destructive dark:border-destructive/40",
			},
		},
		defaultVariants: { variant: "default" },
	},
);

type CodeBlockVariants = VariantProps<typeof codeBlockVariants>;
export { codeBlockVariants };
export type { CodeBlockVariants };
</script>

<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		variant?: CodeBlockVariants["variant"];
		size?: "default" | "sm";
	}>(),
	{ variant: "default", size: "default" },
);

const classes = computed(() => cn(codeBlockVariants({ variant: props.variant }), props.class));
</script>

<template>
	<div
		data-slot="code-block"
		:data-variant="variant"
		:data-size="size"
		:class="classes"
	>
		<slot />
	</div>
</template>
