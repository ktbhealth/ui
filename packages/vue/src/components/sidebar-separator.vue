<script setup lang="ts">
import { Separator } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("mx-2 w-auto bg-sidebar-border", props.class));
</script>

<template>
	<Separator data-slot="sidebar-separator" data-sidebar="separator" :class="classes" />
</template>
