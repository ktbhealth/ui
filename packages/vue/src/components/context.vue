<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("text-xs text-muted-foreground", props.class));
</script>

<template>
	<span data-slot="context" :class="classes">
		<slot />
	</span>
</template>
