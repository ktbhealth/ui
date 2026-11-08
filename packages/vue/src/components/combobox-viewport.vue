<script setup lang="ts">
import { ComboboxViewport } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn(
		"no-scrollbar max-h-[min(calc(--spacing(72)---spacing(9)),calc(var(--available-height)---spacing(9)))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0",
		props.class,
	),
);
</script>

<template>
	<ComboboxViewport data-slot="combobox-list" :class="classes">
		<slot />
	</ComboboxViewport>
</template>
