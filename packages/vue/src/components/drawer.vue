<script setup lang="ts">
import {
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerOverlay,
	DrawerPortal,
	DrawerRoot,
	DrawerTitle,
	DrawerTrigger,
} from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		defaultOpen?: boolean;
		open?: boolean;
		modal?: boolean;
		direction?: "top" | "bottom" | "left" | "right";
	}>(),
	{ open: undefined, defaultOpen: undefined, modal: true, direction: "bottom" },
);

const emits = defineEmits<{
	(e: "update:open", value: boolean): void;
}>();

const model = computed({
	get: () => props.open ?? props.defaultOpen,
	set: (v: boolean) => emits("update:open", v),
});

const classes = computed(() => cn("drawer", props.class));
</script>

<template>
	<DrawerRoot
		data-slot="drawer"
		:class="classes"
		:open="model"
		:modal="modal"
		:direction="direction"
		@update:open="(v) => (model = v)"
	>
		<slot />
	</DrawerRoot>
</template>
