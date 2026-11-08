<script setup lang="ts">
import { PaginationFirst, PaginationPrev, PaginationNext, PaginationLast, PaginationEllipsis } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { ChevronLeftIcon, ChevronRightIcon, ChevronsLeftIcon, ChevronsRightIcon, MoreHorizontalIcon } from "lucide-vue-next";
import { buttonVariants } from "./button.vue";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("gap-1", props.class));
</script>

<template>
	<PaginationFirst data-slot="pagination-first" :class="classes">
		<component :is="ChevronsLeftIcon" />
		<span class="sr-only">Go to first page</span>
	</PaginationFirst>
	<PaginationPrev data-slot="pagination-previous" :class="classes">
		<ChevronLeftIcon />
		<span class="hidden sm:block">Previous</span>
	</PaginationPrev>
	<PaginationNext data-slot="pagination-next" :class="classes">
		<span class="hidden sm:block">Next</span>
		<ChevronRightIcon />
	</PaginationNext>
	<PaginationLast data-slot="pagination-last" :class="classes">
		<ChevronsRightIcon />
		<span class="sr-only">Go to last page</span>
	</PaginationLast>
	<PaginationEllipsis data-slot="pagination-ellipsis" :class="classes">
		<MoreHorizontalIcon class="size-4" />
		<span class="sr-only">More pages</span>
	</PaginationEllipsis>
</template>
