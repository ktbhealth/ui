<script setup lang="ts">
import { TabsTrigger as RekaTabsTrigger } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { tabsTriggerVariants, type TabsTriggerVariants } from "./tabs.vue";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		value: string;
		disabled?: boolean;
		variant?: TabsTriggerVariants["variant"];
	}>(),
	{ variant: "default", disabled: false },
);

const classes = computed(() => cn(tabsTriggerVariants({ variant: props.variant }), props.class));
</script>

<template>
	<RekaTabsTrigger data-slot="tabs-trigger" :value="value" :disabled="disabled" :class="classes">
		<slot />
	</RekaTabsTrigger>
</template>
