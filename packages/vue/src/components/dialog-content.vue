<script setup lang="ts">
import { DialogContent, DialogOverlay, DialogPortal } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		forceMount?: boolean;
		trapFocus?: boolean;
	}>(),
	{ forceMount: false, trapFocus: true },
);

const classes = computed(() =>
	cn(
		"fixed top-1/2 left-1/2 z-50 grid w-full max-w-[calc(100%-2rem)] -translate-x-1/2 -translate-y-1/2 gap-4 rounded-xl bg-popover p-4 text-sm text-popover-foreground shadow-lg ring-1 ring-foreground/10 duration-100 outline-none data-[size=sm]:max-w-xs data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:max-w-lg",
		props.class,
	),
);
const overlayClasses = computed(() =>
	cn(
		"fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
	),
);
</script>

<template>
	<DialogPortal>
		<DialogOverlay :class="overlayClasses" />
		<DialogContent
			data-slot="dialog-content"
			:force-mount="forceMount"
			:trap-focus="trapFocus"
			:class="classes"
		>
			<slot />
		</DialogContent>
	</DialogPortal>
</template>
