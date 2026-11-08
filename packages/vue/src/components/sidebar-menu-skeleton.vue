<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import Skeleton from "./skeleton.vue";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		showIcon?: boolean;
	}>(),
	{ showIcon: false },
);

const classes = computed(() =>
	cn("flex h-8 items-center gap-2 rounded-md px-2", props.class),
);
</script>

<template>
	<div data-slot="sidebar-menu-skeleton" data-sidebar="menu-skeleton" :class="classes">
		<Skeleton v-if="showIcon" class="size-4 rounded-md" data-sidebar="menu-skeleton-icon" />
		<Skeleton class="h-4 max-w-[var(--skeleton-width)] flex-1" />
	</div>
</template>
