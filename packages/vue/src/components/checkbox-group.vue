<script setup lang="ts">
import { CheckboxGroupRoot } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		modelValue?: string[];
		defaultValue?: string[];
		disabled?: boolean;
		required?: boolean;
		name?: string;
		orientation?: "vertical" | "horizontal";
	}>(),
	{ modelValue: undefined, defaultValue: undefined, orientation: "vertical" },
);

const emits = defineEmits<{
	(e: "update:modelValue", value: string[]): void;
}>();

const model = computed({
	get: () => props.modelValue ?? props.defaultValue ?? [],
	set: (v: string[]) => emits("update:modelValue", v ?? []),
});

const classes = computed(() =>
	cn(
		"group/checkbox-group flex w-full flex-col gap-3 has-data-[orientation=horizontal]:flex-row has-data-[orientation=horizontal]:flex-wrap has-data-[orientation=horizontal]:gap-4",
		props.class,
	),
);
</script>

<template>
	<CheckboxGroupRoot
		data-slot="checkbox-group"
		:data-orientation="orientation"
		:class="classes"
		:model-value="model"
		:disabled="disabled"
		:required="required"
		:name="name"
		@update:model-value="(v) => (model = (v ?? []) as string[])"
	>
		<slot />
	</CheckboxGroupRoot>
</template>
