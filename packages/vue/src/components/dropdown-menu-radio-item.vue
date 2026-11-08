<script setup lang="ts">
import { DropdownMenuRadioItem, DropdownMenuItemIndicator } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { CircleIcon } from "lucide-vue-next";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		value: string;
		disabled?: boolean;
		textValue?: string;
		inset?: boolean;
	}>(),
	{ disabled: false, inset: false },
);

const classes = computed(() =>
	cn(
		"relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		props.class,
	),
);
</script>

<template>
	<DropdownMenuRadioItem
		data-slot="dropdown-menu-radio-item"
		:value="value"
		:disabled="disabled"
		:text-value="textValue"
		:data-inset="inset || undefined"
		:class="classes"
	>
		<span class="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
			<DropdownMenuItemIndicator>
				<CircleIcon class="size-2 fill-current" />
			</DropdownMenuItemIndicator>
		</span>
		<slot />
	</DropdownMenuRadioItem>
</template>
