<script setup lang="ts">
import { MenubarLabel } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{ class?: HTMLAttributes["class"]; inset?: boolean }>(),
	{ inset: false },
);

const classes = computed(() => cn("px-1.5 py-1 text-sm font-medium data-inset:pl-7", props.class));
</script>

<template>
	<MenubarLabel data-slot="menubar-label" :inset="inset" :class="classes">
		<slot />
	</MenubarLabel>
</template>
