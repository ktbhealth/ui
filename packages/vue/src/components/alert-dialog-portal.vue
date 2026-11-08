<script setup lang="ts">
import { AlertDialogPortal } from "reka-ui";
import { type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"]; to?: string | HTMLElement }>();
const classes = cn("", props.class);
</script>

<template>
	<AlertDialogPortal :to="to" :class="classes">
		<slot />
	</AlertDialogPortal>
</template>
