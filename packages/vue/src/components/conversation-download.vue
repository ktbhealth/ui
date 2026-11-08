<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { DownloadIcon } from "lucide-vue-next";
import Button from "./button.vue";

const props = defineProps<{
	class?: HTMLAttributes["class"];
	filename?: string;
	messages?: unknown[];
}>();

const classes = computed(() => cn("", props.class));

function download() {
	const data = props.messages ?? [];
	const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = props.filename ?? "conversation.json";
	a.click();
	URL.revokeObjectURL(url);
}
</script>

<template>
	<Button
		data-slot="conversation-download"
		variant="ghost"
		size="icon-sm"
		:class="classes"
		aria-label="Download conversation"
		@click="download"
	>
		<DownloadIcon class="size-4" />
	</Button>
</template>
