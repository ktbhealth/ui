<script lang="ts">
import { cva, type VariantProps } from "class-variance-authority";
import { sidebarMenuButtonVariants } from "./sidebar-menu-button.vue";

type Size = NonNullable<VariantProps<typeof sidebarMenuButtonVariants>["size"]>;

const sidebarMenuSubButtonVariants = cva(
	"flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground",
	{
		variants: {
			size: {
				default: "text-sm",
				sm: "text-xs",
				lg: "text-sm",
			} satisfies Record<Size, string>,
		},
		defaultVariants: { size: "default" },
	},
);

type SidebarMenuSubButtonVariants = VariantProps<typeof sidebarMenuSubButtonVariants>;
export { sidebarMenuSubButtonVariants };
export type { SidebarMenuSubButtonVariants };
</script>

<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		size?: SidebarMenuSubButtonVariants["size"];
		isActive?: boolean;
		href?: string;
	}>(),
	{ size: "default", href: undefined },
);

const classes = computed(() =>
	cn(
		sidebarMenuSubButtonVariants({ size: props.size }),
		props.isActive && "bg-sidebar-accent text-sidebar-accent-foreground",
		props.class,
	),
);
</script>

<template>
	<a
		data-slot="sidebar-menu-sub-button"
		data-sidebar="menu-sub-button"
		:data-size="size"
		:data-active="isActive"
		:href="href"
		:class="classes"
	>
		<slot />
	</a>
</template>
