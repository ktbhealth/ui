<script setup lang="ts">
import { SelectContent, SelectPortal, SelectViewport } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		side?: "top" | "right" | "bottom" | "left";
		sideOffset?: number;
		align?: "start" | "center" | "end";
		alignOffset?: number;
		alignItemWithTrigger?: boolean;
		collisionPadding?: number;
		position?: "item-aligned" | "popper";
	}>(),
	{ side: "bottom", sideOffset: 4, align: "center", alignOffset: 0, alignItemWithTrigger: false, collisionPadding: 0, position: "popper" },
);

const classes = computed(() =>
	cn(
		"relative isolate z-50 max-h-(--available-height) w-(--anchor-width) min-w-36 origin-(--transform-origin) overflow-x-hidden overflow-y-auto rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[align-trigger=true]:animate-none data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
		props.position === "popper" && "data-[side=bottom]:translate-y-1 data-[side=left]:-translate-x-1 data-[side=right]:translate-x-1 data-[side=top]:-translate-y-1",
		props.class,
	),
);
</script>

<template>
	<SelectPortal>
		<SelectContent
			data-slot="select-content"
			:isolate="true"
			:side="side"
			:side-offset="sideOffset"
			:align="align"
			:align-offset="alignOffset"
			:align-item-with-trigger="alignItemWithTrigger"
			:collision-padding="collisionPadding"
			:position="position"
			:class="classes"
		>
			<SelectViewport data-slot="select-viewport" class="p-1">
				<slot />
			</SelectViewport>
		</SelectContent>
	</SelectPortal>
</template>
