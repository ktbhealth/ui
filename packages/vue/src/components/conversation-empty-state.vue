<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn(
		"flex size-full flex-col items-center justify-center gap-3 p-8 text-center text-sm text-muted-foreground",
		props.class,
	),
);
</script>

<template>
	<div data-slot="conversation-empty-state" :class="classes">
		<slot />
	</div>
</template>
