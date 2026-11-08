<script setup lang="ts">
import { AvatarImage } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{
	class?: HTMLAttributes["class"];
	src?: string;
	alt?: string;
}>();

const classes = computed(() =>
	cn("aspect-square size-full rounded-full object-cover", props.class),
);
</script>

<template>
	<AvatarImage data-slot="avatar-image" :src="src ?? ''" :alt="alt" :class="classes" />
</template>
