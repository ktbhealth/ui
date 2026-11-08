<script setup lang="ts">
import { CollapsibleTrigger } from "reka-ui";
import { computed, type ButtonHTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: ButtonHTMLAttributes["class"] }>();
const classes = computed(() => cn("", props.class));
</script>

<template>
	<CollapsibleTrigger data-slot="collapsible-trigger" :class="classes">
		<slot />
	</CollapsibleTrigger>
</template>
