<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn("size-4 shrink-0 [&_svg:not([class*='size-'])]:size-4", props.class),
);
</script>

<template>
	<span data-slot="marker-icon" aria-hidden="true" :class="classes">
		<slot />
	</span>
</template>
