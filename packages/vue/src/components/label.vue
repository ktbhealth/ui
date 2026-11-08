<script setup lang="ts">
import { Label } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

interface Props {
	class?: HTMLAttributes["class"];
	for?: string;
}

const props = defineProps<Props>();
const classes = computed(() =>
	cn(
		"flex items-center gap-2 text-sm leading-none font-medium select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
		props.class,
	),
);
</script>

<template>
	<Label data-slot="label" :for="for" :class="classes">
		<slot />
	</Label>
</template>
