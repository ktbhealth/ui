<script setup lang="ts">
import { computed, inject, onMounted, onUnmounted, ref, useId, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { resizableGroupKey } from "../lib/resizable-context";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		defaultSize?: number;
		minSize?: number;
		maxSize?: number;
		collapsible?: boolean;
		collapsedSize?: number;
	}>(),
	{ defaultSize: undefined, minSize: 0, maxSize: 100, collapsible: false, collapsedSize: 0 },
);

const panelId = useId();
const el = ref<HTMLElement | null>(null);
const group = inject(resizableGroupKey);

const style = computed(() => ({
	flexGrow: props.defaultSize ?? 1,
	flexShrink: 1,
	flexBasis: 0,
	minWidth: group?.direction === "vertical" ? undefined : "0px",
	minHeight: group?.direction === "vertical" ? "0px" : undefined,
	overflow: "hidden",
}));

onMounted(() => {
	if (el.value) el.value.dataset.panel = panelId;
});
</script>

<template>
	<div
		ref="el"
		data-slot="resizable-panel"
		:data-panel="panelId"
		:data-panel-size="defaultSize"
		:data-panel-min-size="minSize"
		:data-panel-max-size="maxSize"
		:data-panel-collapsible="collapsible"
		:data-panel-collapsed-size="collapsedSize"
		:style="style"
		:class="cn('relative', props.class)"
	>
		<slot />
	</div>
</template>
