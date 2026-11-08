<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("hidden md:block", props.class));
</script>

<template>
	<div data-slot="sidebar-inset" :class="classes">
		<slot />
	</div>
</template>
