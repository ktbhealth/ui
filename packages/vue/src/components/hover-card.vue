<script setup lang="ts">
import { HoverCardContent, HoverCardPortal, HoverCardRoot, HoverCardTrigger } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		open?: boolean;
		defaultOpen?: boolean;
		openDelay?: number;
		closeDelay?: number;
	}>(),
	{ open: undefined, defaultOpen: undefined, openDelay: 700, closeDelay: 300 },
);

const emits = defineEmits<{
	(e: "update:open", value: boolean): void;
}>();

const model = computed({
	get: () => props.open ?? props.defaultOpen,
	set: (v: boolean) => emits("update:open", v),
});

const classes = computed(() => cn("hover-card", props.class));
</script>

<template>
	<HoverCardRoot
		data-slot="hover-card"
		:class="classes"
		:open="model"
		:open-delay="openDelay"
		:close-delay="closeDelay"
		@update:open="(v) => (model = v)"
	>
		<slot />
	</HoverCardRoot>
</template>
