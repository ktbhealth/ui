<script setup lang="ts">
import { AlertDialogCancel } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { buttonVariants } from "./button.vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn(buttonVariants({ variant: "outline" }), props.class));
</script>

<template>
	<AlertDialogCancel data-slot="alert-dialog-cancel" :class="classes">
		<slot />
	</AlertDialogCancel>
</template>
