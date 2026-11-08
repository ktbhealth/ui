<script setup lang="ts">
import { MenubarTrigger } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn(
		"flex items-center rounded-sm px-1.5 py-[2px] text-sm font-medium outline-hidden select-none hover:bg-muted aria-expanded:bg-muted",
		props.class,
	),
);
</script>

<template>
	<MenubarTrigger data-slot="menubar-trigger" :class="classes">
		<slot />
	</MenubarTrigger>
</template>
