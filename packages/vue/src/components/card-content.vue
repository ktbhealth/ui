<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("px-(--card-spacing)", props.class));
</script>

<template>
	<div data-slot="card-content" :class="classes">
		<slot />
	</div>
</template>
