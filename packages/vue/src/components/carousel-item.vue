<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("basis-full", props.class));
</script>

<template>
	<div role="group" aria-roledescription="slide" data-slot="carousel-item" :class="classes">
		<slot />
	</div>
</template>
