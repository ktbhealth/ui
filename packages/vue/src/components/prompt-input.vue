<script setup lang="ts">
import { computed, ref, type HTMLAttributes, type TextareaHTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { ArrowUpIcon, SquareIcon, XIcon } from "lucide-vue-next";
import Button from "./button.vue";
import InputGroup from "./input-group.vue";
import InputGroupAddon from "./input-group-addon.vue";
import InputGroupTextarea from "./input-group-textarea.vue";
import InputGroupButton from "./input-group-button.vue";

const props = defineProps<{
	class?: HTMLAttributes["class"];
	placeholder?: string;
	loading?: boolean;
	attachments?: { id: string; name: string }[];
}>();

const emits = defineEmits<{
	(e: "submit", value: string): void;
	(e: "cancel"): void;
	(e: "removeAttachment", id: string): void;
}>();

const model = defineModel<string>({ default: "" });
const textareaRef = ref<HTMLTextAreaElement | null>(null);

function onSubmit() {
	const v = model.value.trim();
	if (!v && !(props.attachments?.length)) return;
	if (props.loading) {
		emits("cancel");
		return;
	}
	emits("submit", v);
	model.value = "";
}

function onKeydown(e: KeyboardEvent) {
	if (e.key === "Enter" && !e.shiftKey) {
		e.preventDefault();
		onSubmit();
	}
}

const classes = computed(() => cn("w-full", props.class));
</script>

<template>
	<form
		data-slot="prompt-input"
		:class="classes"
		@submit.prevent="onSubmit"
	>
		<div
			v-if="attachments?.length"
			data-slot="prompt-input-attachments"
			class="mb-2 flex flex-wrap gap-2"
		>
			<div
				v-for="a in attachments"
				:key="a.id"
				data-slot="prompt-input-attachment"
				class="flex items-center gap-1.5 rounded-md border px-2 py-1 text-xs"
			>
				<span class="max-w-40 truncate">{{ a.name }}</span>
				<button
					type="button"
					class="text-muted-foreground hover:text-foreground"
					:aria-label="`Remove ${a.name}`"
					@click="emits('removeAttachment', a.id)"
				>
					<XIcon class="size-3" />
				</button>
			</div>
		</div>
		<InputGroup data-slot="prompt-input-body">
			<InputGroupTextarea
				ref="textareaRef"
				v-model="model"
				data-slot="prompt-input-textarea"
				:placeholder="placeholder ?? 'Ask anything...'"
				rows="1"
				class="max-h-40 min-h-9 resize-none"
				@keydown="onKeydown"
			/>
			<InputGroupAddon align="block-end" class="pt-1">
				<InputGroupButton
					type="submit"
					size="icon-sm"
					class="ml-auto rounded-full"
					:aria-label="loading ? 'Stop' : 'Send'"
				>
					<SquareIcon v-if="loading" class="size-4 fill-current" />
					<ArrowUpIcon v-else class="size-4" />
				</InputGroupButton>
			</InputGroupAddon>
		</InputGroup>
		<slot name="footer" />
	</form>
</template>
