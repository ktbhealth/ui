<script setup lang="ts">
import { DropdownMenuCheckboxItem, DropdownMenuItemIndicator } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { CheckIcon } from "lucide-vue-next";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		modelValue?: boolean;
		defaultValue?: boolean;
		disabled?: boolean;
		textValue?: string;
		inset?: boolean;
	}>(),
	{ modelValue: undefined, defaultValue: false, disabled: false, inset: false },
);

const emits = defineEmits<{
	(e: "update:modelValue", value: boolean): void;
}>();

const model = computed({
	get: () => props.modelValue ?? props.defaultValue,
	set: (v: boolean | "indeterminate") => emits("update:modelValue", v === true),
});

const classes = computed(() =>
	cn(
		"relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-8 pl-1.5 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
		props.class,
	),
);
</script>

<template>
	<DropdownMenuCheckboxItem
		data-slot="dropdown-menu-checkbox-item"
		:data-inset="inset || undefined"
		:class="classes"
		:model-value="model"
		:disabled="disabled"
		:text-value="textValue"
		@update:model-value="(v) => (model = v as boolean)"
	>
		<span class="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
			<DropdownMenuItemIndicator>
				<CheckIcon class="size-4" />
			</DropdownMenuItemIndicator>
		</span>
		<slot />
	</DropdownMenuCheckboxItem>
</template>
