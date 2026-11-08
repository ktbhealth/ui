<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("", props.class));
</script>

<template>
	<span data-slot="message-response" :class="classes">
		<slot />
	</span>
</template>
