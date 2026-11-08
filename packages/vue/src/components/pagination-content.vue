<script setup lang="ts">
import { PaginationList } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("flex items-center gap-0.5", props.class));
</script>

<template>
	<PaginationList data-slot="pagination-content" :class="classes">
		<slot />
	</PaginationList>
</template>
