<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("", props.class));
</script>

<template>
	<button
		data-slot="attachment-action"
		type="button"
		:class="classes"
	>
		<slot />
	</button>
</template>
