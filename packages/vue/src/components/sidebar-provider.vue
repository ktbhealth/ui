<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { createSidebarContext, sidebarKey, type SidebarContext } from "../lib/sidebar-context";
import { provide } from "vue";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		open?: boolean;
		defaultOpen?: boolean;
		openMobile?: boolean;
		defaultOpenMobile?: boolean;
		keyboardShortcut?: string;
	}>(),
	{ open: undefined, defaultOpen: true, openMobile: undefined, defaultOpenMobile: false, keyboardShortcut: "b" },
);

const emits = defineEmits<{
	(e: "update:open", value: boolean): void;
}>();

const ctx = createSidebarContext({
	open: props.open,
	defaultOpen: props.defaultOpen,
	openMobile: props.openMobile,
	defaultOpenMobile: props.defaultOpenMobile,
});
provide(sidebarKey, ctx);

const classes = computed(() => cn("group/sidebar-wrapper flex min-h-svh w-full", props.class));
</script>

<template>
	<div data-slot="sidebar-wrapper" :class="classes">
		<slot :state="ctx.state" :open="ctx.open" :is-mobile="ctx.isMobile" :toggle-sidebar="ctx.toggleSidebar" />
	</div>
</template>
