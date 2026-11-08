<script setup lang="ts">
import { AccordionContent } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{
	class?: HTMLAttributes["class"];
}>();

const classes = computed(() =>
	cn(
		"overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up",
		"h-[var(--accordion-panel-height)] pt-0 pb-2.5 data-ending-style:h-0 data-starting-style:h-0 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
		props.class,
	),
);
</script>

<template>
	<AccordionContent data-slot="accordion-content" :class="classes">
		<slot />
	</AccordionContent>
</template>
