<script setup lang="ts">
import { MenubarMenu } from "reka-ui";
import { type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = cn("menubar-menu", props.class);
</script>

<template>
	<MenubarMenu data-slot="menubar-menu" :class="classes">
		<slot />
	</MenubarMenu>
</template>
