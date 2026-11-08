<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		align?: "start" | "end";
	}>(),
	{ align: "start" },
);

const classes = computed(() =>
	cn(
		"group/message relative flex w-full min-w-0 gap-2 text-sm data-[align=end]:flex-row-reverse",
		props.class,
	),
);
</script>

<template>
	<div data-slot="message" :data-align="align" :class="classes">
		<slot />
	</div>
</template>
