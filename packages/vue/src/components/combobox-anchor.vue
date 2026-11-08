<script setup lang="ts">
import { ComboboxAnchor } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("combobox-anchor", props.class));
</script>

<template>
	<ComboboxAnchor data-slot="combobox-anchor" :class="classes">
		<slot />
	</ComboboxAnchor>
</template>
