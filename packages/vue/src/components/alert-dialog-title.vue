<script setup lang="ts">
import { AlertDialogTitle } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("font-heading text-base leading-none font-medium", props.class));
</script>

<template>
	<AlertDialogTitle data-slot="alert-dialog-title" :class="classes">
		<slot />
	</AlertDialogTitle>
</template>
