<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("inline-flex items-center gap-1", props.class));
</script>

<template>
	<li data-slot="breadcrumb-item" :class="classes">
		<slot />
	</li>
</template>
