<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("animate-pulse rounded-md bg-muted", props.class));
</script>

<template>
	<div data-slot="skeleton" :class="classes" />
</template>
