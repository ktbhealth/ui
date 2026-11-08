<script setup lang="ts">
import { computed, ref, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{
	class?: HTMLAttributes["class"];
	text?: string;
	active?: boolean;
	as?: string;
}>();

const emits = defineEmits<{ (e: "click"): void }>();

const classes = computed(() =>
	cn(
		"inline-flex h-6 items-center gap-1 rounded-md px-1.5 text-xs font-medium transition-colors",
		props.active
			? "bg-accent text-accent-foreground"
			: "text-muted-foreground hover:bg-accent/50 hover:text-foreground",
		props.class,
	),
);
</script>

<template>
	<component
		:is="as ?? 'button'"
		data-slot="message-action"
		:type="as ? undefined : 'button'"
		:class="classes"
		@click="emits('click')"
	>
		<slot>{{ text }}</slot>
	</component>
</template>
