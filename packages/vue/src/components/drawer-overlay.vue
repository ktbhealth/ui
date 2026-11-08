<script setup lang="ts">
import { DrawerOverlay } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn(
		"fixed inset-0 z-50 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
		props.class,
	),
);
</script>

<template>
	<DrawerOverlay data-slot="drawer-overlay" :class="classes" />
</template>
