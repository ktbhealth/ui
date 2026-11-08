<script setup lang="ts">
import { ComboboxLabel } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("px-1.5 py-1 text-xs text-muted-foreground", props.class));
</script>

<template>
	<ComboboxLabel data-slot="combobox-label" :class="classes">
		<slot />
	</ComboboxLabel>
</template>
