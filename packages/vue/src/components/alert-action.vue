<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("absolute top-2 right-2", props.class));
</script>

<template>
	<div data-slot="alert-action" :class="classes">
		<slot />
	</div>
</template>
