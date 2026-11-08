<script setup lang="ts">
import { PopoverTrigger } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("popover-trigger", props.class));
</script>

<template>
	<PopoverTrigger data-slot="popover-trigger" :class="classes">
		<slot />
	</PopoverTrigger>
</template>
