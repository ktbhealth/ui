<script setup lang="ts">
import { MenubarRadioGroup } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{
	class?: HTMLAttributes["class"];
	modelValue?: string;
	defaultValue?: string;
}>();

const emits = defineEmits<{ (e: "update:modelValue", value: string): void }>();

const model = computed({
	get: () => props.modelValue ?? props.defaultValue,
	set: (v: string) => emits("update:modelValue", v),
});

const classes = computed(() => cn("menubar-radio-group", props.class));
</script>

<template>
	<MenubarRadioGroup
		data-slot="menubar-radio-group"
		:class="classes"
		:model-value="model"
		@update:model-value="(v) => (model = v as string)"
	>
		<slot />
	</MenubarRadioGroup>
</template>
