<script setup lang="ts">
import { ComboboxCancel } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("combobox-cancel", props.class));
</script>

<template>
	<ComboboxCancel data-slot="combobox-cancel" :class="classes">
		<slot />
	</ComboboxCancel>
</template>
