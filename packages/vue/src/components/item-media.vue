<script lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const itemMediaVariants = cva(
	"flex shrink-0 items-center justify-center gap-2 group-has-data-[slot=item-description]/item:translate-y-0.5 group-has-data-[slot=item-description]/item:self-start [&_svg]:pointer-events-none",
	{
		variants: {
			variant: {
				default: "bg-transparent",
				icon: "[&_svg:not([class*='size-'])]:size-4",
				image:
					"size-10 overflow-hidden rounded-sm group-data-[size=sm]/item:size-8 group-data-[size=xs]/item:size-6 [&_img]:size-full [&_img]:object-cover",
			},
		},
		defaultVariants: { variant: "default" },
	},
);

type ItemMediaVariants = VariantProps<typeof itemMediaVariants>;
export { itemMediaVariants };
export type { ItemMediaVariants };
</script>

<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{ class?: HTMLAttributes["class"]; variant?: ItemMediaVariants["variant"] }>(),
	{ variant: "default" },
);

const classes = computed(() =>
	cn(itemMediaVariants({ variant: props.variant }), props.class),
);
</script>

<template>
	<div data-slot="item-media" :data-variant="variant" :class="classes">
		<slot />
	</div>
</template>
