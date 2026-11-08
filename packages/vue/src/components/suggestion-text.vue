<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn("inline-flex items-center rounded-full border border-dashed px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary/40 hover:text-foreground", props.class),
);
</script>

<template>
	<button
		data-slot="suggestion-text"
		type="button"
		:class="classes"
	>
		<slot />
	</button>
</template>
