<script lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const contextMenuItemVariants = cva(
	"group/context-menu-item relative flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 focus:*:[svg]:text-accent-foreground data-[variant=destructive]:*:[svg]:text-destructive",
	{
		variants: {
			variant: { default: "", destructive: "" },
			inset: { true: "pl-7", false: "" },
		},
		defaultVariants: { variant: "default", inset: false },
	},
);

type ContextMenuItemVariants = VariantProps<typeof contextMenuItemVariants>;
export { contextMenuItemVariants };
export type { ContextMenuItemVariants };
</script>

<script setup lang="ts">
import { ContextMenuItem } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		variant?: ContextMenuItemVariants["variant"];
		inset?: boolean;
		disabled?: boolean;
		textValue?: string;
	}>(),
	{ variant: "default", inset: false, disabled: false },
);

const emits = defineEmits<{ (e: "select", event: Event): void }>();

const classes = computed(() =>
	cn(contextMenuItemVariants({ variant: props.variant, inset: props.inset }), props.class),
);
</script>

<template>
	<ContextMenuItem
		data-slot="context-menu-item"
		:data-variant="variant"
		:data-inset="inset || undefined"
		:class="classes"
		:disabled="disabled"
		:text-value="textValue"
		@select="(e) => emits('select', e)"
	>
		<slot />
	</ContextMenuItem>
</template>
