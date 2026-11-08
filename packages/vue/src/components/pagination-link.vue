<script lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const paginationLinkVariants = cva(
	"inline-flex items-center justify-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium transition-all outline-none hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-50 aria-[current=page]:bg-primary aria-[current=page]:text-primary-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				default: "",
				outline: "border border-input bg-background shadow-xs hover:bg-muted",
				ghost: "hover:bg-muted",
			},
			size: {
				default: "",
				icon: "size-9",
				"icon-sm": "size-8",
			},
		},
		defaultVariants: { variant: "outline", size: "icon" },
	},
);

type PaginationLinkVariants = VariantProps<typeof paginationLinkVariants>;
export { paginationLinkVariants };
export type { PaginationLinkVariants };
</script>

<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		variant?: PaginationLinkVariants["variant"];
		size?: PaginationLinkVariants["size"];
		href?: string;
		isActive?: boolean;
		as?: string;
	}>(),
	{ variant: "outline", size: "icon", as: "a" },
);

const classes = computed(() => cn(paginationLinkVariants({ variant: props.variant, size: props.size }), props.class));
</script>

<template>
	<component
		:is="as"
		data-slot="pagination-link"
		:href="href"
		:class="classes"
		:aria-current="isActive ? 'page' : undefined"
	>
		<slot />
	</component>
</template>
