<script setup lang="ts">
import { computed, onBeforeUnmount, watch, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { CheckCircle2Icon } from "lucide-vue-next";
import type { AppToastData } from "../lib/app-toast";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		toast?: AppToastData | null;
		durationMs?: number;
	}>(),
	{ toast: null, durationMs: 4000 },
);

const emits = defineEmits<{
	(e: "close"): void;
	(e: "action"): void;
}>();

let timer: ReturnType<typeof setTimeout> | undefined;

watch(
	() => props.toast,
	(t) => {
		if (timer) clearTimeout(timer);
		if (!t) return;
		timer = setTimeout(() => emits("close"), props.durationMs);
	},
	{ immediate: true },
);

onBeforeUnmount(() => {
	if (timer) clearTimeout(timer);
});

const classes = computed(() => cn("app-toast", props.class));
</script>

<template>
	<div
		v-if="toast"
		data-slot="app-toast"
		aria-live="polite"
		:class="classes"
	>
		<CheckCircle2Icon class="size-4 shrink-0 text-primary" />
		<span class="flex-1">{{ toast.text }}</span>
		<button
			v-if="toast.actionLabel"
			class="font-medium text-primary hover:underline"
			@click="emits('action')"
		>
			{{ toast.actionLabel }}
		</button>
	</div>
</template>
