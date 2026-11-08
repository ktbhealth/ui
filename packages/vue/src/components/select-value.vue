<script setup lang="ts">
import { SelectValue } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"]; placeholder?: string }>();
const classes = computed(() => cn("flex flex-1 text-left", props.class));
</script>

<template>
	<SelectValue data-slot="select-value" :class="classes" :placeholder="placeholder">
		<slot />
	</SelectValue>
</template>
