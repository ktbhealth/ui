<script setup lang="ts">
import { computed, type HTMLAttributes } from "vue";
import { cn } from "../lib/utils";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-vue-next";
import { buttonVariants } from "./button.vue";
import Select from "./select.vue";
import SelectTrigger from "./select-trigger.vue";
import SelectValue from "./select-value.vue";
import SelectContent from "./select-content.vue";
import SelectItem from "./select-item.vue";

const props = withDefaults(
	defineProps<{
		class?: HTMLAttributes["class"];
		modelValue?: Date;
		defaultValue?: Date;
		month?: Date;
		minValue?: Date;
		maxValue?: Date;
		disabled?: boolean;
		weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
		locale?: string;
	}>(),
	{ modelValue: undefined, defaultValue: undefined, month: undefined, weekStartsOn: 0, locale: "en-US" },
);

const emits = defineEmits<{
	(e: "update:modelValue", value: Date): void;
	(e: "update:month", value: Date): void;
}>();

const today = new Date();
const viewMonth = computed(() => props.month ?? props.modelValue ?? props.defaultValue ?? today);

const monthNames = computed(() => {
	const fmt = new Intl.DateTimeFormat(props.locale, { month: "long", year: "numeric" });
	return fmt.format(viewMonth.value);
});

const yearOptions = computed(() => {
	const y = viewMonth.value.getFullYear();
	return Array.from({ length: 20 }, (_, i) => y - 10 + i);
});

function startOfMonth(d: Date) {
	return new Date(d.getFullYear(), d.getMonth(), 1);
}
function daysInMonth(d: Date) {
	return new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
}
function weekday(d: Date) {
	const w = d.getDay();
	return (w - (props.weekStartsOn ?? 0) + 7) % 7;
}

const weeks = computed(() => {
	const first = startOfMonth(viewMonth.value);
	const offset = weekday(first);
	const total = daysInMonth(viewMonth.value);
	const cells: (Date | null)[] = [];
	for (let i = 0; i < offset; i++) cells.push(null);
	for (let d = 1; d <= total; d++) {
		cells.push(new Date(first.getFullYear(), first.getMonth(), d));
	}
	while (cells.length % 7 !== 0) cells.push(null);
	const out: (Date | null)[][] = [];
	for (let i = 0; i < cells.length; i += 7) out.push(cells.slice(i, i + 7));
	return out;
});

const weekdayNames = computed(() => {
	const base = new Date(2024, 0, 7); // Sunday
	const names: string[] = [];
	for (let i = 0; i < 7; i++) {
		const d = new Date(base);
		d.setDate(base.getDate() + (((props.weekStartsOn ?? 0) + i) % 7));
		names.push(new Intl.DateTimeFormat(props.locale, { weekday: "short" }).format(d));
	}
	return names;
});

function sameDay(a?: Date, b?: Date) {
	return !!a && !!b && a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}
function isDisabled(d: Date) {
	if (props.disabled) return true;
	if (props.minValue && d < props.minValue) return true;
	if (props.maxValue && d > props.maxValue) return true;
	return false;
}
function selectDay(d: Date) {
	if (isDisabled(d)) return;
	emits("update:modelValue", d);
}
function shiftMonth(delta: number) {
	const m = viewMonth.value;
	emits("update:month", new Date(m.getFullYear(), m.getMonth() + delta, 1));
}
function setYear(y: number) {
	emits("update:month", new Date(y, viewMonth.value.getMonth(), 1));
}

const classes = computed(() => cn("group/calendar bg-background p-2 [--cell-radius:var(--radius-md)] [--cell-size:calc(var(--spacing, 0.25rem) * 7)] w-fit", props.class));
const navBtn = cn(buttonVariants({ variant: "ghost", size: "icon" }), "size-[var(--cell-size)] p-0 select-none aria-disabled:opacity-50");
</script>

<template>
	<div data-slot="calendar" :class="classes">
		<div class="relative flex w-full flex-col gap-4 md:flex-row">
			<div class="flex w-full flex-col gap-4">
				<div class="absolute inset-x-0 top-0 flex w-full items-center justify-between gap-1">
					<button type="button" :class="navBtn" @click="shiftMonth(-1)">
						<ChevronLeftIcon class="size-4" />
						<span class="sr-only">Previous month</span>
					</button>
					<div class="flex h-[var(--cell-size)] items-center gap-1 rounded-[var(--cell-radius)] px-[var(--cell-size)]">
						<span class="text-sm font-medium">{{ monthNames }}</span>
						<Select :model-value="String(viewMonth.getFullYear())" @update:model-value="(v) => setYear(Number(v))">
							<SelectTrigger size="sm" class="h-7 w-auto gap-1 px-1.5">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem v-for="y in yearOptions" :key="y" :value="String(y)">{{ y }}</SelectItem>
							</SelectContent>
						</Select>
					</div>
					<button type="button" :class="navBtn" @click="shiftMonth(1)">
						<ChevronRightIcon class="size-4" />
						<span class="sr-only">Next month</span>
					</button>
				</div>
				<table class="w-full border-collapse">
					<thead>
						<tr class="flex">
							<th
								v-for="(n, i) in weekdayNames"
								:key="i"
								class="flex-1 rounded-[var(--cell-radius)] text-[0.8rem] font-normal text-muted-foreground select-none"
							>
								{{ n }}
							</th>
						</tr>
					</thead>
					<tbody>
						<tr v-for="(week, wi) in weeks" :key="wi" class="mt-2 flex w-full">
							<td
								v-for="(day, di) in week"
								:key="di"
								class="group/day relative aspect-square h-full w-full rounded-[var(--cell-radius)] p-0 text-center select-none"
							>
								<button
									v-if="day"
									type="button"
									class="relative isolate z-0 flex size-full items-center justify-center rounded-[var(--cell-radius)] text-sm font-normal transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none"
									:class="[
										sameDay(day, modelValue ?? defaultValue) && 'bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground',
										sameDay(day, today) && !sameDay(day, modelValue ?? defaultValue) && 'ring-1 ring-border',
									]"
									:disabled="isDisabled(day)"
									@click="selectDay(day)"
								>
									{{ day.getDate() }}
								</button>
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div>
</template>
