<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn(
		"flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opacity] duration-200 ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0",
		"group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0",
		props.class,
	),
);
</script>

<template>
	<div data-slot="sidebar-group-label" data-sidebar="group-label" :class="classes">
		<slot />
	</div>
</template>
