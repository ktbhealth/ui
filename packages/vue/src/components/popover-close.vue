<script setup lang="ts">
import { PopoverClose } from "reka-ui";
import { type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = cn("", props.class);
</script>

<template>
	<PopoverClose data-slot="popover-close" :class="classes">
		<slot />
	</PopoverClose>
</template>
