<script setup lang="ts">
import { HoverCardTrigger } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("hover-card-trigger", props.class));
</script>

<template>
	<HoverCardTrigger data-slot="hover-card-trigger" :class="classes">
		<slot />
	</HoverCardTrigger>
</template>
