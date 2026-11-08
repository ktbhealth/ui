<script setup lang="ts">
import { computed, inject, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { sidebarKey } from "../lib/sidebar-context";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		tooltip?: string;
		side?: "left" | "right";
		variant?: "sidebar" | "floating" | "inset";
		collapsible?: "offcanvas" | "icon" | "none";
	}>(),
	{ side: "left", variant: "sidebar", collapsible: "offcanvas" },
);

const sidebar = inject(sidebarKey);

const classes = computed(() => cn("peer hidden md:block", props.class));
</script>

<template>
	<div
		data-slot="sidebar-gap"
		:data-state="sidebar?.state.value"
		:data-collapsible="collapsible"
		:data-variant="variant"
		:data-side="side"
		:class="classes"
	/>
</template>
