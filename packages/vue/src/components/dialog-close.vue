<script setup lang="ts">
import { DialogClose } from "reka-ui";
import { type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = cn("", props.class);
</script>

<template>
	<DialogClose data-slot="dialog-close" :class="classes">
		<slot />
	</DialogClose>
</template>
