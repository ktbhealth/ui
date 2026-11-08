<script setup lang="ts">
import { MenubarRoot } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		defaultValue?: string;
		modelValue?: string;
	}>(),
	{ modelValue: undefined, defaultValue: undefined },
);

const emits = defineEmits<{ (e: "update:modelValue", value: string): void }>();

const model = computed({
	get: () => props.modelValue ?? props.defaultValue,
	set: (v: string) => emits("update:modelValue", v),
});

const classes = computed(() => cn("flex h-8 items-center gap-0.5 rounded-lg border p-[3px]", props.class));
</script>

<template>
	<MenubarRoot
		data-slot="menubar"
		:class="classes"
		:model-value="model"
		@update:model-value="(v: unknown) => { if (typeof v === 'string') model = v; }"
	>
		<slot />
	</MenubarRoot>
</template>
