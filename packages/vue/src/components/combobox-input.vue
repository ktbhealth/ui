<script setup lang="ts">
import { ComboboxInput } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{
	class?: HTMLAttributes["class"];
	placeholder?: string;
	name?: string;
	id?: string;
	displayValue?: (value: unknown) => string;
}>();

const classes = computed(() => cn("combobox-input", props.class));
</script>

<template>
	<ComboboxInput
		data-slot="combobox-input"
		:class="classes"
		:placeholder="placeholder"
		:name="name"
		:id="id"
		:display-value="displayValue"
	/>
</template>
