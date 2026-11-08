<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-vue-next";
import Button from "./button.vue";

const props = defineProps<{
	class?: HTMLAttributes["class"];
	currentIndex?: number;
	total?: number;
}>();

const index = ref(props.currentIndex ?? 0);
const total = computed(() => props.total ?? 1);
const classes = computed(() => cn("flex items-center gap-1", props.class));

function prev() {
	if (index.value > 0) index.value--;
}
function next() {
	if (index.value < total.value - 1) index.value++;
}
defineExpose({ index, prev, next });
</script>

<template>
	<div data-slot="message-branch" :class="classes">
		<Button variant="ghost" size="icon-xs" aria-label="Previous branch" @click="prev">
			<ChevronLeftIcon class="size-3.5" />
		</Button>
		<span data-slot="message-branch-page" class="text-xs text-muted-foreground tabular-nums">
			{{ index + 1 }}/{{ total }}
		</span>
		<Button variant="ghost" size="icon-xs" aria-label="Next branch" @click="next">
			<ChevronRightIcon class="size-3.5" />
		</Button>
		<slot :index="index" />
	</div>
</template>
