<script setup lang="ts">
import { CollapsibleContent } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("collapsible-content", props.class));
</script>

<template>
	<CollapsibleContent data-slot="collapsible-content" :class="classes">
		<slot />
	</CollapsibleContent>
</template>
