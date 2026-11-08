<script setup lang="ts">
import { SelectRoot } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		modelValue?: string;
		defaultValue?: string;
		disabled?: boolean;
		name?: string;
		required?: boolean;
		multiple?: boolean;
		open?: boolean;
		defaultOpen?: boolean;
	}>(),
	{ modelValue: undefined, defaultValue: undefined, open: undefined, defaultOpen: undefined, multiple: false },
);

const emits = defineEmits<{
	(e: "update:modelValue", value: string | string[] | undefined): void;
	(e: "update:open", value: boolean): void;
}>();

const model = computed({
	get: () => props.modelValue ?? props.defaultValue,
	set: (v: string | string[] | undefined) => emits("update:modelValue", v),
});

const openModel = computed({
	get: () => props.open ?? props.defaultOpen,
	set: (v: boolean) => emits("update:open", v),
});

const classes = computed(() => cn("select", props.class));
</script>

<template>
	<SelectRoot
		data-slot="select"
		:class="classes"
		:model-value="model"
		:open="openModel"
		:disabled="disabled"
		:name="name"
		:required="required"
		:multiple="multiple"
		@update:model-value="(v) => (model = v as string | string[] | undefined)"
		@update:open="(v) => (openModel = v)"
	>
		<slot />
	</SelectRoot>
</template>
