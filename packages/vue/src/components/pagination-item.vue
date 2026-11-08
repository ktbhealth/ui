<script setup lang="ts">
import { PaginationListItem } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"]; value?: number }>();
const classes = computed(() => cn("pagination-item", props.class));
</script>

<template>
	<PaginationListItem data-slot="pagination-item" :value="value ?? 0" :class="classes">
		<slot />
	</PaginationListItem>
</template>
