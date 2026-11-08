<script setup lang="ts">
import { SelectScrollDownButton, SelectScrollUpButton } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { ChevronDownIcon, ChevronUpIcon } from "lucide-vue-next";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("flex cursor-default items-center justify-center py-1", props.class));
</script>

<template>
	<SelectScrollUpButton data-slot="select-scroll-up-button" :class="classes">
		<ChevronUpIcon class="size-4" />
	</SelectScrollUpButton>
	<SelectScrollDownButton data-slot="select-scroll-down-button" :class="classes">
		<ChevronDownIcon class="size-4" />
	</SelectScrollDownButton>
</template>
