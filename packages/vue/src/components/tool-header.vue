<script setup lang="ts">
import { CollapsibleTrigger } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { ChevronRightIcon } from "lucide-vue-next";

const props = defineProps<{
	class?: HTMLAttributes["class"];
	name?: string;
	state?: string;
}>();

const classes = computed(() =>
	cn("flex w-full items-center gap-2 px-3 py-2 text-left text-sm font-medium hover:text-foreground", props.class),
);

const badge = computed(() => {
	switch (props.state) {
		case "output-available":
			return "Done";
		case "output-error":
			return "Error";
		case "input-streaming":
			return "Running";
		default:
			return "Pending";
	}
});
</script>

<template>
	<CollapsibleTrigger
		data-slot="tool-header"
		class="group/tool-header"
		:class="classes"
	>
		<ChevronRightIcon class="size-4 shrink-0 transition-transform group-data-[state=open]/tool:rotate-90" />
		<span class="min-w-0 flex-1 truncate">{{ name ?? "Tool" }}</span>
		<span
			data-slot="tool-status"
			class="shrink-0 rounded-sm bg-muted px-1.5 py-0.5 text-xs text-muted-foreground"
		>
			{{ badge }}
		</span>
		<slot />
	</CollapsibleTrigger>
</template>
