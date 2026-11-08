<script setup lang="ts">
import { ContextMenuSubContent } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		sideOffset?: number;
		alignOffset?: number;
		collisionPadding?: number;
	}>(),
	{ sideOffset: 0, alignOffset: -3, collisionPadding: 0 },
);

const classes = computed(() =>
	cn(
		"z-50 min-w-32 origin-[var(--transform-origin)] overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
		props.class,
	),
);
</script>

<template>
	<ContextMenuSubContent
		data-slot="context-menu-sub-content"
		:isolate="true"
		:side-offset="sideOffset"
		:align-offset="alignOffset"
		:collision-padding="collisionPadding"
		:class="classes"
	>
		<slot />
	</ContextMenuSubContent>
</template>
