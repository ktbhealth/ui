<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn(
		"pointer-events-none inline-flex items-center justify-center gap-1 rounded-sm bg-muted px-1.5 py-0.5 font-mono text-[0.7rem] font-medium text-muted-foreground select-none",
		props.class,
	),
);
</script>

<template>
	<kbd data-slot="kbd" :class="classes">
		<slot />
	</kbd>
</template>
