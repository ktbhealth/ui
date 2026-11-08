<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn("group/field-content flex flex-1 flex-col gap-0.5 leading-snug", props.class),
);
</script>

<template>
	<div data-slot="field-content" :class="classes">
		<slot />
	</div>
</template>
