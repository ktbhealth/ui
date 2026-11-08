<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn(
		"h-10 px-2 text-left align-middle font-medium text-foreground [&:has([role=checkbox])]:pr-0",
		props.class,
	),
);
</script>

<template>
	<th data-slot="table-head" :class="classes">
		<slot />
	</th>
</template>
