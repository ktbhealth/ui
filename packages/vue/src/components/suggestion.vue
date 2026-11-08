<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("flex w-full gap-2 overflow-x-auto", props.class));
</script>

<template>
	<div data-slot="suggestions" :class="classes">
		<slot />
	</div>
</template>
