<script setup lang="ts">
import { DialogDescription } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("text-sm text-muted-foreground", props.class));
</script>

<template>
	<DialogDescription data-slot="sheet-description" :class="classes">
		<slot />
	</DialogDescription>
</template>
