<script setup lang="ts">
import { Separator } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = defineProps<{ class?: HTMLAttributes["class"] }>();
const classes = computed(() => cn("my-2", props.class));
</script>

<template>
	<Separator data-slot="item-separator" orientation="horizontal" :class="classes" />
</template>
