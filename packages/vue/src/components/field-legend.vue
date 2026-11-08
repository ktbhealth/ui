<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{ class?: HTMLAttributes["class"]; variant?: "legend" | "label" }>(),
	{ variant: "legend" },
);
const classes = computed(() =>
	cn(
		"mb-1.5 font-medium data-[variant=label]:text-sm data-[variant=legend]:text-base",
		props.class,
	),
);
</script>

<template>
	<legend data-slot="field-legend" :data-variant="variant" :class="classes">
		<slot />
	</legend>
</template>
