<script setup lang="ts">
import { ComboboxItem, ComboboxItemIndicator } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { CheckIcon } from "lucide-vue-next";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		value: string;
		disabled?: boolean;
	}>(),
	{ disabled: false },
);

const classes = computed(() =>
	cn(
		"group/command-item relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none in-data-[slot=dialog-content]:rounded-lg! data-[disabled=true]:pointer-events-none data-[disabled=true]:opacity-50 data-selected:bg-muted data-selected:text-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 data-selected:*:[svg]:text-foreground",
		props.class,
	),
);
</script>

<template>
	<ComboboxItem
		data-slot="command-item"
		:value="value"
		:disabled="disabled"
		:class="classes"
	>
		<slot />
		<span class="ml-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-foreground">
			<slot name="shortcut" />
		</span>
	</ComboboxItem>
</template>
