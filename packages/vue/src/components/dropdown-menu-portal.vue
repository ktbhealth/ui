<script setup lang="ts">
import { DropdownMenuPortal } from "reka-ui";
import { type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"]; to?: string | HTMLElement }>();
const classes = cn("dropdown-menu-portal", props.class);
</script>

<template>
	<DropdownMenuPortal :to="to" :class="classes">
		<slot />
	</DropdownMenuPortal>
</template>
