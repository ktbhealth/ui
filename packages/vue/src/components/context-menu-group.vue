<script setup lang="ts">
import { ContextMenuGroup } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("context-menu-group", props.class));
</script>

<template>
	<ContextMenuGroup data-slot="context-menu-group" :class="classes">
		<slot />
	</ContextMenuGroup>
</template>
