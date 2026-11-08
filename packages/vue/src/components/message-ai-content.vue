<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("flex flex-col gap-1 text-sm", props.class));
</script>

<template>
	<div data-slot="message-content" :class="classes">
		<slot />
	</div>
</template>
