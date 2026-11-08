<script setup lang="ts">
import { ComboboxTrigger } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import Button from "./button.vue";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
	}>(),
	{},
);

const classes = computed(() => cn("combobox-trigger", props.class));
</script>

<template>
	<ComboboxTrigger data-slot="combobox-trigger" :class="classes">
		<slot>
			<Button variant="ghost" size="icon-xs" class="pointer-events-none">
				<slot name="icon" />
			</Button>
		</slot>
	</ComboboxTrigger>
</template>
