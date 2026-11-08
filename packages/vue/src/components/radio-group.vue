<script setup lang="ts">
import { RadioGroupRoot } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		modelValue?: string;
		defaultValue?: string;
		disabled?: boolean;
		required?: boolean;
		name?: string;
		orientation?: "vertical" | "horizontal";
		ariaInvalid?: boolean;
	}>(),
	{ modelValue: undefined, defaultValue: undefined, orientation: "vertical" },
);

const emits = defineEmits<{
	(e: "update:modelValue", value: string): void;
}>();

const model = computed({
	get: () => props.modelValue ?? props.defaultValue,
	set: (v: string) => emits("update:modelValue", v),
});

const classes = computed(() =>
	cn(
		"grid w-full gap-2 data-[orientation=horizontal]:flex data-[orientation=horizontal]:flex-wrap",
		props.class,
	),
);
</script>

<template>
	<RadioGroupRoot
		data-slot="radio-group"
		:data-orientation="orientation"
		:class="classes"
		:model-value="model"
		:disabled="disabled"
		:required="required"
		:name="name"
		@update:model-value="(v) => (model = v as string)"
	>
		<slot />
	</RadioGroupRoot>
</template>

