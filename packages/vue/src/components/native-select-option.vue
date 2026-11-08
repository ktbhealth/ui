<script setup lang="ts">
import { computed, type HTMLAttributes, type OptionHTMLAttributes, type OptgroupHTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("bg-[Canvas] text-[CanvasText]", props.class));
</script>

<template>
	<option data-slot="native-select-option" :class="classes">
		<slot />
	</option>
</template>
