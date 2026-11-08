<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn(
		"font-heading text-base leading-snug font-medium group-data-[size=sm]/card:text-sm",
		props.class,
	),
);
</script>

<template>
	<div data-slot="card-title" :class="classes">
		<slot />
	</div>
</template>
