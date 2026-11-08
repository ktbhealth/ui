<script lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const sheetVariants = cva(
	"fixed z-50 flex flex-col gap-4 bg-popover bg-clip-padding text-sm text-popover-foreground shadow-lg transition ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
	{
		variants: {
			side: {
				top: "inset-x-0 top-0 h-auto border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
				bottom:
					"inset-x-0 bottom-0 h-auto border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
				left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
				right:
					"inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm",
			},
		},
		defaultVariants: { side: "right" },
	},
);

type SheetVariants = VariantProps<typeof sheetVariants>;
export { sheetVariants };
export type { SheetVariants };
</script>

<script setup lang="ts">
import { DialogContent, DialogOverlay, DialogPortal } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { XIcon } from "lucide-vue-next";
import SheetClose from "./sheet-close.vue";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		side?: SheetVariants["side"];
		forceMount?: boolean;
	}>(),
	{ side: "right", forceMount: false },
);

const classes = computed(() => cn(sheetVariants({ side: props.side }), props.class));
const overlayClasses = computed(() =>
	cn(
		"fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
	),
);
</script>

<template>
	<DialogPortal>
		<DialogOverlay :class="overlayClasses" />
		<DialogContent data-slot="sheet-content" :force-mount="forceMount" :class="classes">
		<slot />
		<SheetClose
			class="absolute top-4 right-4 rounded-xs opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none data-[state=open]:bg-secondary"
		>
			<XIcon class="size-4" />
			<span class="sr-only">Close</span>
		</SheetClose>
		</DialogContent>
	</DialogPortal>
</template>
