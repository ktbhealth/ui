<script setup lang="ts">
import { CollapsibleRoot } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		open?: boolean;
		defaultOpen?: boolean;
	}>(),
	{ open: undefined, defaultOpen: false },
);

const emits = defineEmits<{ (e: "update:open", value: boolean): void }>();

const model = computed({
	get: () => props.open ?? props.defaultOpen,
	set: (v: boolean) => emits("update:open", v),
});

const classes = computed(() => cn("flex w-full min-w-0 flex-col", props.class));
</script>

<template>
	<CollapsibleRoot
		data-slot="trace-collapsible"
		class="group/trace-collapsible"
		:open="model"
		@update:open="(v) => (model = v)"
	>
		<div :class="classes">
			<slot :open="model" />
		</div>
	</CollapsibleRoot>
</template>
