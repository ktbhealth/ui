<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		status?: "running" | "error" | "pending";
	}>(),
	{ status: "pending" },
);

const classes = computed(() =>
	cn(
		"flex w-fit max-w-full min-w-0 items-center gap-2 text-sm text-muted-foreground transition-colors in-[a,button]:cursor-pointer in-[a:hover,button:hover]:text-foreground data-[status=error]:text-destructive data-[status=error]:in-[a:hover,button:hover]:text-destructive data-[status=pending]:opacity-60 data-[status=running]:*:data-[slot=trace-title]:shimmer",
		props.class,
	),
);
</script>

<template>
	<span data-slot="trace-line" :data-status="status" :class="classes">
		<slot />
	</span>
</template>
