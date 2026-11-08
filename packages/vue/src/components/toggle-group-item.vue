<script setup lang="ts">
import { ToggleGroupItem as RekaToggleGroupItem } from "reka-ui";
import { computed, inject, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { toggleVariants, type ToggleVariants } from "./toggle.vue";
import { toggleGroupKey } from "../lib/toggle-group-context";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		value: string;
		variant?: ToggleVariants["variant"];
		size?: ToggleVariants["size"];
		disabled?: boolean;
		ariaInvalid?: boolean;
	}>(),
	{ variant: undefined, size: undefined, disabled: false },
);

const group = inject(toggleGroupKey, undefined);

const resolvedVariant = computed(
	() => props.variant ?? (group?.value.variant as ToggleVariants["variant"]) ?? "default",
);
const resolvedSize = computed(
	() => props.size ?? (group?.value.size as ToggleVariants["size"]) ?? "default",
);

const classes = computed(() =>
	cn(
		toggleVariants({ variant: resolvedVariant.value, size: resolvedSize.value }),
		"shrink-0 group-data-[spacing=0]/toggle-group:rounded-none group-data-[spacing=0]/toggle-group:px-2 focus:z-10 focus-visible:z-10 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-end]:pr-1.5 group-data-[spacing=0]/toggle-group:has-data-[icon=inline-start]:pl-1.5 group-data-horizontal/toggle-group:data-[spacing=0]:first:rounded-l-lg group-data-vertical/toggle-group:data-[spacing=0]:first:rounded-t-lg group-data-horizontal/toggle-group:data-[spacing=0]:last:rounded-r-lg group-data-vertical/toggle-group:data-[spacing=0]:last:rounded-b-lg group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:border-l-0 group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:border-t-0 group-data-horizontal/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-l group-data-vertical/toggle-group:data-[spacing=0]:data-[variant=outline]:first:border-t",
		props.class,
	),
);
</script>

<template>
	<RekaToggleGroupItem
		data-slot="toggle-group-item"
		:value="value"
		:disabled="disabled"
		:aria-invalid="ariaInvalid"
		:class="classes"
	>
		<slot />
	</RekaToggleGroupItem>
</template>
