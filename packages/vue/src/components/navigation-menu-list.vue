<script setup lang="ts">
import { NavigationMenuList } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn("group flex flex-1 list-none items-center justify-center gap-0", props.class),
);
</script>

<template>
	<NavigationMenuList data-slot="navigation-menu-list" :class="classes">
		<slot />
	</NavigationMenuList>
</template>
