<script setup lang="ts">
import { SelectItem, SelectItemIndicator, SelectItemText } from "reka-ui";
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
		"relative flex w-full cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground not-data-[variant=destructive]:focus:**:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4 *:[span]:last:flex *:[span]:last:items-center *:[span]:last:gap-2",
		props.class,
	),
);
</script>

<template>
	<SelectItem data-slot="select-item" :value="value" :disabled="disabled" :text-value="textValue" :class="classes">
		<span class="absolute right-2 flex size-4 items-center justify-center">
			<SelectItemIndicator>
				<CheckIcon class="size-4" />
			</SelectItemIndicator>
		</span>
		<SelectItemText>
			<slot />
		</SelectItemText>
	</SelectItem>
</template>
