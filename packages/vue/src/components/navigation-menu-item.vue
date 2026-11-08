<script setup lang="ts">
import { NavigationMenuItem } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("relative", props.class));
</script>

<template>
	<NavigationMenuItem data-slot="navigation-menu-item" :class="classes">
		<slot />
	</NavigationMenuItem>
</template>
