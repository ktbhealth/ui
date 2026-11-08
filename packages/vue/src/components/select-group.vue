<script setup lang="ts">
import { SelectGroup } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("select-group scroll-my-1 p-1", props.class));
</script>

<template>
	<SelectGroup data-slot="select-group" :class="classes">
		<slot />
	</SelectGroup>
</template>
