<script setup lang="ts">
import { PopoverClose, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		defaultOpen?: boolean;
		open?: boolean;
		modal?: boolean;
	}>(),
	{ open: undefined, defaultOpen: undefined, modal: false },
);

const emits = defineEmits<{
	(e: "update:open", value: boolean): void;
}>();

const model = computed({
	get: () => props.open ?? props.defaultOpen,
	set: (v: boolean) => emits("update:open", v),
});

const classes = computed(() => cn("popover", props.class));
</script>

<template>
	<PopoverRoot
		data-slot="popover"
		:class="classes"
		:open="model"
		:modal="modal"
		@update:open="(v) => (model = v)"
	>
		<slot />
	</PopoverRoot>
</template>
