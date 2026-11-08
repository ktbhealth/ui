<script setup lang="ts">
import { TabsContent } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{
	class?: HTMLAttributes["class"];
	value: string;
}>();

const classes = computed(() => cn("flex-1 text-sm outline-none", props.class));
</script>

<template>
	<TabsContent data-slot="tabs-content" :value="value" :class="classes">
		<slot />
	</TabsContent>
</template>
