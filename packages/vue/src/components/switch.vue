<script lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const switchVariants = cva(
	"peer group/switch relative inline-flex shrink-0 items-center rounded-full border border-transparent transition-all outline-none group-has-[:focus-visible]/field-label:border-transparent group-has-[:focus-visible]/field-label:ring-0 after:absolute after:-inset-x-3 after:-inset-y-2 focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 data-[size=default]:h-[18.4px] data-[size=default]:w-[32px] data-[size=sm]:h-[14px] data-[size=sm]:w-[24px] dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 data-checked:bg-primary data-unchecked:bg-input dark:data-unchecked:bg-input/80 data-disabled:cursor-not-allowed data-disabled:opacity-50",
	{
		variants: {
			size: {
				default: "",
				sm: "",
			},
		},
		defaultVariants: { size: "default" },
	},
);

type SwitchVariants = VariantProps<typeof switchVariants>;
export { switchVariants };
export type { SwitchVariants };
</script>

<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		size?: SwitchVariants["size"];
		modelValue?: boolean;
		defaultValue?: boolean;
		disabled?: boolean;
		required?: boolean;
		name?: string;
		value?: string;
		ariaInvalid?: boolean;
	}>(),
	{ size: "default", modelValue: undefined, defaultValue: false },
);

const emits = defineEmits<{
	(e: "update:modelValue", value: boolean): void;
}>();

const model = computed({
	get: () => props.modelValue ?? props.defaultValue,
	set: (v: boolean) => emits("update:modelValue", v),
});

const classes = computed(() => cn(switchVariants({ size: props.size }), props.class));
const thumbClasses = computed(() =>
	cn(
		"pointer-events-none block rounded-full bg-background ring-0 transition-transform group-data-[size=default]/switch:size-4 group-data-[size=sm]/switch:size-3 group-data-[size=default]/switch:data-checked:translate-x-[calc(100%-2px)] group-data-[size=sm]/switch:data-checked:translate-x-[calc(100%-2px)] dark:data-checked:bg-primary-foreground group-data-[size=default]/switch:data-unchecked:translate-x-0 group-data-[size=sm]/switch:data-unchecked:translate-x-0 dark:data-unchecked:bg-foreground",
	),
);
</script>

<template>
	<SwitchRoot
		data-slot="switch"
		:data-size="size"
		:class="classes"
		:model-value="model"
		:disabled="disabled"
		:required="required"
		:name="name"
		:value="value"
		:aria-invalid="ariaInvalid"
		@update:model-value="(v) => (model = v as boolean)"
	>
		<SwitchThumb data-slot="switch-thumb" :class="thumbClasses" />
	</SwitchRoot>
</template>
