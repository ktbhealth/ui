<script setup lang="ts">
import { DialogTrigger } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("dialog-trigger", props.class));
</script>

<template>
	<DialogTrigger data-slot="dialog-trigger" :class="classes">
		<slot />
	</DialogTrigger>
</template>
