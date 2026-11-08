<script setup lang="ts">
import { CollapsibleContent } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const innerClasses = computed(() => cn("p-2 pl-8", props.class));
</script>

<template>
	<CollapsibleContent
		data-slot="trace-collapsible-content"
		class="h-[var(--collapsible-panel-height)] min-w-0 overflow-hidden transition-[height] duration-200 data-ending-style:h-0 data-starting-style:h-0"
	>
		<div
			data-slot="trace-collapsible-content-inner"
			:class="innerClasses"
		>
			<slot />
		</div>
	</CollapsibleContent>
</template>
