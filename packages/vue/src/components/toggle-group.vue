<script lang="ts">
import { cva, type VariantProps } from "class-variance-authority";
import { toggleVariants } from "./toggle.vue";

const toggleGroupVariants = cva(
	"group/toggle-group flex w-fit flex-row items-center gap-[calc(var(--spacing, 0.25rem) * var(--gap))] rounded-lg data-[size=sm]:rounded-[min(var(--radius-md),10px)] data-vertical:flex-col data-vertical:items-stretch",
	{
		variants: {
			orientation: {
				horizontal: "",
				vertical: "",
			},
			size: {
				default: "",
				sm: "",
				lg: "",
			},
		},
		defaultVariants: { orientation: "horizontal", size: "default" },
	},
);

type ToggleGroupVariants = VariantProps<typeof toggleGroupVariants>;
export { toggleGroupVariants, toggleVariants };
export type { ToggleGroupVariants };
</script>

<script setup lang="ts">
import { ToggleGroupRoot } from "reka-ui";
import { computed, provide, ref, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { toggleGroupKey } from "../lib/toggle-group-context";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		modelValue?: string | string[];
		defaultValue?: string | string[];
		type?: "single" | "multiple";
		variant?: "default" | "outline";
		size?: "default" | "sm" | "lg";
		orientation?: "horizontal" | "vertical";
		disabled?: boolean;
		spacing?: number;
		rovingFocus?: boolean;
		loop?: boolean;
	}>(),
	{
		modelValue: undefined,
		defaultValue: undefined,
		type: "single",
		variant: "default",
		size: "default",
		orientation: "horizontal",
		disabled: false,
		spacing: 0,
		rovingFocus: true,
		loop: true,
	},
);

const emits = defineEmits<{
	(e: "update:modelValue", value: string | string[]): void;
}>();

const model = computed({
	get: () => props.modelValue ?? props.defaultValue,
	set: (v: string | string[] | undefined) =>
		emits("update:modelValue", (v ?? "") as string | string[]),
});

const classes = computed(() =>
	cn(toggleGroupVariants({ orientation: props.orientation, size: props.size }), props.class),
);
const style = computed(() => ({ "--gap": props.spacing }));

const context = ref({ variant: props.variant, size: props.size, spacing: props.spacing });
provide(toggleGroupKey, context);
</script>

<template>
	<ToggleGroupRoot
		data-slot="toggle-group"
		:data-variant="variant"
		:data-size="size"
		:data-orientation="orientation"
		:data-spacing="spacing === 0 ? 'none' : spacing"
		:class="classes"
		:style="style"
		:type="type"
		:model-value="model"
		:disabled="disabled"
		:roving-focus="rovingFocus"
		:loop="loop"
		@update:model-value="(v) => (model = v as string | string[])"
	>
		<slot />
	</ToggleGroupRoot>
</template>
