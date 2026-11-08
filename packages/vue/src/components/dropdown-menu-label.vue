<script setup lang="ts">
import { DropdownMenuLabel } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{ class?: HTMLAttributes["class"]; inset?: boolean }>(),
	{ inset: false },
);

const classes = computed(() =>
	cn("px-1.5 py-1 text-xs font-medium text-muted-foreground data-inset:pl-7", props.class),
);
</script>

<template>
	<DropdownMenuLabel data-slot="dropdown-menu-label" :inset="inset" :class="classes">
		<slot />
	</DropdownMenuLabel>
</template>
