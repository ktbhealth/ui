<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn("font-heading text-sm font-medium tracking-tight", props.class),
);
</script>

<template>
	<div data-slot="empty-title" :class="classes">
		<slot />
	</div>
</template>
