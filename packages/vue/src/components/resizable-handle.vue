<script setup lang="ts">
import { computed, inject, onUnmounted, ref, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { resizableGroupKey } from "../lib/resizable-context";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		withHandle?: boolean;
	}>(),
	{ withHandle: false },
);

const el = ref<HTMLElement | null>(null);
const group = inject(resizableGroupKey);
const dragging = ref(false);

function percentOf(el: HTMLElement, horizontal: boolean) {
	const parent = el.parentElement;
	if (!parent) return 0;
	const rect = parent.getBoundingClientRect();
	return horizontal ? rect.width : rect.height;
}

function onPointerDown(e: PointerEvent) {
	if (!el.value || !group) return;
	const horizontal = group.direction !== "vertical";
	const handle = e.currentTarget as HTMLElement;
	const siblings = Array.from(handle.parentElement?.children ?? []).filter(
		(c) => (c as HTMLElement).dataset?.panel !== undefined,
	) as HTMLElement[];
	const idx = siblings.indexOf(handle.previousElementSibling as HTMLElement);
	const before = siblings[idx] ?? null;
	const after = siblings[idx + 1] ?? null;
	if (!before || !after) return;

	const parentSize = percentOf(handle, horizontal);
	const startPos = horizontal ? e.clientX : e.clientY;
	const beforeStart = before.getBoundingClientRect();
	const beforeSize = horizontal ? beforeStart.width : beforeStart.height;
	const afterSize = parentSize - beforeSize;
	const total = beforeSize + afterSize;
	if (total === 0) return;

	dragging.value = true;
	handle.setPointerCapture(e.pointerId);
	document.body.style.cursor = horizontal ? "col-resize" : "row-resize";
	document.body.style.userSelect = "none";

	const onMove = (ev: PointerEvent) => {
		const pos = horizontal ? ev.clientX : ev.clientY;
		const delta = pos - startPos;
		let newBefore = beforeSize + delta;
		newBefore = Math.max(0, Math.min(total, newBefore));
		const pct = (newBefore / total) * 100;
		before.style.flexGrow = String(pct);
		after.style.flexGrow = String(100 - pct);
	};
	const onUp = () => {
		dragging.value = false;
		document.body.style.cursor = "";
		document.body.style.userSelect = "";
		handle.removeEventListener("pointermove", onMove);
		handle.removeEventListener("pointerup", onUp);
		handle.removeEventListener("pointercancel", onUp);
	};
	handle.addEventListener("pointermove", onMove);
	handle.addEventListener("pointerup", onUp);
	handle.addEventListener("pointercancel", onUp);
}

const classes = computed(() =>
	cn(
		"relative flex w-px items-center justify-center bg-border ring-offset-background transition-colors focus-visible:ring-1 focus-visible:ring-ring focus-visible:outline-hidden data-[separator=active]:bg-primary/50",
		group?.direction === "vertical" && "h-px w-full",
		props.class,
	),
);
</script>

<template>
	<div
		ref="el"
		data-slot="resizable-handle"
		role="separator"
		aria-orientation="horizontal"
		:class="classes"
		@pointerdown="onPointerDown"
	>
		<div
			v-if="withHandle"
			class="z-10 flex h-6 w-1 shrink-0 items-center justify-center rounded-lg border bg-border"
		/>
	</div>
</template>
