<script lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const menubarItemVariants = cva(
	"group/menubar-item gap-1.5 rounded-md px-1.5 py-1 text-sm focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 data-disabled:opacity-50 [&_svg:not([class*='size-'])]:size-4 data-[variant=destructive]:*:[svg]:text-destructive!",
	{
		variants: {
			variant: { default: "", destructive: "" },
			inset: { true: "pl-7", false: "" },
		},
		defaultVariants: { variant: "default", inset: false },
	},
);

type MenubarItemVariants = VariantProps<typeof menubarItemVariants>;
export { menubarItemVariants };
export type { MenubarItemVariants };
</script>

<script setup lang="ts">
import { MenubarItem } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		variant?: MenubarItemVariants["variant"];
		inset?: boolean;
		disabled?: boolean;
		textValue?: string;
	}>(),
	{ variant: "default", inset: false, disabled: false },
);

const emits = defineEmits<{ (e: "select", event: Event): void }>();

const classes = computed(() =>
	cn(menubarItemVariants({ variant: props.variant, inset: props.inset }), props.class),
);
</script>

<template>
	<MenubarItem
		data-slot="menubar-item"
		:data-variant="variant"
		:data-inset="inset || undefined"
		:class="classes"
		:disabled="disabled"
		:text-value="textValue"
		@select="(e) => emits('select', e)"
	>
		<slot />
	</MenubarItem>
</template>
