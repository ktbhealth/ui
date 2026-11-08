<script setup lang="ts">
import { TooltipRoot } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		defaultOpen?: boolean;
		open?: boolean;
	}>(),
	{ open: undefined, defaultOpen: undefined },
);

const emits = defineEmits<{
	(e: "update:open", value: boolean): void;
}>();

const model = computed({
	get: () => props.open ?? props.defaultOpen,
	set: (v: boolean) => emits("update:open", v),
});

const classes = computed(() => cn("", props.class));
</script>

<template>
	<TooltipRoot
		data-slot="tooltip"
		:class="classes"
		:open="model"
		@update:open="(v) => (model = v)"
	>
		<slot />
	</TooltipRoot>
</template>
