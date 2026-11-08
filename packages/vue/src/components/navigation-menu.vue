<script setup lang="ts">
import { NavigationMenuRoot } from "reka-ui";
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		defaultValue?: string;
		modelValue?: string;
		delayDuration?: number;
		skipDelayDuration?: number;
		orientation?: "horizontal" | "vertical";
	}>(),
	{ modelValue: undefined, defaultValue: undefined, delayDuration: 200, skipDelayDuration: 300, orientation: "horizontal" },
);

const emits = defineEmits<{ (e: "update:modelValue", value: string): void }>();

const model = computed({
	get: () => props.modelValue ?? props.defaultValue,
	set: (v: string) => emits("update:modelValue", v),
});

const classes = computed(() =>
	cn("group/navigation-menu relative flex max-w-max flex-1 items-center justify-center", props.class),
);
</script>

<template>
	<NavigationMenuRoot
		data-slot="navigation-menu"
		:data-orientation="orientation"
		:class="classes"
		:model-value="model"
		:delay-duration="delayDuration"
		:skip-delay-duration="skipDelayDuration"
		@update:model-value="(v) => (model = v as string)"
	>
		<slot />
	</NavigationMenuRoot>
</template>
