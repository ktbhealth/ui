<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("flex basis-full items-center justify-between gap-2", props.class));
</script>

<template>
	<div data-slot="item-footer" :class="classes">
		<slot />
	</div>
</template>
