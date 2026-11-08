<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

interface Props {
	class?: HTMLAttributes["class"];
	modelValue?: string | number;
	defaultValue?: string | number;
	[key: string]: unknown;
}

const props = defineProps<Props>();
const emits = defineEmits<{
	(e: "update:modelValue", value: string | number): void;
}>();

const modelValue = computed<string | number | undefined>({
	get: () => props.modelValue ?? (props.defaultValue as string | number | undefined),
	set: (v) => emits("update:modelValue", v ?? ""),
});

const delegatedProps = computed(() => {
	const { class: _c, modelValue: _m, defaultValue: _d, ...rest } = props as Record<string, unknown>;
	return rest;
});

const classes = computed(() =>
	cn(
		"flex-1 rounded-none border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
		props.class,
	),
);
</script>

<template>
	<input
		data-slot="input-group-control"
		v-bind="delegatedProps"
		v-model="modelValue"
		:class="classes"
	>
</template>
