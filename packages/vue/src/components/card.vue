<script setup lang="ts">
import { cn } from "../lib/utils";
import { computed, type HTMLAttributes } from "vue";

type CardSize = "default" | "sm";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		size?: CardSize;
	}>(),
	{ size: "default" },
);

const classes = computed(() =>
	cn(
		"group/card flex flex-col gap-[var(--card-spacing)] overflow-hidden rounded-xl bg-card py-[var(--card-spacing)] text-sm text-card-foreground ring-1 ring-foreground/10 [--card-spacing:calc(var(--spacing,0.25rem)*4)] has-data-[slot=card-footer]:pb-0 has-[>img:first-child]:pt-0 data-[size=sm]:[--card-spacing:calc(var(--spacing,0.25rem)*3)] data-[size=sm]:has-data-[slot=card-footer]:pb-0 *:[img:first-child]:rounded-t-xl *:[img:last-child]:rounded-b-xl",
		props.class,
	),
);
</script>

<template>
	<div data-slot="card" :data-size="size" :class="classes">
		<slot />
	</div>
</template>
