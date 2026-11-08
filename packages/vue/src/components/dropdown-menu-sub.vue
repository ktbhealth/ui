<script setup lang="ts">
import { DropdownMenuSub } from "reka-ui";
import { type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = cn("dropdown-menu-sub", props.class);
</script>

<template>
	<DropdownMenuSub data-slot="dropdown-menu-sub" :class="classes">
		<slot />
	</DropdownMenuSub>
</template>
