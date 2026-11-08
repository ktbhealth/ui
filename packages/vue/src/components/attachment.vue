<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import AttachmentMedia from "./attachment-media.vue";
import AttachmentContent from "./attachment-content.vue";
import AttachmentTitle from "./attachment-title.vue";
import AttachmentDescription from "./attachment-description.vue";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		state?: "idle" | "uploading" | "processing" | "error" | "done";
		size?: "default" | "sm" | "xs";
		orientation?: "horizontal" | "vertical";
	}>(),
	{ state: "done", size: "default", orientation: "horizontal" },
);

const classes = computed(() =>
	cn(
		"group/attachment relative flex w-fit max-w-full min-w-0 shrink-0 flex-wrap rounded-xl border bg-card text-card-foreground transition-colors focus-within:ring-1 focus-within:ring-ring/50 has-[>a,>button]:hover:bg-muted/50 data-[state=error]:border-destructive/30 data-[state=idle]:border-dashed",
		"gap-2 text-sm has-data-[slot=attachment-content]:px-2.5 has-data-[slot=attachment-content]:py-2 has-data-[slot=attachment-media]:p-2",
		props.size === "sm" && "gap-2.5 text-xs has-data-[slot=attachment-content]:px-2 has-data-[slot=attachment-content]:py-1.5 has-data-[slot=attachment-media]:p-1.5",
		props.size === "xs" && "gap-1.5 rounded-lg text-xs has-data-[slot=attachment-content]:px-1.5 has-data-[slot=attachment-content]:py-1 has-data-[slot=attachment-media]:p-1",
		props.orientation === "horizontal" && "min-w-40 items-center",
		props.orientation === "vertical" && "w-24 flex-col has-data-[slot=attachment-content]:w-30",
		props.class,
	),
);
</script>

<template>
	<div
		data-slot="attachment"
		:data-state="state"
		:data-size="size"
		:data-orientation="orientation"
		:class="classes"
	>
		<slot />
	</div>
</template>
