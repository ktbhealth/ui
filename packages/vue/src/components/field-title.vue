<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn(
		"flex w-fit items-center gap-2 text-sm font-medium group-data-[disabled=true]/field:opacity-50",
		props.class,
	),
);
</script>

<template>
	<div data-slot="field-label" :class="classes">
		<slot />
	</div>
</template>
