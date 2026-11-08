<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { useSidebar } from "../lib/sidebar-context";
import SheetRoot from "./sheet.vue";
import SheetContentComponent from "./sheet-content.vue";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		side?: "left" | "right";
		variant?: "sidebar" | "floating" | "inset";
		collapsible?: "offcanvas" | "icon" | "none";
	}>(),
	{ side: "left", variant: "sidebar", collapsible: "offcanvas" },
);

const sidebar = useSidebar();

const classes = computed(() =>
	cn(
		"flex h-full w-(--sidebar-width) flex-col bg-sidebar text-sidebar-foreground",
		props.class,
	),
);
</script>

<template>
	<SheetRoot v-if="sidebar.isMobile.value" :open="sidebar.open.value" @update:open="(v: boolean) => sidebar.setOpen(v)">
		<SheetContentComponent
			data-slot="sidebar"
			:data-mobile="true"
			class="w-(--sidebar-width) bg-sidebar p-0 text-sidebar-foreground [&>button]:hidden"
			:side="side"
		>
			<div :class="classes">
				<slot />
			</div>
		</SheetContentComponent>
	</SheetRoot>
	<div
		v-else
		data-slot="sidebar"
		:data-state="sidebar.state.value"
		:data-collapsible="collapsible"
		:data-variant="variant"
		:data-side="side"
		:class="cn(
			'group peer hidden text-sidebar-foreground md:block',
			'fixed inset-y-0 z-10 h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear',
			side === 'left' ? 'left-0' : 'right-0',
			variant === 'floating' || variant === 'inset'
				? 'p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+--spacing(4)+2px)]'
				: 'group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-r group-data-[side=right]:border-l',
			props.class,
		)"
	>
		<div
			:data-sidebar="'sidebar'"
			class="flex h-full w-full flex-col bg-sidebar group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:border group-data-[variant=floating]:border-sidebar-border group-data-[variant=floating]:shadow-sm"
		>
			<slot />
		</div>
	</div>
</template>
