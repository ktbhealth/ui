<script setup lang="ts">
import { DrawerTrigger } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("", props.class));
</script>

<template>
	<DrawerTrigger data-slot="drawer-trigger" :class="classes">
		<slot />
	</DrawerTrigger>
</template>
