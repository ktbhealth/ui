<script setup lang="ts">
import { SelectSeparator } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("pointer-events-none -mx-1 my-1 h-px bg-border", props.class));
</script>

<template>
	<SelectSeparator data-slot="select-separator" :class="classes" />
</template>
