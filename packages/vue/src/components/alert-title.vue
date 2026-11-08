<script setup lang="ts">
import { cva, type VariantProps } from "class-variance-authority";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const alertTitleVariants = cva("font-medium group-has-[>svg]/alert:col-start-2 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground");
const alertDescriptionVariants = cva(
	"text-sm text-balance text-muted-foreground md:text-pretty [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4",
);

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const titleClasses = computed(() => cn(alertTitleVariants(), props.class));
</script>

<template>
	<div data-slot="alert-title" :class="titleClasses">
		<slot />
	</div>
</template>
