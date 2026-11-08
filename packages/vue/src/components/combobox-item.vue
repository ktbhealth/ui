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
		textValue?: string;
	}>(),
	{ disabled: false },
);

const classes = computed(() =>
	cn(
		"relative flex w-full cursor-default items-center gap-2 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none data-highlighted:bg-accent data-highlighted:text-accent-foreground not-data-[variant=destructive]:data-highlighted:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		props.class,
	),
);
</script>

<template>
	<ComboboxItem
		data-slot="combobox-item"
		:value="value"
		:disabled="disabled"
		:text-value="textValue"
		:class="classes"
	>
		<span class="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
			<ComboboxItemIndicator>
				<CheckIcon class="size-4" />
			</ComboboxItemIndicator>
		</span>
		<slot />
	</ComboboxItem>
</template>
