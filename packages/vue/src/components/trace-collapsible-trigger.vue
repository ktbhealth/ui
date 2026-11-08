<script setup lang="ts">
import { CollapsibleTrigger } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import TraceIcon from "./trace-icon.vue";
import { ChevronRightIcon } from "lucide-vue-next";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("flex items-center gap-2", props.class));
</script>

<template>
	<CollapsibleTrigger
		data-slot="trace-collapsible-trigger"
		class="group/trace-collapsible-trigger flex w-full items-center gap-2 text-left"
		:class="classes"
	>
		<slot>
			<TraceIcon class="transition-transform group-aria-expanded/trace-collapsible-trigger:rotate-90">
				<ChevronRightIcon class="size-4" />
			</TraceIcon>
		</slot>
	</CollapsibleTrigger>
</template>
