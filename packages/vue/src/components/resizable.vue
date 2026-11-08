<script setup lang="ts">
import { computed, provide, ref, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { resizableGroupKey } from "../lib/resizable-context";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		direction?: "horizontal" | "vertical";
		autoSaveId?: string;
	}>(),
	{ direction: "horizontal" },
);

const groupEl = ref<HTMLElement | null>(null);
const context = {
	direction: props.direction,
	groupEl: () => groupEl.value,
};
provide(resizableGroupKey, context);

const classes = computed(() =>
	cn("flex h-full w-full", props.direction === "vertical" ? "flex-col" : "", props.class),
);
</script>

<template>
	<div
		ref="groupEl"
		data-slot="resizable-panel-group"
		:data-panel-group="''"
		:data-panel-group-direction="direction"
		:data-panel-group-id="autoSaveId"
		:class="classes"
	>
		<slot />
	</div>
</template>
