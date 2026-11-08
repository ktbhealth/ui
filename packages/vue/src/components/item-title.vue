<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn(
		"line-clamp-1 flex w-fit items-center gap-2 text-sm leading-snug font-medium underline-offset-4",
		props.class,
	),
);
</script>

<template>
	<div data-slot="item-title" :class="classes">
		<slot />
	</div>
</template>
