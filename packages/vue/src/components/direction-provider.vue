<script setup lang="ts">
import { provideDirection, type Direction } from "../lib/direction";

const props = withDefaults(defineProps<{ dir?: Direction }>(), { dir: "ltr" });

provideDirection(props.dir);
</script>

<template>
	<slot />
</template>
