<script setup lang="ts">
import { ComboboxGroup } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"]; heading?: string }>();
const classes = computed(() => cn("command-group overflow-hidden p-1 text-foreground", props.class));
</script>

<template>
	<ComboboxGroup data-slot="command-group" :class="classes">
		<div v-if="heading" class="px-2 py-1.5 text-xs font-medium text-muted-foreground">
			{{ heading }}
		</div>
		<slot />
	</ComboboxGroup>
</template>
