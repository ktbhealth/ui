<script setup lang="ts">
import { DropdownMenuContent, DropdownMenuPortal } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		side?: "top" | "right" | "bottom" | "left";
		sideOffset?: number;
		align?: "start" | "center" | "end";
		alignOffset?: number;
		collisionPadding?: number;
		avoidCollisions?: boolean;
		sticky?: "partial" | "always";
	}>(),
	{ side: "bottom", sideOffset: 4, align: "start", alignOffset: 0, collisionPadding: 0, avoidCollisions: true, sticky: undefined },
);

const classes = computed(() =>
	cn(
		"z-50 max-h-[var(--available-height)] w-[var(--anchor-width)] min-w-32 origin-[var(--transform-origin)] overflow-x-hidden overflow-y-auto rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 outline-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
		props.class,
	),
);
</script>

<template>
	<DropdownMenuPortal>
		<DropdownMenuContent
			data-slot="dropdown-menu-content"
			:isolate="true"
			:side="side"
			:side-offset="sideOffset"
			:align="align"
			:align-offset="alignOffset"
			:collision-padding="collisionPadding"
			:avoid-collisions="avoidCollisions"
			:sticky="sticky"
			:class="classes"
		>
			<slot />
		</DropdownMenuContent>
	</DropdownMenuPortal>
</template>
