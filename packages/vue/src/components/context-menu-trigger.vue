<script setup lang="ts">
import { ContextMenuTrigger } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("select-none", props.class));
</script>

<template>
	<ContextMenuTrigger data-slot="context-menu-trigger" :class="classes">
		<slot />
	</ContextMenuTrigger>
</template>
