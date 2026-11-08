<script setup lang="ts">
import { ComboboxRoot } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		modelValue?: string;
		defaultValue?: string;
		shouldFilter?: boolean;
	}>(),
	{ modelValue: undefined, defaultValue: undefined, shouldFilter: true },
);

const emits = defineEmits<{ (e: "update:modelValue", value: string | undefined): void }>();

const model = computed({
	get: () => props.modelValue ?? props.defaultValue,
	set: (v: unknown) => emits("update:modelValue", v as string | undefined),
});

const classes = computed(() =>
	cn("flex size-full flex-col overflow-hidden rounded-xl! bg-popover p-1 text-popover-foreground", props.class),
);
</script>

<template>
	<ComboboxRoot
		data-slot="command"
		:class="classes"
		:model-value="model"
		:open="true"
		@update:model-value="(v) => (model = v as string | undefined)"
	>
		<slot />
	</ComboboxRoot>
</template>
