<script setup lang="ts">
import emblaCarouselVue from "embla-carousel-vue";
import { computed, onMounted, onUnmounted, provide, ref, type HTMLAttributes, type InjectionKey } from "vue";
import { cn } from "../lib/utils";
import { ArrowLeftIcon, ArrowRightIcon } from "lucide-vue-next";
import { buttonVariants } from "./button.vue";

const [emblaRef, emblaApi] = emblaCarouselVue({
	loop: false,
	align: "start",
});

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		orientation?: "horizontal" | "vertical";
		opts?: Record<string, unknown>;
		plugins?: unknown[];
		autoplay?: boolean;
	}>(),
	{ orientation: "horizontal", autoplay: false },
);

const canScrollPrev = ref(false);
const canScrollNext = ref(false);

function onSelect() {
	if (!emblaApi.value) return;
	canScrollPrev.value = emblaApi.value.canScrollPrev();
	canScrollNext.value = emblaApi.value.canScrollNext();
}

onMounted(() => {
	emblaApi.value?.on("select", onSelect);
	emblaApi.value?.on("reInit", onSelect);
	onSelect();
});

onUnmounted(() => {
	emblaApi.value?.off("select", onSelect);
	emblaApi.value?.off("reInit", onSelect);
});

function scrollPrev() {
	emblaApi.value?.scrollPrev();
}
function scrollNext() {
	emblaApi.value?.scrollNext();
}

const classes = computed(() =>
	cn("relative", props.class),
);
const viewportClasses = computed(() =>
	cn(
		"overflow-hidden",
		props.orientation === "vertical" ? "h-full" : "",
	),
);
const containerClasses = computed(() =>
	cn("flex", props.orientation === "vertical" ? "-mt-4 h-full flex-col" : "-ml-4"),
);
const itemClasses = computed(() =>
	cn(
		"min-w-0 shrink-0 grow-0 basis-full",
		props.orientation === "vertical" ? "pt-4" : "pl-4",
	),
);
const btnClasses = computed(() =>
	cn(
		buttonVariants({ variant: "outline", size: "icon-sm" }),
		"absolute size-8 rounded-full",
		props.orientation === "vertical"
			? "top-1/2 -left-12 -translate-y-1/2"
			: "top-1/2 -translate-y-1/2",
	),
);

provide("ktb-carousel-api", emblaApi);
</script>

<template>
	<div data-slot="carousel" :class="classes" role="region" aria-roledescription="carousel">
		<div ref="emblaRef" data-slot="carousel-viewport" :class="viewportClasses">
			<div data-slot="carousel-container" :class="containerClasses">
				<slot :can-scroll-prev="canScrollPrev" :can-scroll-next="canScrollNext" :scroll-prev="scrollPrev" :scroll-next="scrollNext" :api="emblaApi" />
			</div>
		</div>
		<button
			v-if="canScrollPrev"
			type="button"
			data-slot="carousel-previous"
			:class="cn(btnClasses, orientation === 'vertical' ? '' : '-left-12')"
			@click="scrollPrev"
		>
			<ArrowLeftIcon v-if="orientation !== 'vertical'" class="size-4" />
			<ArrowLeftIcon v-else class="size-4 -rotate-90" />
			<span class="sr-only">Previous slide</span>
		</button>
		<button
			v-if="canScrollNext"
			type="button"
			data-slot="carousel-next"
			:class="cn(btnClasses, orientation === 'vertical' ? '' : '-right-12')"
			@click="scrollNext"
		>
			<ArrowRightIcon v-if="orientation !== 'vertical'" class="size-4" />
			<ArrowRightIcon v-else class="size-4 -rotate-90" />
			<span class="sr-only">Next slide</span>
		</button>
	</div>
</template>
