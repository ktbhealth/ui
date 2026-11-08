<script setup lang="ts">
import { CollapsibleContent, CollapsibleRoot, CollapsibleTrigger } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		open?: boolean;
		defaultOpen?: boolean;
		disabled?: boolean;
	}>(),
	{ open: undefined, defaultOpen: false, disabled: false },
);

const emits = defineEmits<{
	(e: "update:open", value: boolean): void;
}>();

const model = computed({
	get: () => props.open ?? props.defaultOpen,
	set: (v: boolean) => emits("update:open", v),
});

const classes = computed(() => cn("collapsible", props.class));
</script>

<template>
	<CollapsibleRoot
		data-slot="collapsible"
		:class="classes"
		:open="model"
		:disabled="disabled"
		@update:open="(v) => (model = v)"
	>
		<slot />
	</CollapsibleRoot>
</template>

<script lang="ts">
export {};
</script>
