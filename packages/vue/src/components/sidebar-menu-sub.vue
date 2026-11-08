<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5", "group-data-[collapsible=icon]:hidden", props.class));
</script>

<template>
	<ul data-slot="sidebar-menu-sub" data-sidebar="menu-sub" :class="classes">
		<slot />
	</ul>
</template>
