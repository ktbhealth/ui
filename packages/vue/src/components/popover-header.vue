<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("flex flex-col gap-0.5 text-sm", props.class));
</script>

<template>
	<div data-slot="popover-header" :class="classes">
		<slot />
	</div>
</template>
