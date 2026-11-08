<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{
	class?: HTMLAttributes["class"];
	input?: unknown;
}>();

const text = computed(() => {
	if (typeof props.input === "string") return props.input;
	try {
		return JSON.stringify(props.input, null, 2) ?? "";
	} catch {
		return String(props.input);
	}
});

const classes = computed(() => cn("", props.class));
</script>

<template>
	<div data-slot="tool-input" :class="classes">
		<pre class="overflow-x-auto whitespace-pre-wrap font-mono text-xs">{{ text }}</pre>
	</div>
</template>
