<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { MoreHorizontalIcon } from "lucide-vue-next";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn("flex size-5 items-center justify-center [&>svg]:size-4", props.class),
);
</script>

<template>
	<span data-slot="breadcrumb-ellipsis" role="presentation" aria-hidden="true" :class="classes">
		<slot>
			<MoreHorizontalIcon />
			<span class="sr-only">More</span>
		</slot>
	</span>
</template>
