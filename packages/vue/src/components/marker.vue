<script lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const markerVariants = cva(
	"group/marker relative flex min-h-4 w-full items-center gap-2 text-left text-sm text-muted-foreground [&_svg:not([class*='size-'])]:size-4 [a]:underline [a]:underline-offset-3 [a]:hover:text-foreground",
	{
		variants: {
			variant: {
				default: "",
				separator:
					"before:mr-1 before:h-px before:min-w-0 before:flex-1 before:bg-border after:ml-1 after:h-px after:min-w-0 after:flex-1 after:bg-border",
				border: "border-b border-border pb-2",
			},
		},
		defaultVariants: { variant: "default" },
	},
);

type MarkerVariants = VariantProps<typeof markerVariants>;
export { markerVariants };
export type { MarkerVariants };
</script>

<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{ class?: HTMLAttributes["class"]; variant?: MarkerVariants["variant"] }>(),
	{ variant: "default" },
);

const classes = computed(() => cn(markerVariants({ variant: props.variant }), props.class));
</script>

<template>
	<div data-slot="marker" :data-variant="variant" :class="classes">
		<slot />
	</div>
</template>
