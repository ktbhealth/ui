<script setup lang="ts">
import { ComboboxSeparator } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("-mx-1 h-px bg-border", props.class));
</script>

<template>
	<ComboboxSeparator data-slot="command-separator" :class="classes" />
</template>
