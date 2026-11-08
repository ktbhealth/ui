<script setup lang="ts">
import { ComboboxContent, ComboboxPortal } from "reka-ui";
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
		"group/combobox-content relative z-50 max-h-[var(--available-height)] w-[var(--anchor-width)] min-w-[calc(var(--anchor-width)+calc(var(--spacing,0.25rem)*7))] origin-[var(--transform-origin)] overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10 duration-100 data-[chips=true]:min-w-[var(--anchor-width)] data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 *:data-[slot=input-group]:m-1 *:data-[slot=input-group]:mb-0 *:data-[slot=input-group]:h-8 *:data-[slot=input-group]:border-input/30 *:data-[slot=input-group]:bg-input/30 *:data-[slot=input-group]:shadow-none data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
		props.class,
	),
);
</script>

<template>
	<ComboboxPortal>
		<ComboboxContent
			data-slot="combobox-content"
			:isolate="true"
			:side="side"
			:side-offset="sideOffset"
			:align="align"
			:align-offset="alignOffset"
			:collision-padding="collisionPadding"
			:class="classes"
		>
			<slot />
		</ComboboxContent>
	</ComboboxPortal>
</template>
