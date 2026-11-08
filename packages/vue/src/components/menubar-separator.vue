<script setup lang="ts">
import { MenubarSeparator } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("-mx-1 my-1 h-px bg-border", props.class));
</script>

<template>
	<MenubarSeparator data-slot="menubar-separator" :class="classes" />
</template>
