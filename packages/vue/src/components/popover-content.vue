<script setup lang="ts">
import { PopoverContent, PopoverPortal } from "reka-ui";
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
		collisionPadding?: number;
		sticky?: "partial" | "always";
		avoidCollisions?: boolean;
	}>(),
	{ side: "bottom", sideOffset: 4, align: "center", alignOffset: 0, arrowPadding: 0, collisionPadding: 0, sticky: undefined, avoidCollisions: true },
);

const classes = computed(() =>
	cn(
		"z-50 flex w-72 origin-[var(--transform-origin)] flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
		props.class,
	),
);
</script>

<template>
	<PopoverPortal>
		<PopoverContent
			data-slot="popover-content"
			:isolate="true"
			:side="side"
			:side-offset="sideOffset"
			:align="align"
			:align-offset="alignOffset"
			:arrow-padding="arrowPadding"
			:collision-padding="collisionPadding"
			:sticky="sticky"
			:avoid-collisions="avoidCollisions"
			:class="classes"
		>
			<slot />
		</PopoverContent>
	</PopoverPortal>
</template>
