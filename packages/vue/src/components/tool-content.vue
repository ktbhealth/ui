<script setup lang="ts">
import { CollapsibleContent } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("border-t px-3 py-2 text-sm text-muted-foreground", props.class));
</script>

<template>
	<CollapsibleContent data-slot="tool-content" :class="classes">
		<slot />
	</CollapsibleContent>
</template>
