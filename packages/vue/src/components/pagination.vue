<script setup lang="ts">
import { PaginationRoot } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		modelValue?: number;
		defaultValue?: number;
		itemsPerPage?: number;
		total?: number;
		siblingCount?: number;
		showEdges?: boolean;
		disabled?: boolean;
	}>(),
	{ modelValue: undefined, defaultValue: 1, total: 1, itemsPerPage: 10, siblingCount: 1, showEdges: true, disabled: false },
);

const emits = defineEmits<{ (e: "update:modelValue", value: number): void }>();

const model = computed({
	get: () => props.modelValue ?? props.defaultValue,
	set: (v: number) => emits("update:modelValue", v),
});

const classes = computed(() => cn("mx-auto flex w-full justify-center", props.class));
</script>

<template>
	<PaginationRoot
		data-slot="pagination"
		:class="classes"
		:page="model"
		:total="total"
		:items-per-page="itemsPerPage"
		:sibling-count="siblingCount"
		:show-edges="showEdges"
		:disabled="disabled"
		@update:page="(v: number) => (model = v)"
	>
		<slot />
	</PaginationRoot>
</template>
