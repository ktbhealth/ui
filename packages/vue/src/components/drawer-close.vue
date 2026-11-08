<script setup lang="ts">
import { DrawerClose } from "reka-ui";
import { type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = cn("", props.class);
</script>

<template>
	<DrawerClose data-slot="drawer-close" :class="classes">
		<slot />
	</DrawerClose>
</template>
