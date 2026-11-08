<script setup lang="ts">
import { AlertDialogAction } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { buttonVariants } from "./button.vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn(buttonVariants(), props.class));
</script>

<template>
	<AlertDialogAction data-slot="alert-dialog-action" :class="classes">
		<slot />
	</AlertDialogAction>
</template>
