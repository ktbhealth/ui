<script setup lang="ts">
import { DropdownMenuRoot } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		defaultOpen?: boolean;
		open?: boolean;
		modal?: boolean;
	}>(),
	{ open: undefined, defaultOpen: undefined, modal: true },
);

const emits = defineEmits<{
	(e: "update:open", value: boolean): void;
}>();

const model = computed({
	get: () => props.open ?? props.defaultOpen,
	set: (v: boolean) => emits("update:open", v),
});

const classes = computed(() => cn("dropdown-menu", props.class));
</script>

<template>
	<DropdownMenuRoot
		data-slot="dropdown-menu"
		:class="classes"
		:open="model"
		:modal="modal"
		@update:open="(v) => (model = v)"
	>
		<slot />
	</DropdownMenuRoot>
</template>
