<script setup lang="ts">
import { Separator } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		orientation?: "horizontal" | "vertical";
		decorative?: boolean;
	}>(),
	{ orientation: "horizontal", decorative: true },
);

const classes = computed(() =>
	cn(
		"shrink-0 bg-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch",
		props.class,
	),
);
</script>

<template>
	<Separator
		data-slot="separator"
		:orientation="orientation"
		:decorative="decorative"
		:class="classes"
	/>
</template>
