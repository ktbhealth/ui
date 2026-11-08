<script setup lang="ts">
import { PanelLeftIcon } from "lucide-vue-next";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { useSidebar } from "../lib/sidebar-context";
import Button from "./button.vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const sidebar = useSidebar();
const classes = computed(() => cn("", props.class));
</script>

<template>
	<Button
		data-slot="sidebar-trigger"
		data-sidebar="trigger"
		variant="ghost"
		size="icon"
		:class="classes"
		@click="sidebar.toggleSidebar"
	>
		<PanelLeftIcon />
		<span class="sr-only">Toggle Sidebar</span>
	</Button>
</template>
