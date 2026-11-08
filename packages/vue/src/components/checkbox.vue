<script setup lang="ts">
import { CheckboxGroupRoot, CheckboxIndicator, CheckboxRoot } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { CheckIcon } from "lucide-vue-next";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		modelValue?: boolean | "indeterminate";
		defaultValue?: boolean;
		value?: string;
		disabled?: boolean;
		required?: boolean;
		name?: string;
		ariaInvalid?: boolean;
	}>(),
	{ modelValue: undefined, defaultValue: undefined, value: undefined },
);

const emits = defineEmits<{
	(e: "update:modelValue", value: boolean | "indeterminate"): void;
}>();

const model = computed({
	get: () => props.modelValue ?? props.defaultValue ?? false,
	set: (v: boolean | "indeterminate") => emits("update:modelValue", v),
});

const classes = computed(() =>
	cn(
		"peer relative flex size-4 shrink-0 items-center justify-center rounded-[4px] border border-input transition-colors outline-none group-has-disabled/field:opacity-50 group-has-[:focus-visible]/field-label:ring-0 group-has-[:focus-visible]/field-label:not-data-checked:border-input after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 aria-invalid:aria-checked:border-primary dark:bg-input/30 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:border-primary data-checked:bg-primary data-checked:text-primary-foreground group-has-[:focus-visible]/field-label:data-checked:border-primary dark:data-checked:bg-primary",
		props.class,
	),
);
</script>

<template>
	<CheckboxRoot
		data-slot="checkbox"
		:class="classes"
		:model-value="model"
		:value="value"
		:disabled="disabled"
		:required="required"
		:name="name"
		:aria-invalid="ariaInvalid"
		@update:model-value="(v) => (model = v as boolean | 'indeterminate')"
	>
		<CheckboxIndicator data-slot="checkbox-indicator" class="grid place-content-center text-current transition-none [&>svg]:size-3.5">
			<CheckIcon />
		</CheckboxIndicator>
	</CheckboxRoot>
</template>
