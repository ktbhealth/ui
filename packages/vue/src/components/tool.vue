<script setup lang="ts">
import { CollapsibleRoot } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		open?: boolean;
		defaultOpen?: boolean;
		state?: string;
	}>(),
	{ open: undefined, defaultOpen: true, state: "pending" },
);

const emits = defineEmits<{ (e: "update:open", value: boolean): void }>();
const model = computed({
	get: () => props.open ?? props.defaultOpen,
	set: (v: boolean) => emits("update:open", v),
});

const classes = computed(() =>
	cn("not-prose w-full rounded-md border text-sm", props.class),
);
</script>

<template>
	<CollapsibleRoot
		data-slot="tool"
		:data-state="state"
		class="group/tool"
		:open="model"
		@update:open="(v) => (model = v)"
	>
		<div :class="classes">
			<slot :open="model" />
		</div>
	</CollapsibleRoot>
</template>
