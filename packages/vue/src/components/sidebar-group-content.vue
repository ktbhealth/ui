<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("w-full text-sm", props.class));
</script>

<template>
	<div data-slot="sidebar-group-content" data-sidebar="group-content" :class="classes">
		<slot />
	</div>
</template>
