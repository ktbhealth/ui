<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("w-full caption-bottom text-sm", props.class));
</script>

<template>
	<div data-slot="table-container" class="relative w-full overflow-x-auto">
		<table data-slot="table" :class="classes">
			<slot />
		</table>
	</div>
</template>
