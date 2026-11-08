<script setup lang="ts">
import { ComboboxRoot } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		modelValue?: string;
		defaultValue?: string;
		open?: boolean;
		defaultOpen?: boolean;
		disabled?: boolean;
		name?: string;
		required?: boolean;
		navigate?: (item: unknown) => void;
		ignoreFilter?: boolean;
	}>(),
	{ modelValue: undefined, defaultValue: undefined, open: undefined, defaultOpen: undefined, disabled: false, ignoreFilter: false },
);

const emits = defineEmits<{
	(e: "update:modelValue", value: string | undefined): void;
	(e: "update:open", value: boolean): void;
}>();

const model = computed({
	get: () => props.modelValue ?? props.defaultValue,
	set: (v: unknown) => emits("update:modelValue", v as string | undefined),
});
const open = computed({
	get: () => props.open ?? props.defaultOpen,
	set: (v: boolean) => emits("update:open", v),
});

const classes = computed(() => cn("combobox", props.class));
</script>

<template>
	<ComboboxRoot
		data-slot="combobox"
		:class="classes"
		:model-value="model"
		:open="open"
		:disabled="disabled"
		:name="name"
		:required="required"
		@update:model-value="(v) => (model = v as string | undefined)"
		@update:open="(v) => (open = v)"
	>
		<slot />
	</ComboboxRoot>
</template>
