<script setup lang="ts">
import { TabsList as RekaTabsList } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { tabsListVariants, type TabsListVariants } from "./tabs.vue";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		variant?: TabsListVariants["variant"];
	}>(),
	{ variant: "default" },
);

const classes = computed(() => cn(tabsListVariants({ variant: props.variant }), props.class));
</script>

<template>
	<RekaTabsList data-slot="tabs-list" :data-variant="variant" :class="classes">
		<slot />
	</RekaTabsList>
</template>
