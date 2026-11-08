<script setup lang="ts">
import { computed, type HTMLAttributes, type TdHTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"]; colspan?: number; rowspan?: number }>();
const classes = computed(() =>
	cn("p-2 align-middle [&:has([role=checkbox])]:pr-0", props.class),
);
</script>

<template>
	<td data-slot="table-cell" :colspan="colspan" :rowspan="rowspan" :class="classes">
		<slot />
	</td>
</template>
