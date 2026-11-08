<script setup lang="ts">
import { PopoverAnchor } from "reka-ui";
import { type HTMLAttributes } from "vue";

defineProps<{ class?: HTMLAttributes["class"] }>();
</script>

<template>
	<PopoverAnchor data-slot="popover-anchor" :class="class">
		<slot />
	</PopoverAnchor>
</template>
