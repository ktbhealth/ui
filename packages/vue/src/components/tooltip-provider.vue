<script setup lang="ts">
import { TooltipProvider } from "reka-ui";
import { type HTMLAttributes } from "vue";

defineProps<{
	class?: HTMLAttributes["class"];
	delayDuration?: number;
	skipDelayDuration?: number;
	disableHoverableContent?: boolean;
}>();
</script>

<template>
	<TooltipProvider
		:data-slot="'tooltip-provider'"
		:delay-duration="delayDuration ?? 700"
		:skip-delay-duration="skipDelayDuration ?? 300"
		:disable-hoverable-content="disableHoverableContent ?? false"
	>
		<slot />
	</TooltipProvider>
</template>
