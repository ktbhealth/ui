<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("mt-auto flex flex-col gap-2 p-4", props.class));
</script>

<template>
	<div data-slot="sheet-footer" :class="classes">
		<slot />
	</div>
</template>
