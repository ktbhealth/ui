<script lang="ts">
import { cva, type VariantProps } from "class-variance-authority";

const avatarVariants = cva(
	"group/avatar relative flex size-8 shrink-0 rounded-full select-none after:absolute after:inset-0 after:rounded-full after:border after:border-border after:mix-blend-darken data-[size=lg]:size-10 data-[size=sm]:size-6 dark:after:mix-blend-lighten",
	{
		variants: {
			size: {
				default: "",
				sm: "",
				lg: "",
			},
		},
		defaultVariants: { size: "default" },
	},
);

type AvatarVariants = VariantProps<typeof avatarVariants>;
export { avatarVariants };
export type { AvatarVariants };
</script>

<script setup lang="ts">
import { AvatarRoot } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

export interface Props {
	class?: HTMLAttributes["class"];
	size?: AvatarVariants["size"];
}

const props = withDefaults(defineProps<Props>(), { size: "default" });
const classes = computed(() => cn(avatarVariants({ size: props.size }), props.class));
</script>

<template>
	<AvatarRoot data-slot="avatar" :data-size="size" :class="classes">
		<slot />
	</AvatarRoot>
</template>
