<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn(
		"ml-auto text-xs tracking-widest text-muted-foreground group-focus/menubar-item:text-accent-foreground",
		props.class,
	),
);
</script>

<template>
	<span data-slot="menubar-shortcut" :class="classes">
		<slot />
	</span>
</template>
