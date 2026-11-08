<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("[&_tr:last-child]:border-0", props.class));
</script>

<template>
	<tfoot data-slot="table-footer" :class="classes">
		<slot />
	</tfoot>
</template>
