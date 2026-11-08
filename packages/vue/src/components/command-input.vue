<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { SearchIcon } from "lucide-vue-next";

const props = defineProps<{
	class?: HTMLAttributes["class"];
	placeholder?: string;
	modelValue?: string;
	defaultValue?: string;
}>();

const emits = defineEmits<{ (e: "update:modelValue", value: string): void }>();

const model = computed({
	get: () => props.modelValue ?? props.defaultValue ?? "",
	set: (v: string) => emits("update:modelValue", v),
});

const classes = computed(() => cn("command-input", props.class));
</script>

<template>
	<div data-slot="command-input-wrapper" class="p-1 pb-0">
		<div class="flex h-8 items-center gap-2 rounded-lg border border-input/30 bg-input/30 px-2.5">
			<SearchIcon class="size-4 shrink-0 opacity-50" />
			<input
				data-slot="command-input"
				class="w-full bg-transparent text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
				:class="classes"
				:placeholder="placeholder ?? 'Search for a command to run...'"
				v-model="model"
			>
		</div>
	</div>
</template>
