<script lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const inputGroupAddonVariants = cva(
	"flex h-auto cursor-text items-center justify-center gap-2 py-1.5 text-sm font-medium text-muted-foreground select-none group-data-[disabled=true]/input-group:opacity-50 [&>kbd]:rounded-[calc(var(--radius)-5px)] [&>svg:not([class*='size-'])]:size-4",
	{
		variants: {
			align: {
				"inline-start": "order-first pl-2 has-[>button]:ml-[-0.3rem] has-[>kbd]:ml-[-0.15rem]",
				"inline-end": "order-last pr-2 has-[>button]:mr-[-0.3rem] has-[>kbd]:mr-[-0.15rem]",
				"block-start":
					"order-first w-full justify-start px-2.5 pt-2 group-has-[>input]/input-group:pt-2 [.border-b]:pb-2",
				"block-end":
					"order-last w-full justify-start px-2.5 pb-2 group-has-[>input]/input-group:pb-2 [.border-t]:pt-2",
			},
		},
		defaultVariants: { align: "inline-start" },
	},
);

type InputGroupAddonVariants = VariantProps<typeof inputGroupAddonVariants>;
export { inputGroupAddonVariants };
export type { InputGroupAddonVariants };
</script>

<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{ class?: HTMLAttributes["class"]; align?: InputGroupAddonVariants["align"] }>(),
	{ align: "inline-start" },
);

const classes = computed(() =>
	cn(inputGroupAddonVariants({ align: props.align }), props.class),
);

function onClick(e: MouseEvent) {
	if ((e.target as HTMLElement).closest("button")) return;
	(e.currentTarget as HTMLElement).parentElement
		?.querySelector("input")
		?.focus();
}
</script>

<template>
	<div
		data-slot="input-group-addon"
		:data-align="align"
		role="group"
		:class="classes"
		@click="onClick"
	>
		<slot />
	</div>
</template>
