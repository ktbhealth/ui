<script setup lang="ts">
import { TooltipArrow, TooltipContent, TooltipPortal } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		side?: "top" | "right" | "bottom" | "left";
		sideOffset?: number;
		align?: "start" | "center" | "end";
		alignOffset?: number;
		arrowPadding?: number;
	}>(),
	{ side: "top", sideOffset: 0, align: "center", alignOffset: 0, arrowPadding: 0 },
);

const classes = computed(() =>
	cn(
		"z-50 w-fit origin-(--transform-origin) rounded-md bg-foreground px-3 py-1.5 text-xs text-balance text-background animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
		props.class,
	),
);
</script>

<template>
	<TooltipPortal>
		<TooltipContent
			data-slot="tooltip-content"
			:isolate="true"
			:side="side"
			:side-offset="sideOffset"
			:align="align"
			:align-offset="alignOffset"
			:arrow-padding="arrowPadding"
			:class="classes"
		>
			<slot />
			<TooltipArrow class="z-50 size-2.5 translate-y-[calc(-50%-2px)] rotate-45 rounded-[2px] bg-foreground fill-foreground" />
		</TooltipContent>
	</TooltipPortal>
</template>
