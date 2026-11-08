<script lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const buttonGroupVariants = cva(
	"flex w-fit items-stretch *:focus-visible:relative *:focus-visible:z-10 has-[>[data-slot=button-group]]:gap-2 has-[select[aria-hidden=true]:last-child]:[&>[data-slot=select-trigger]:last-of-type]:rounded-r-lg [&>[data-slot=select-trigger]:not([class*='w-'])]:w-fit [&>input]:flex-1",
	{
		variants: {
			orientation: {
				horizontal:
					"[&>*:not(:first-child)]:rounded-l-none [&>*:not(:first-child)]:border-l-0 [&>*:not(:last-child)]:rounded-r-none",
				vertical:
					"flex-col *:data-slot:rounded-b-none [&>[data-slot]:not(:has(~[data-slot]))]:rounded-b-lg! [&>[data-slot]~[data-slot]]:rounded-t-none [&>[data-slot]~[data-slot]]:border-t-0",
			},
		},
		defaultVariants: { orientation: "horizontal" },
	},
);

type ButtonGroupVariants = VariantProps<typeof buttonGroupVariants>;
export { buttonGroupVariants };
export type { ButtonGroupVariants };
</script>

<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		orientation?: ButtonGroupVariants["orientation"];
	}>(),
	{ orientation: "horizontal" },
);

const classes = computed(() =>
	cn(buttonGroupVariants({ orientation: props.orientation }), props.class),
);
</script>

<template>
	<div role="group" data-slot="button-group" :data-orientation="orientation" :class="classes">
		<slot />
	</div>
</template>
