<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn("ml-auto text-xs tracking-widest text-muted-foreground group-data-selected/command-item:text-foreground", props.class),
);
</script>

<template>
	<span data-slot="command-shortcut" :class="classes">
		<slot />
	</span>
</template>
