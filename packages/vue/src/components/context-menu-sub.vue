<script setup lang="ts">
import { ContextMenuSub } from "reka-ui";
import { type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = cn("context-menu-sub", props.class);
</script>

<template>
	<ContextMenuSub data-slot="context-menu-sub" :class="classes">
		<slot />
	</ContextMenuSub>
</template>
