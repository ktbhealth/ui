<script lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const emptyMediaVariants = cva(
	"mb-2 flex shrink-0 items-center justify-center [&_svg]:pointer-events-none [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default: "bg-transparent",
				icon: "flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground [&_svg:not([class*='size-'])]:size-4",
			},
		},
		defaultVariants: { variant: "default" },
	},
);

type EmptyMediaVariants = VariantProps<typeof emptyMediaVariants>;
export { emptyMediaVariants };
export type { EmptyMediaVariants };
</script>

<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{ class?: HTMLAttributes["class"]; variant?: EmptyMediaVariants["variant"] }>(),
	{ variant: "default" },
);

const classes = computed(() => cn(emptyMediaVariants({ variant: props.variant }), props.class));
</script>

<template>
	<div data-slot="empty-icon" :data-variant="variant" :class="classes">
		<slot />
	</div>
</template>
