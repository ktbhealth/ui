<script setup lang="ts">
import { computed, nextTick, onMounted, ref, watch, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { ArrowDownIcon } from "lucide-vue-next";
import Button from "./button.vue";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		autoScroll?: boolean;
		stickToBottom?: boolean;
	}>(),
	{ autoScroll: true, stickToBottom: true },
);

const viewportEl = ref<HTMLElement | null>(null);
const contentEl = ref<HTMLElement | null>(null);
const canScroll = ref(false);
const atBottom = ref(true);

function scrollToEnd() {
	const el = viewportEl.value;
	if (el) el.scrollTop = el.scrollHeight;
}
function scrollToStart() {
	const el = viewportEl.value;
	if (el) el.scrollTop = 0;
}

function updateState() {
	const el = viewportEl.value;
	if (!el) return;
	canScroll.value = el.scrollHeight > el.clientHeight;
	atBottom.value = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
}

watch(
	() => props.stickToBottom,
	(v) => {
		if (v) nextTick(scrollToEnd);
	},
);

onMounted(() => {
	updateState();
	scrollToEnd();
});

const classes = computed(() =>
	cn("group/message-scroller relative flex size-full min-h-0 flex-col overflow-hidden", props.class),
);
const viewportClasses = computed(() => cn("flex-1 overflow-y-auto"));
</script>

<template>
	<div data-slot="message-scroller" :class="classes">
		<div
			ref="viewportEl"
			data-slot="message-scroller-viewport"
			:class="viewportClasses"
			@scroll="updateState"
		>
			<div ref="contentEl" data-slot="message-scroller-content" class="flex flex-col gap-8 p-4">
				<slot :scroll-to-end="scrollToEnd" :scroll-to-start="scrollToStart" :at-bottom="atBottom" />
			</div>
		</div>
		<Button
			v-if="canScroll && !atBottom"
			data-slot="message-scroller-button"
			variant="outline"
			size="icon"
			class="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full"
			@click="scrollToEnd"
		>
			<ArrowDownIcon class="size-4" />
			<span class="sr-only">Scroll to end</span>
		</Button>
	</div>
</template>
