<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import MessageGroup from "./message-group.vue";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		from?: "user" | "assistant" | "system";
	}>(),
	{ from: "assistant" },
);

const classes = computed(() =>
	cn(
		"group flex w-full max-w-[80%] flex-col gap-2",
		props.from === "user" && "is-user ml-auto items-end",
		props.class,
	),
);
</script>

<template>
	<div
		data-slot="message"
		:data-from="from"
		:class="classes"
	>
		<slot />
	</div>
</template>
