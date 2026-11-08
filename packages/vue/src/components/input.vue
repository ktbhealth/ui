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
		"h-8 w-full min-w-0 rounded-lg border border-input bg-transparent px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
		props.class,
	),
);
</script>

<template>
	<input
		data-slot="input"
		v-bind="delegatedProps"
		v-model="modelValue"
		:class="classes"
	>
</template>
