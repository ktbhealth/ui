<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn(
		"overflow-x-auto bg-muted/30 p-3 text-xs [&_pre]:m-0 [&_pre]:font-mono [&_code]:font-mono",
		props.class,
	),
);
</script>

<template>
	<div data-slot="code-block-content" tabindex="0" :class="classes">
		<slot />
	</div>
</template>
