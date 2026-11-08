<script setup lang="ts">
import { useVModel } from "@vueuse/core";
import { computed, type HTMLAttributes, type TextareaHTMLAttributes } from "vue";
import { cn } from "../lib/utils";

interface Props extends /* @vue-ignore */ TextareaHTMLAttributes {
	class?: HTMLAttributes["class"];
	modelValue?: string;
	defaultValue?: string;
}

const props = defineProps<Props>();
const emits = defineEmits<{
	(e: "update:modelValue", value: string): void;
}>();

const modelValue = useVModel(props, "modelValue", emits, {
	defaultValue: props.defaultValue,
	passive: true,
});

const delegatedProps = computed(() => {
	const { class: _, modelValue: _m, defaultValue: _d, ...rest } = props;
	return rest;
});

const classes = computed(() =>
	cn(
		"flex field-sizing-content min-h-16 w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-base transition-colors outline-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
		props.class,
	),
);
</script>

<template>
	<textarea
		data-slot="textarea"
		v-bind="delegatedProps"
		v-model="modelValue"
		:class="classes"
	/>
</template>
