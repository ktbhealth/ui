<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { ChevronRightIcon } from "lucide-vue-next";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn("[&>svg]:size-3.5", props.class),
);
</script>

<template>
	<li data-slot="breadcrumb-separator" role="presentation" aria-hidden="true" :class="classes">
		<slot>
			<ChevronRightIcon />
		</slot>
	</li>
</template>
