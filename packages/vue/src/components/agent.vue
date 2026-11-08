<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("text-sm font-medium", props.class));
</script>

<template>
	<span data-slot="agent" :class="classes">
		<slot />
	</span>
</template>
