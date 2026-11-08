<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { CheckIcon, CopyIcon } from "lucide-vue-next";
import Button from "./button.vue";

const props = defineProps<{
	class?: HTMLAttributes["class"];
	value?: string;
}>();

const copied = ref(false);
const label = computed(() => (copied.value ? "Copied" : "Copy"));

async function copy() {
	if (!props.value) return;
	try {
		await navigator.clipboard.writeText(props.value);
	} catch {
		return;
	}
	copied.value = true;
	setTimeout(() => (copied.value = false), 2000);
}

const classes = computed(() => cn("code-block-copy-button", props.class));
</script>

<template>
	<Button
		data-slot="code-block-copy-button"
		variant="ghost"
		size="icon-xs"
		:class="classes"
		@click="copy"
	>
		<CheckIcon v-if="copied" class="size-3.5" />
		<CopyIcon v-else class="size-3.5" />
		<span class="sr-only">{{ label }}</span>
	</Button>
</template>
