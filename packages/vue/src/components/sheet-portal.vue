<script setup lang="ts">
import { DialogPortal } from "reka-ui";
import { type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"]; to?: string | HTMLElement }>();
const classes = cn("", props.class);
</script>

<template>
	<DialogPortal :to="to" :class="classes">
		<slot />
	</DialogPortal>
</template>
