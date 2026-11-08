<script setup lang="ts">
import { Toaster } from "vue-sonner";
import { computed, type HTMLAttributes } from "vue";
import { useColorMode } from "@vueuse/core";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		position?: "top-left" | "top-right" | "bottom-left" | "bottom-right" | "top-center" | "bottom-center";
		toastOptions?: Record<string, unknown>;
		richColors?: boolean;
		closeButton?: boolean;
		expand?: boolean;
		duration?: number;
		visibleToasts?: number;
		gap?: number;
		offset?: string | number;
		mobileOffset?: string | number;
		direction?: "ltr" | "rtl" | "auto";
		hotkey?: string[];
		invert?: boolean;
		theme?: "light" | "dark" | "system";
	}>(),
	{ position: "bottom-right", richColors: false, closeButton: false, expand: false, duration: 4000, visibleToasts: 3, gap: 14, direction: "ltr", theme: "light" },
);

const { system } = useColorMode({ emitAuto: false });
const resolvedTheme = computed(() => (props.theme === "system" ? system.value : props.theme));
</script>

<template>
	<Toaster
		:data-slot="'sonner'"
		:class="class"
		:position="position"
		:rich-colors="richColors"
		:close-button="closeButton"
		:expand="expand"
		:duration="duration"
		:visible-toasts="visibleToasts"
		:gap="gap"
		:offset="offset"
		:mobile-offset="mobileOffset"
		:direction="direction"
		:invert="invert"
		:theme="resolvedTheme"
	/>
</template>
