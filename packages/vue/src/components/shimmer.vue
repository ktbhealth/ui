<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		text?: string;
		duration?: number;
		active?: boolean;
	}>(),
	{ text: "Thinking...", duration: 0, active: true },
);

const elapsed = ref(0);
let timer: ReturnType<typeof setInterval> | null = null;

onMounted(() => {
	if (props.active || props.duration) {
		timer = setInterval(() => {
			elapsed.value++;
			if (props.duration && elapsed.value >= props.duration && timer) {
				clearInterval(timer);
				timer = null;
			}
		}, 1000);
	}
});

onBeforeUnmount(() => {
	if (timer) clearInterval(timer);
});

const classes = computed(() => cn("inline-flex items-center gap-1.5 text-sm text-muted-foreground", props.class));
const label = computed(() => (elapsed.value > 0 ? `${props.text} (${elapsed.value}s)` : props.text));
</script>

<template>
	<span data-slot="shimmer" :class="classes">
		<span class="shimmer">{{ label }}</span>
	</span>
</template>
