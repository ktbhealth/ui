<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { ExternalLinkIcon } from "lucide-vue-next";
import Button from "./button.vue";

const props = defineProps<{
	class?: HTMLAttributes["class"];
	url?: string;
	label?: string;
}>();

const classes = computed(() => cn("", props.class));
</script>

<template>
	<Button
		data-slot="open-in-chat"
		variant="ghost"
		size="sm"
		:class="classes"
		:as="url ? 'a' : 'button'"
		:href="url"
		target="_blank"
		rel="noreferrer"
	>
		<ExternalLinkIcon class="size-3.5" />
		{{ label ?? "Open in Chat" }}
	</Button>
</template>
