<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("flex w-full min-w-0 flex-col gap-1", props.class));
</script>

<template>
	<ul data-slot="sidebar-menu" data-sidebar="menu" :class="classes">
		<slot />
	</ul>
</template>
