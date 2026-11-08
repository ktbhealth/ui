<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("font-normal text-foreground", props.class));
</script>

<template>
	<span data-slot="breadcrumb-page" aria-current="page" :class="classes">
		<slot />
	</span>
</template>
