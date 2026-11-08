<script setup lang="ts">
import { MenubarContent, MenubarPortal } from "reka-ui";
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
	}>(),
	{ side: "bottom", sideOffset: 4, align: "start", alignOffset: 0, collisionPadding: 0 },
);

const classes = computed(() =>
	cn(
		"z-50 min-w-36 origin-(--transform-origin) overflow-hidden rounded-lg bg-popover p-1 text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95",
		props.class,
	),
);
</script>

<template>
	<MenubarPortal>
		<MenubarContent
			data-slot="menubar-content"
			:isolate="true"
			:side="side"
			:side-offset="sideOffset"
			:align="align"
			:align-offset="alignOffset"
			:collision-padding="collisionPadding"
			:class="classes"
		>
			<slot />
		</MenubarContent>
	</MenubarPortal>
</template>
