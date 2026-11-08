<script setup lang="ts">
import { computed, nextTick, onMounted, ref, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		length?: number;
		modelValue?: string;
		defaultValue?: string;
		containerClass?: HTMLAttributes["class"];
		pushPasswordManagerStrategy?: "increase-width" | "none";
	}>(),
	{ length: 4, modelValue: undefined, defaultValue: "", pushPasswordManagerStrategy: "increase-width" },
);

const emits = defineEmits<{
	(e: "update:modelValue", value: string): void;
	(e: "complete", value: string): void;
}>();

const internal = ref<string>(props.modelValue ?? props.defaultValue ?? "");
const inputEl = ref<HTMLInputElement | null>(null);
const slots = ref<HTMLInputElement[]>([]);

const value = computed({
	get: () => props.modelValue ?? internal.value,
	set: (v: string) => {
		internal.value = v;
		emits("update:modelValue", v);
	},
});

const chars = computed(() => value.value.split("").slice(0, props.length));

function setSlotRef(el: unknown, i: number) {
	if (el && typeof el === "object" && "focus" in el) {
		slots.value[i] = el as HTMLInputElement;
	}
}

function onInput(i: number, e: Event) {
	const target = e.target as HTMLInputElement;
	const digit = target.value.replace(/\D/g, "").slice(-1);
	target.value = digit;
	const next = value.value.split("");
	while (next.length < props.length) next.push("");
	next[i] = digit;
	value.value = next.join("").slice(0, props.length);
	if (digit && i < props.length - 1) {
		slots.value[i + 1]?.focus();
	}
	if (value.value.length === props.length && !value.value.includes("")) {
		emits("complete", value.value);
	}
}

function onKeydown(i: number, e: KeyboardEvent) {
	if (e.key === "Backspace") {
		if (!chars.value[i] && i > 0) {
			slots.value[i - 1]?.focus();
		}
		const next = value.value.split("");
		while (next.length < props.length) next.push("");
		next[i] = "";
		value.value = next.join("").slice(0, props.length);
	}
	if (e.key === "ArrowLeft" && i > 0) slots.value[i - 1]?.focus();
	if (e.key === "ArrowRight" && i < props.length - 1) slots.value[i + 1]?.focus();
}

function onPaste(e: ClipboardEvent) {
	const text = e.clipboardData?.getData("text").replace(/\D/g, "").slice(0, props.length) ?? "";
	if (!text) return;
	e.preventDefault();
	value.value = text;
	const idx = Math.min(text.length, props.length - 1);
	nextTick(() => slots.value[idx]?.focus());
	if (text.length === props.length) emits("complete", text);
}

const containerClasses = computed(() =>
	cn("flex items-center gap-2 has-disabled:opacity-50", props.containerClass),
);
const slotClasses = computed(() =>
	cn(
		"relative flex h-9 w-9 items-center justify-center rounded-lg border border-input bg-transparent text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:bg-input/30",
		props.class,
	),
);
</script>

<template>
	<div data-slot="input-otp" :class="containerClasses" @paste="onPaste">
		<template v-for="i in length" :key="i - 1">
			<input
				ref="(el) => setSlotRef(el, i - 1)"
				type="text"
				inputmode="numeric"
				autocomplete="one-time-code"
				maxlength="1"
				data-slot="input-otp-slot"
				:class="slotClasses"
				:value="chars[i - 1] ?? ''"
				@input="onInput(i - 1, $event)"
				@keydown="onKeydown(i - 1, $event)"
			>
			<div
				v-if="i < length"
				data-slot="input-otp-separator"
				class="hidden"
			/>
		</template>
		<input
			ref="inputEl"
			class="sr-only"
			:aria-label="'One-time password'"
		>
	</div>
</template>
