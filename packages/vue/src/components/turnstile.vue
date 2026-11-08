<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";

const SCRIPT_SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		siteKey?: string;
		theme?: "light" | "dark" | "auto";
		size?: "normal" | "compact";
		tabindex?: number;
		action?: string;
		cData?: string;
	}>(),
	{ siteKey: undefined, theme: "light", size: "normal", tabindex: 0 },
);

const emits = defineEmits<{
	(e: "verify", token: string): void;
	(e: "expire"): void;
	(e: "error"): void;
	(e: "load"): void;
}>();

const el = ref<HTMLDivElement | null>(null);
const widgetId = ref<string | null>(null);
let scriptPromise: Promise<void> | null = null;

function loadScript(): Promise<void> {
	if (scriptPromise) return scriptPromise;
	scriptPromise = new Promise((resolve, reject) => {
		if (window.turnstile) return resolve();
		const s = document.createElement("script");
		s.src = SCRIPT_SRC;
		s.async = true;
		s.defer = true;
		s.onload = () => resolve();
		s.onerror = () => reject(new Error("Failed to load Turnstile"));
		document.head.appendChild(s);
	});
	return scriptPromise;
}

async function render() {
	if (!el.value || !props.siteKey || !window.turnstile) return;
	widgetId.value = window.turnstile.render(el.value, {
		sitekey: props.siteKey,
		theme: props.theme,
		size: props.size,
		tabindex: props.tabindex,
		action: props.action,
		"cData": props.cData,
		callback: (token: string) => emits("verify", token),
		"expired-callback": () => emits("expire"),
		"error-callback": () => emits("error"),
	});
}

watch(
	() => props.siteKey,
	async (key) => {
		if (!key) return;
		try {
			await loadScript();
			emits("load");
			await render();
		} catch {
			emits("error");
		}
	},
	{ immediate: true },
);

onMounted(async () => {
	if (props.siteKey) {
		try {
			await loadScript();
			await render();
		} catch {
			emits("error");
		}
	}
});

onBeforeUnmount(() => {
	if (widgetId.value && window.turnstile) {
		window.turnstile.remove(widgetId.value);
	}
});

const classes = computed(() => cn("cf-turnstile", props.class));
</script>
