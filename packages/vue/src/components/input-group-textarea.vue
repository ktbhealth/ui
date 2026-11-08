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
		"flex-1 resize-none rounded-none border-0 bg-transparent py-2 shadow-none ring-0 focus-visible:ring-0 disabled:bg-transparent aria-invalid:ring-0 dark:bg-transparent dark:disabled:bg-transparent",
		props.class,
	),
);
</script>

<template>
	<textarea
		data-slot="input-group-control"
		v-bind="delegatedProps"
		v-model="modelValue"
		:class="classes"
	/>
</template>
