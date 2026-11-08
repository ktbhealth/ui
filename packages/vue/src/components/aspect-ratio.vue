<script setup lang="ts">
import { AspectRatio } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		ratio?: number;
	}>(),
	{ ratio: 1 },
);

const classes = computed(() => cn("relative aspect-[var(--ratio)]", props.class));
const style = computed(() => ({ "--ratio": props.ratio }));
</script>

<template>
	<AspectRatio data-slot="aspect-ratio" :ratio="ratio" :class="classes" :style="style">
		<slot />
	</AspectRatio>
</template>
