<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{
	class?: HTMLAttributes["class"];
	output?: unknown;
	errorText?: string;
}>();

const text = computed(() => {
	if (props.errorText) return props.errorText;
	if (typeof props.output === "string") return props.output;
	try {
		return JSON.stringify(props.output, null, 2) ?? "";
	} catch {
		return String(props.output);
	}
});

const classes = computed(() =>
	cn(props.errorText ? "text-destructive" : "", props.class),
);
</script>

<template>
	<div data-slot="tool-output" :class="classes">
		<pre class="overflow-x-auto whitespace-pre-wrap font-mono text-xs">{{ text }}</pre>
	</div>
</template>
