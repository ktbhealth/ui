<script setup lang="ts">
import { DrawerPortal } from "reka-ui";
import { type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"]; to?: string | HTMLElement }>();
const classes = cn("", props.class);
</script>

<template>
	<DrawerPortal :to="to" :class="classes">
		<slot />
	</DrawerPortal>
</template>
