<script setup lang="ts">
import { DropdownMenuSubTrigger } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { ChevronRightIcon } from "lucide-vue-next";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		inset?: boolean;
		disabled?: boolean;
		textValue?: string;
	}>(),
	{ inset: false, disabled: false },
);

const classes = computed(() =>
	cn(
		"flex cursor-default items-center gap-1.5 rounded-md px-1.5 py-1 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-inset:pl-7 data-popup-open:bg-accent data-popup-open:text-accent-foreground data-open:bg-accent data-open:text-accent-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		props.class,
	),
);
</script>

<template>
	<DropdownMenuSubTrigger
		data-slot="dropdown-menu-sub-trigger"
		:data-inset="inset || undefined"
		:class="classes"
		:disabled="disabled"
		:text-value="textValue"
	>
		<slot />
		<ChevronRightIcon class="ml-auto size-4" />
	</DropdownMenuSubTrigger>
</template>
