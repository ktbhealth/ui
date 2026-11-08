<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("min-w-0 truncate motion-reduce:shimmer-none", props.class));
</script>

<template>
	<span data-slot="trace-title" :class="classes">
		<slot />
	</span>
</template>
