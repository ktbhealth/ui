<script setup lang="ts">
import { NavigationMenuViewport } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn(
		"origin-[var(--transform-origin)] relative h-[var(--positioner-height)] w-full overflow-hidden data-[state=closed]:animate-out data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:zoom-in-90 md:w-[var(--positioner-width)]",
		props.class,
	),
);
</script>

<template>
	<div class="absolute left-0 top-full isolate z-50 flex justify-center">
		<NavigationMenuViewport data-slot="navigation-menu-viewport" :class="classes">
			<slot />
		</NavigationMenuViewport>
	</div>
</template>
