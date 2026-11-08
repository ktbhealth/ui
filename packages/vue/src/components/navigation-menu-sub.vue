<script setup lang="ts">
import { NavigationMenuSub } from "reka-ui";
import { type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = cn("navigation-menu-sub", props.class);
</script>

<template>
	<NavigationMenuSub data-slot="navigation-menu-sub" :class="classes">
		<slot />
	</NavigationMenuSub>
</template>
