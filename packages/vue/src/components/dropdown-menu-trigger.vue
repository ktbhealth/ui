<script setup lang="ts">
import { DropdownMenuTrigger } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("dropdown-menu-trigger", props.class));
</script>

<template>
	<DropdownMenuTrigger data-slot="dropdown-menu-trigger" :class="classes">
		<slot />
	</DropdownMenuTrigger>
</template>
