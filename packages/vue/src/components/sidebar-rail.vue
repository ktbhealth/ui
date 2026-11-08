<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("h-8 w-full bg-transparent", props.class));
</script>

<template>
	<div
		data-slot="sidebar-rail"
		data-sidebar="rail"
		aria-label="Toggle Sidebar"
		tabindex="0"
		:class="classes"
	>
		<slot />
	</div>
</template>
