<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("flex items-center px-3 pb-3 text-muted-foreground", props.class));
</script>

<template>
	<div data-slot="code-block-footer" :class="classes">
		<slot />
	</div>
</template>
