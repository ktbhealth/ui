<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("shrink-0 text-muted-foreground/70 tabular-nums", props.class));
</script>

<template>
	<span data-slot="trace-description" :class="classes">
		<slot />
	</span>
</template>
