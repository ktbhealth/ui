<script setup lang="ts">
import { AvatarFallback } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"]; delayMs?: number }>();
const classes = computed(() =>
	cn(
		"flex size-full items-center justify-center rounded-full bg-muted text-sm text-muted-foreground group-data-[size=sm]/avatar:text-xs",
		props.class,
	),
);
</script>

<template>
	<AvatarFallback data-slot="avatar-fallback" :delay-ms="delayMs" :class="classes">
		<slot />
	</AvatarFallback>
</template>
