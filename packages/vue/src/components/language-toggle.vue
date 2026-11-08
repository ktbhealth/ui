<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { LanguagesIcon } from "lucide-vue-next";
import { cn } from "../lib/utils";
import { buttonVariants, type ButtonVariants } from "./button.vue";
import DropdownMenu from "./dropdown-menu.vue";
import DropdownMenuContent from "./dropdown-menu-content.vue";
import DropdownMenuRadioGroup from "./dropdown-menu-radio-group.vue";
import DropdownMenuRadioItem from "./dropdown-menu-radio-item.vue";
import DropdownMenuTrigger from "./dropdown-menu-trigger.vue";

interface Props {
	/** Available locale codes, e.g. `["en", "pt-BR", "es"]`. */
	locales: readonly string[];
	/** Currently selected locale (use with `v-model`). */
	modelValue: string;
	/** Display names keyed by locale code. Falls back to the code itself. */
	labels?: Record<string, string>;
	/** Accessible label for the icon-only trigger button. */
	label?: string;
	variant?: ButtonVariants["variant"];
	size?: ButtonVariants["size"];
	class?: HTMLAttributes["class"];
	align?: "start" | "center" | "end";
	side?: "top" | "right" | "bottom" | "left";
	sideOffset?: number;
}

const props = withDefaults(defineProps<Props>(), {
	label: "Language",
	variant: "ghost",
	size: "icon-sm",
	align: "end",
	side: "bottom",
	sideOffset: 4,
});

const emit = defineEmits<{
	(e: "update:modelValue", value: string): void;
}>();

const triggerClasses = computed(() =>
	cn(buttonVariants({ variant: props.variant, size: props.size }), props.class),
);
</script>

<template>
	<DropdownMenu>
		<DropdownMenuTrigger
			data-slot="language-toggle-trigger"
			:aria-label="label"
			:class="triggerClasses"
		>
			<LanguagesIcon />
		</DropdownMenuTrigger>
		<DropdownMenuContent :align="align" :side="side" :side-offset="sideOffset">
			<DropdownMenuRadioGroup
				:model-value="modelValue"
				@update:model-value="(v) => emit('update:modelValue', String(v))"
			>
				<DropdownMenuRadioItem
					v-for="locale in locales"
					:key="locale"
					:value="locale"
					:aria-current="locale === modelValue ? 'true' : undefined"
				>
					{{ labels?.[locale] ?? locale }}
				</DropdownMenuRadioItem>
			</DropdownMenuRadioGroup>
		</DropdownMenuContent>
	</DropdownMenu>
</template>
