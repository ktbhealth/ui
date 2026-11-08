<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn(
		"flex w-full max-w-sm min-w-0 flex-col items-center gap-2.5 text-sm text-balance",
		props.class,
	),
);
</script>

<template>
	<div data-slot="empty-content" :class="classes">
		<slot />
	</div>
</template>
