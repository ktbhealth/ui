<script setup lang="ts">
import { DropdownMenuGroup } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("dropdown-menu-group", props.class));
</script>

<template>
	<DropdownMenuGroup data-slot="dropdown-menu-group" :class="classes">
		<slot />
	</DropdownMenuGroup>
</template>
