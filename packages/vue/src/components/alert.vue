<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const alertVariants = cva(
	"group/alert relative grid w-full gap-0.5 rounded-lg border px-2.5 py-2 text-left text-sm has-data-[slot=alert-action]:relative has-data-[slot=alert-action]:pr-18 has-[>svg]:grid-cols-[auto_1fr] has-[>svg]:gap-x-2 *:[svg]:row-span-2 *:[svg]:translate-y-0.5 *:[svg]:text-current *:[svg:not([class*='size-'])]:size-4",
	{
		variants: {
			variant: {
				default: "bg-card text-card-foreground",
				destructive:
					"bg-card text-destructive *:data-[slot=alert-description]:text-destructive/90 *:[svg]:text-current",
			},
		},
		defaultVariants: { variant: "default" },
	},
);

type AlertVariants = VariantProps<typeof alertVariants>;

const props = withDefaults(
	defineProps<{ class?: HTMLAttributes["class"]; variant?: AlertVariants["variant"] }>(),
	{ variant: "default" },
);

const classes = computed(() => cn(alertVariants({ variant: props.variant }), props.class));
</script>

<template>
	<div data-slot="alert" role="alert" :class="classes">
		<slot />
	</div>
</template>
