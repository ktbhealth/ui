<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("text-muted-foreground", props.class));
</script>

<template>
	<div data-slot="popover-description" :class="classes">
		<slot />
	</div>
</template>
