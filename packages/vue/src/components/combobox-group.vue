<script setup lang="ts">
import { ComboboxGroup } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("combobox-group", props.class));
</script>

<template>
	<ComboboxGroup data-slot="combobox-group" :class="classes">
		<slot />
	</ComboboxGroup>
</template>
