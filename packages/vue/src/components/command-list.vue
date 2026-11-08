<script setup lang="ts">
import { ComboboxViewport } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn(
		"no-scrollbar max-h-72 scroll-py-1 overflow-x-hidden overflow-y-auto outline-none",
		props.class,
	),
);
</script>

<template>
	<ComboboxViewport data-slot="command-list" :class="classes">
		<slot />
	</ComboboxViewport>
</template>
