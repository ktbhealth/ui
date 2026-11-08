<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{ class?: HTMLAttributes["class"]; href?: string; as?: string }>(),
	{ as: "a" },
);
const classes = computed(() =>
	cn("transition-colors hover:text-foreground", props.class),
);
</script>

<template>
	<component :is="as" data-slot="breadcrumb-link" :href="href" :class="classes">
		<slot />
	</component>
</template>
