<script setup lang="ts">
import { MenubarSub } from "reka-ui";
import { type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = cn("menubar-sub", props.class);
</script>

<template>
	<MenubarSub data-slot="menubar-sub" :class="classes">
		<slot />
	</MenubarSub>
</template>
