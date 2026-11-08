<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn("flex items-center gap-2", props.class),
);
</script>

<template>
	<div data-slot="item-actions" :class="classes">
		<slot />
	</div>
</template>
