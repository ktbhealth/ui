<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("[&_tr]:border-b", props.class));
</script>

<template>
	<thead data-slot="table-header" :class="classes">
		<slot />
	</thead>
</template>
