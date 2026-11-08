<script setup lang="ts">
import { AccordionRoot } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		defaultValue?: string | string[];
		modelValue?: string | string[];
		collapsible?: boolean;
		type?: "single" | "multiple";
	}>(),
	{ type: "single", collapsible: true },
);

const emits = defineEmits<{
	(e: "update:modelValue", value: string | string[]): void;
}>();

const model = computed({
	get: () => props.modelValue ?? props.defaultValue,
	set: (v: string | string[] | undefined) =>
		emits("update:modelValue", (v ?? "") as string | string[]),
});

const classes = computed(() => cn("flex w-full flex-col", props.class));
</script>

<template>
	<AccordionRoot
		data-slot="accordion"
		:class="classes"
		:type="type"
		:collapsible="collapsible"
		:model-value="model"
		@update:model-value="(v) => (model = v as string | string[])"
	>
		<slot />
	</AccordionRoot>
</template>
