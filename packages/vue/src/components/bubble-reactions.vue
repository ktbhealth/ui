<script lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const bubbleReactionsVariants = cva(
	"absolute z-10 flex w-fit shrink-0 items-center justify-center gap-1 rounded-full bg-muted px-1.5 py-0.5 text-sm ring-3 ring-card has-[button]:p-0",
	{
		variants: {
			side: {
				top: "top-0 -translate-y-3/4",
				bottom: "bottom-0 translate-y-3/4",
			},
			align: {
				start: "left-3",
				end: "right-3",
			},
		},
		defaultVariants: { side: "bottom", align: "end" },
	},
);

type BubbleReactionsVariants = VariantProps<typeof bubbleReactionsVariants>;
export { bubbleReactionsVariants };
export type { BubbleReactionsVariants };
</script>

<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		side?: BubbleReactionsVariants["side"];
		align?: BubbleReactionsVariants["align"];
	}>(),
	{ side: "bottom", align: "end" },
);

const classes = computed(() =>
	cn(bubbleReactionsVariants({ side: props.side, align: props.align }), props.class),
);
</script>

<template>
	<div data-slot="bubble-reactions" :class="classes">
		<slot />
	</div>
</template>
