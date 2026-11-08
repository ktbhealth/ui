<script setup lang="ts">
import { CollapsibleRoot } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		open?: boolean;
		defaultOpen?: boolean;
		isStreaming?: boolean;
	}>(),
	{ open: undefined, defaultOpen: true },
);

const emits = defineEmits<{ (e: "update:open", value: boolean): void }>();

const model = computed({
	get: () => props.open ?? props.defaultOpen,
	set: (v: boolean) => emits("update:open", v),
});

const classes = computed(() =>
	cn("not-prose text-sm w-full rounded-md border", props.class),
);
</script>

<template>
	<CollapsibleRoot
		data-slot="reasoning"
		class="group/reasoning"
		:data-streaming="isStreaming ? 'true' : undefined"
		:open="model"
		@update:open="(v) => (model = v)"
	>
		<div :class="classes">
			<slot :open="model" />
		</div>
	</CollapsibleRoot>
</template>
