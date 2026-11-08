<script setup lang="ts">
import { HoverCardContent, HoverCardPortal } from "reka-ui";
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
	{ side: "bottom", sideOffset: 4, align: "center", alignOffset: 0, arrowPadding: 0 },
);

const classes = computed(() =>
	cn(
		"z-50 w-64 origin-(--transform-origin) rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
		props.class,
	),
);
</script>

<template>
	<HoverCardPortal data-slot="hover-card-portal">
		<HoverCardContent
			data-slot="hover-card-content"
			:isolate="true"
			:side="side"
			:side-offset="sideOffset"
			:align="align"
			:align-offset="alignOffset"
			:arrow-padding="arrowPadding"
			:class="classes"
		>
			<slot />
		</HoverCardContent>
	</HoverCardPortal>
</template>
