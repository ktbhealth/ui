<script setup lang="ts">
import { MenubarCheckboxItem, MenubarItemIndicator } from "reka-ui";
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

const emits = defineEmits<{ (e: "update:modelValue", value: boolean): void }>();

const model = computed({
	get: () => props.modelValue ?? props.defaultValue,
	set: (v: boolean | "indeterminate") => emits("update:modelValue", v === true),
});

const classes = computed(() =>
	cn(
		"relative flex cursor-default items-center gap-1.5 rounded-md py-1 pr-1.5 pl-7 text-sm outline-hidden select-none focus:bg-accent focus:text-accent-foreground focus:**:text-accent-foreground data-inset:pl-7 data-disabled:pointer-events-none data-disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0",
		props.class,
	),
);
</script>

<template>
	<MenubarCheckboxItem
		data-slot="menubar-checkbox-item"
		:data-inset="inset || undefined"
		:class="classes"
		:model-value="model"
		:disabled="disabled"
		:text-value="textValue"
		@update:model-value="(v) => (model = v as boolean)"
	>
		<span class="pointer-events-none absolute left-1.5 flex size-4 items-center justify-center [&_svg:not([class*='size-'])]:size-4">
			<MenubarItemIndicator>
				<CheckIcon class="size-4" />
			</MenubarItemIndicator>
		</span>
		<slot />
	</MenubarCheckboxItem>
</template>
