<script setup lang="ts">
import { computed, onMounted, ref, watch, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { CheckCircle2Icon, XCircleIcon, XIcon } from "lucide-vue-next";
import Button from "./button.vue";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		open?: boolean;
		tone?: "success" | "error";
		title?: string;
	}>(),
	{ open: false, tone: "success", title: "" },
);

const emits = defineEmits<{
	(e: "close"): void;
	(e: "update:open", value: boolean): void;
}>();

const dialogEl = ref<HTMLDialogElement | null>(null);

watch(
	() => props.open,
	(open) => {
		const d = dialogEl.value;
		if (!d) return;
		if (open && !d.open) d.showModal();
		if (!open && d.open) d.close();
	},
	{ immediate: true },
);

onMounted(() => {
	const d = dialogEl.value;
	if (d) {
		d.addEventListener("close", () => emits("update:open", false));
		d.addEventListener("click", (e) => {
			if (e.target === d) emits("close");
		});
	}
});

const classes = computed(() => cn("app-dialog", props.class));
</script>

<template>
	<dialog
		ref="dialogEl"
		data-slot="app-dialog"
		:class="classes"
		@cancel.prevent="emits('close')"
	>
		<div class="flex flex-col gap-4 p-6">
			<div class="flex items-start gap-3">
				<CheckCircle2Icon v-if="tone === 'success'" class="mt-0.5 size-5 shrink-0 text-primary" />
				<XCircleIcon v-else class="mt-0.5 size-5 shrink-0 text-destructive" />
				<div class="flex-1">
					<h2 class="font-heading text-base font-semibold">{{ title }}</h2>
					<div class="mt-1 text-sm text-muted-foreground">
						<slot />
					</div>
				</div>
				<Button variant="ghost" size="icon-sm" @click="emits('close')">
					<XIcon class="size-4" />
					<span class="sr-only">Close</span>
				</Button>
			</div>
			<div v-if="$slots.actions" class="flex justify-end gap-2">
				<slot name="actions" />
			</div>
		</div>
	</dialog>
</template>
