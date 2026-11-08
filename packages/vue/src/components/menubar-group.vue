<script setup lang="ts">
import { MenubarGroup } from "reka-ui";
import { type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = cn("menubar-group", props.class);
</script>

<template>
	<MenubarGroup data-slot="menubar-group" :class="classes">
		<slot />
	</MenubarGroup>
</template>
