<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

interface FieldErrorItem {
	message?: string;
}

const props = defineProps<{
	class?: HTMLAttributes["class"];
	errors?: Array<FieldErrorItem | undefined>;
}>();

const content = computed(() => {
	if (props.errors?.length) {
		const unique = [...new Map(props.errors.map((e) => [e?.message, e])).values()];
		if (unique.length === 1) return unique[0]?.message;
		return unique;
	}
	return null;
});

const classes = computed(() => cn("text-sm font-normal text-destructive", props.class));
</script>

<template>
	<div v-if="$slots.default || content" role="alert" data-slot="field-error" :class="classes">
		<slot>
			<template v-if="typeof content === 'string'">{{ content }}</template>
			<ul v-else-if="Array.isArray(content)" class="ml-4 flex list-disc flex-col gap-1">
				<li v-for="(error, i) in content" :key="i">{{ error?.message }}</li>
			</ul>
		</slot>
	</div>
</template>
