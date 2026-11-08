<script setup lang="ts">
import { CollapsibleTrigger } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { BrainIcon, ChevronDownIcon } from "lucide-vue-next";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn(
		"flex w-full items-center justify-between gap-4 rounded-t-md border-b px-3 py-2 text-muted-foreground text-sm hover:text-foreground",
		props.class,
	),
);
</script>

<template>
	<CollapsibleTrigger
		data-slot="reasoning-trigger"
		class="group/reasoning-trigger"
		:class="classes"
	>
		<slot>
			<span class="flex items-center gap-2">
				<BrainIcon class="size-4" />
				Reasoning
			</span>
		</slot>
		<ChevronDownIcon class="size-4 transition-transform group-data-[state=open]/reasoning-trigger:rotate-180" />
	</CollapsibleTrigger>
</template>
