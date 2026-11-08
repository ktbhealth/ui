<script lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const itemVariants = cva(
	"group/item flex w-full flex-wrap items-center rounded-lg border text-sm transition-colors duration-100 outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 [a]:transition-colors [a]:hover:bg-muted",
	{
		variants: {
			variant: {
				default: "border-transparent",
				outline: "border-border",
				muted: "border-transparent bg-muted/50",
			},
			size: {
				default: "gap-2.5 px-3 py-2.5",
				sm: "gap-2.5 px-3 py-2.5",
				xs: "gap-2 px-2.5 py-2 in-data-[slot=dropdown-menu-content]:p-0",
			},
		},
		defaultVariants: { variant: "default", size: "default" },
	},
);

type ItemVariants = VariantProps<typeof itemVariants>;
export { itemVariants };
export type { ItemVariants };
</script>

<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		variant?: ItemVariants["variant"];
		size?: ItemVariants["size"];
	}>(),
	{ variant: "default", size: "default" },
);

const classes = computed(() =>
	cn(itemVariants({ variant: props.variant, size: props.size }), props.class),
);
</script>

<template>
	<div data-slot="item" :data-variant="variant" :data-size="size" :class="classes">
		<slot />
	</div>
</template>
