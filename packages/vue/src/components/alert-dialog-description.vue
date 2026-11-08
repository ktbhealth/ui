<script setup lang="ts">
import { AlertDialogDescription } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("text-sm text-muted-foreground", props.class));
</script>

<template>
	<AlertDialogDescription data-slot="alert-dialog-description" :class="classes">
		<slot />
	</AlertDialogDescription>
</template>
