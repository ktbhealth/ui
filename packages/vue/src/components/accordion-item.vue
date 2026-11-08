<script setup lang="ts">
import { AccordionItem } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{
	class?: HTMLAttributes["class"];
	value: string;
	disabled?: boolean;
}>();

const classes = computed(() => cn("not-last:border-b", props.class));
</script>

<template>
	<AccordionItem data-slot="accordion-item" :value="value" :disabled="disabled" :class="classes">
		<slot />
	</AccordionItem>
</template>
