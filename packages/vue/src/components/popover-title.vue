<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("font-medium", props.class));
</script>

<template>
	<div data-slot="popover-title" :class="classes">
		<slot />
	</div>
</template>
