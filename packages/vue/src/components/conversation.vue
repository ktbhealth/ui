<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { ArrowDownIcon } from "lucide-vue-next";
import Button from "./button.vue";

const props = defineProps<{
	class?: HTMLAttributes["class"];
	stickToBottom?: boolean;
}>();

const viewport = ref<HTMLDivElement | null>(null);
const showScrollButton = ref(false);

function onScroll() {
	if (!viewport.value) return;
	const { scrollTop, scrollHeight, clientHeight } = viewport.value;
	showScrollButton.value = scrollHeight - scrollTop - clientHeight > 40;
}

function scrollToEnd() {
	viewport.value?.scrollTo({ top: viewport.value.scrollHeight, behavior: "smooth" });
}

const classes = computed(() =>
	cn("relative flex size-full min-h-0 flex-col overflow-hidden", props.class),
);
</script>

<template>
	<div
		data-slot="conversation"
		:class="classes"
	>
		<div
			ref="viewport"
			data-slot="conversation-content"
			class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4"
			@scroll="onScroll"
		>
			<slot />
		</div>
		<Button
			v-if="showScrollButton"
			data-slot="conversation-scroll-button"
			variant="outline"
			size="icon-sm"
			class="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full"
			aria-label="Scroll to bottom"
			@click="scrollToEnd"
		>
			<ArrowDownIcon class="size-4" />
		</Button>
	</div>
</template>
