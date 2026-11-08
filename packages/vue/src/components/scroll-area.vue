<script setup lang="ts">
import { ScrollAreaCorner, ScrollAreaRoot, ScrollAreaScrollbar, ScrollAreaThumb, ScrollAreaViewport } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{
	class?: HTMLAttributes["class"];
	type?: "auto" | "always" | "scroll" | "hover";
}>();

const classes = computed(() => cn("relative", props.class));
const viewportClasses = computed(() =>
	cn(
		"size-full rounded-[inherit] transition-[color,box-shadow] outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 focus-visible:outline-1",
	),
);
const scrollbarClasses = computed(() =>
	cn(
		"flex touch-none p-px transition-colors select-none data-horizontal:h-2.5 data-horizontal:flex-col data-horizontal:border-t data-horizontal:border-t-transparent data-vertical:h-full data-vertical:w-2.5 data-vertical:border-l data-vertical:border-l-transparent",
	),
);
const thumbClasses = computed(() => cn("relative flex-1 rounded-full bg-border"));
</script>

<template>
	<ScrollAreaRoot data-slot="scroll-area" :type="type ?? 'hover'" :class="classes">
		<ScrollAreaViewport data-slot="scroll-area-viewport" :class="viewportClasses">
			<slot />
		</ScrollAreaViewport>
		<ScrollAreaScrollbar data-slot="scroll-area-scrollbar" orientation="vertical" :class="scrollbarClasses">
			<ScrollAreaThumb data-slot="scroll-area-thumb" :class="thumbClasses" />
		</ScrollAreaScrollbar>
		<ScrollAreaScrollbar data-slot="scroll-area-scrollbar" orientation="horizontal" :class="scrollbarClasses">
			<ScrollAreaThumb data-slot="scroll-area-thumb" :class="thumbClasses" />
		</ScrollAreaScrollbar>
		<ScrollAreaCorner />
	</ScrollAreaRoot>
</template>
