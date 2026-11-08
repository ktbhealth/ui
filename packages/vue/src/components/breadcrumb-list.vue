<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() =>
	cn("flex flex-wrap items-center gap-1.5 text-sm wrap-break-word text-muted-foreground", props.class),
);
</script>

<template>
	<ol data-slot="breadcrumb-list" :class="classes">
		<slot />
	</ol>
</template>
