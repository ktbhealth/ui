<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"]; as?: string }>();
const classes = computed(() => cn("", props.class));
</script>

<template>
	<component :is="as ?? 'button'" data-slot="attachment-trigger" :class="classes" type="button">
		<slot />
	</component>
</template>
