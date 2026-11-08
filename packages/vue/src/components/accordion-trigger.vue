<script setup lang="ts">
import { AccordionHeader, AccordionTrigger } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-vue-next";

const props = defineProps<{
	class?: HTMLAttributes["class"];
}>();

const classes = computed(() =>
	cn(
		"flex flex-1 items-center justify-between gap-2 py-3 text-left text-sm font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180",
		props.class,
	),
);
</script>

<template>
	<AccordionHeader class="flex">
		<AccordionTrigger data-slot="accordion-trigger" :class="classes">
			<slot />
			<slot name="icon">
				<ChevronDownIcon
					data-slot="accordion-trigger-icon"
					class="pointer-events-none shrink-0 transition-transform duration-200 group-aria-expanded/accordion-trigger:rotate-180"
			/>
			</slot>
		</AccordionTrigger>
	</AccordionHeader>
</template>
