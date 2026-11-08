<script setup lang="ts">
import { Separator } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		orientation?: "horizontal" | "vertical";
	}>(),
	{ orientation: "vertical" },
);

const classes = computed(() =>
	cn(
		"relative self-stretch bg-input data-horizontal:mx-px data-horizontal:w-auto data-vertical:my-px data-vertical:h-auto",
		props.class,
	),
);
</script>

<template>
	<Separator
		data-slot="button-group-separator"
		:data-orientation="orientation"
		:orientation="orientation"
		:class="classes"
	/>
</template>
