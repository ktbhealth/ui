<script lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const fieldVariants = cva("group/field flex w-full gap-2 data-[invalid=true]:text-destructive", {
	variants: {
		orientation: {
			vertical: "flex-col *:w-full [&>.sr-only]:w-auto",
			horizontal:
				"flex-row items-center has-[>[data-slot=field-content]]:items-start *:data-[slot=field-label]:flex-auto has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
			responsive:
				"flex-col *:w-full @md/field-group:flex-row @md/field-group:items-center @md/field-group:*:w-auto @md/field-group:has-[>[data-slot=field-content]]:items-start @md/field-group:*:data-[slot=field-label]:flex-auto [&>.sr-only]:w-auto @md/field-group:has-[>[data-slot=field-content]]:[&>[role=checkbox],[role=radio]]:mt-px",
		},
	},
	defaultVariants: { orientation: "vertical" },
});

type FieldVariants = VariantProps<typeof fieldVariants>;
export { fieldVariants };
export type { FieldVariants };
</script>

<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		orientation?: FieldVariants["orientation"];
		invalid?: boolean;
	}>(),
	{ orientation: "vertical", invalid: false },
);

const classes = computed(() =>
	cn(fieldVariants({ orientation: props.orientation }), props.class),
);
</script>

<template>
	<div
		role="group"
		data-slot="field"
		:data-orientation="orientation"
		:data-invalid="invalid || undefined"
		:class="classes"
	>
		<slot />
	</div>
</template>
