<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("group/menu-item relative", props.class));
</script>

<template>
	<li data-slot="sidebar-menu-item" data-sidebar="menu-item" :class="classes">
		<slot />
	</li>
</template>
