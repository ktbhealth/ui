<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn(
		"flex items-center rounded-b-xl border-t bg-muted/50 p-[var(--card-spacing)]",
		props.class,
	),
);
</script>

<template>
	<div data-slot="card-footer" :class="classes">
		<slot />
	</div>
</template>
