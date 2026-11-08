<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("bg-[Canvas] text-[CanvasText]", props.class));
</script>

<template>
	<optgroup data-slot="native-select-optgroup" :class="classes">
		<slot />
	</optgroup>
</template>
