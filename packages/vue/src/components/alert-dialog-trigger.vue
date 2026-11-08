<script setup lang="ts">
import { AlertDialogTrigger } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("", props.class));
</script>

<template>
	<AlertDialogTrigger data-slot="alert-dialog-trigger" :class="classes">
		<slot />
	</AlertDialogTrigger>
</template>
