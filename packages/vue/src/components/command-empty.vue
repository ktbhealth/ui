<script setup lang="ts">
import { ComboboxEmpty } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("py-6 text-center text-sm", props.class));
</script>

<template>
	<ComboboxEmpty data-slot="command-empty" :class="classes">
		<slot />
	</ComboboxEmpty>
</template>
