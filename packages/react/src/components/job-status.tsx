import * as React from "react";
import { mergeProps } from "@base-ui/react/merge-props";
import { useRender } from "@base-ui/react/use-render";
import { cva } from "class-variance-authority";
import { cn } from "cn";
import {
	CheckIcon,
	CheckCircle2Icon,
	ChevronDownIcon,
	CircleIcon,
	ClockIcon,
	LayersIcon,
	ListChecksIcon,
	Loader2Icon,
	XCircleIcon,
} from "lucide-react";

import { Alert, AlertAction, AlertDescription, AlertTitle } from "@ktbhealth/ui/components/alert";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@ktbhealth/ui/components/collapsible";
import { Empty, EmptyContent, EmptyDescription, EmptyHeader, EmptyMedia, EmptyTitle } from "@ktbhealth/ui/components/empty";
import { Progress } from "@ktbhealth/ui/components/progress";
import { Skeleton } from "@ktbhealth/ui/components/skeleton";
import { Tabs, TabsList, TabsTrigger } from "@ktbhealth/ui/components/tabs";

export const JOB_STATUSES = ["queued", "processing", "done", "failed"] as const;

export type JobStatusValue = (typeof JOB_STATUSES)[number];

export const JOB_STATUS_LABELS: Record<JobStatusValue, string> = {
	queued: "Queued",
	processing: "Processing",
	done: "Done",
	failed: "Failed",
};

export const JOB_STATUS_ICONS: Record<JobStatusValue, React.ReactNode> = {
	queued: <ClockIcon />,
	processing: <Loader2Icon className="animate-spin" />,
	done: <CheckCircle2Icon />,
	failed: <XCircleIcon />,
};

// `Progress` renders its own indicator (bg-primary); recolor it through
// the data-slot selector rather than rendering a second track.
const JOB_STATUS_PROGRESS: Record<JobStatusValue, string> = {
	queued: "[&_[data-slot=progress-indicator]]:bg-muted-foreground/40",
	processing: "[&_[data-slot=progress-indicator]]:bg-primary",
	done: "[&_[data-slot=progress-indicator]]:bg-green-500",
	failed: "[&_[data-slot=progress-indicator]]:bg-destructive",
};

const jobStatusVariants = cva(
	"group/job-status inline-flex h-5 w-fit shrink-0 items-center justify-center gap-1 overflow-hidden rounded-4xl border px-2 py-0.5 text-xs font-medium whitespace-nowrap [&>svg]:pointer-events-none [&>svg]:size-3!",
	{
		variants: {
			status: {
				queued: "border-border bg-muted text-muted-foreground",
				processing: "border-transparent bg-primary text-primary-foreground",
				done: "border-transparent bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
				failed:
					"border-transparent bg-destructive/10 text-destructive focus-visible:ring-destructive/20 dark:bg-destructive/20 dark:focus-visible:ring-destructive/40",
			},
		},
		defaultVariants: {
			status: "queued",
		},
	},
);

type JobStatusProps = useRender.ComponentProps<"span"> & {
	status: JobStatusValue;
	/** Visible label — defaults to the capitalized status name. */
	label?: React.ReactNode;
	/** Leading icon — defaults to the per-status icon (`null` hides it). */
	icon?: React.ReactNode;
};

function JobStatus({
	status,
	label,
	icon,
	children,
	className,
	render,
	...props
}: JobStatusProps) {
	const statusIcon = icon === undefined ? JOB_STATUS_ICONS[status] : icon;
	return useRender({
		defaultTagName: "span",
		props: mergeProps<"span">(
			{
				className: cn(jobStatusVariants({ status }), className),
				children: children ?? (
					<>
						{statusIcon}
						{label ?? JOB_STATUS_LABELS[status]}
					</>
				),
			},
			props,
		),
		render,
		state: {
			slot: "job-status",
			status,
		},
	});
}

type JobItemProps = React.ComponentProps<"div"> & {
	/** Job name or identifier shown as the row title. */
	title: React.ReactNode;
	/** Optional secondary line (e.g. job kind, patient, file name). */
	description?: React.ReactNode;
	status: JobStatusValue;
	/**
	 * Determinate progress 0–100. Pass `null` for an indeterminate bar.
	 * When `undefined`, no progress track is rendered.
	 */
	progress?: number | null;
	/** Timestamp / queue position / other metadata shown at the bottom. */
	meta?: React.ReactNode;
	/** Trailing actions (retry, cancel, view result…). */
	actions?: React.ReactNode;
};

function JobItem({
	title,
	description,
	status,
	progress,
	meta,
	actions,
	className,
	...props
}: JobItemProps) {
	return (
		<div
			data-slot="job-item"
			className={cn(
				"flex flex-col gap-2.5 rounded-lg border border-border bg-card p-3 text-card-foreground",
				className,
			)}
			{...props}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0 flex-1">
					<div className="truncate text-sm font-medium">{title}</div>
					{description ? (
						<div className="mt-0.5 text-xs text-muted-foreground">{description}</div>
					) : null}
				</div>
				<JobStatus status={status} className="mt-0.5" />
			</div>
			{progress !== undefined ? (
				<Progress
					value={progress ?? null}
					className={cn("w-full flex-col gap-1.5", JOB_STATUS_PROGRESS[status])}
				>
					<div className="flex items-center justify-between text-xs text-muted-foreground">
						<span className="truncate">{JOB_STATUS_LABELS[status]}</span>
						<span className="tabular-nums">
							{progress == null ? "…" : `${Math.round(progress)}%`}
						</span>
					</div>
				</Progress>
			) : null}
			{meta || actions ? (
				<div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
					<span className="min-w-0 truncate">{meta}</span>
					{actions ? <span className="flex shrink-0 items-center gap-1">{actions}</span> : null}
				</div>
			) : null}
		</div>
	);
}

function JobList({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			role="list"
			data-slot="job-list"
			className={cn("flex flex-col gap-2", className)}
			{...props}
		/>
	);
}

/* ---------------------------------- filter --------------------------------- */

type JobStatusFilter = JobStatusValue | "all";

type JobStatusTabsProps = {
	/** Currently selected filter — `"all"` shows every job. */
	value: JobStatusFilter;
	onValueChange?: (value: JobStatusFilter) => void;
	/** Optional per-filter counts rendered as a small pill on each tab. */
	counts?: Partial<Record<JobStatusFilter, number>>;
	className?: string;
};

function JobStatusTabs({ value, onValueChange, counts, className }: JobStatusTabsProps) {
	const filters: JobStatusFilter[] = ["all", ...JOB_STATUSES];
	return (
		<Tabs
			value={value}
			onValueChange={(next) => onValueChange?.(next as JobStatusFilter)}
			className={className}
		>
			<TabsList aria-label="Filter jobs by status">
				{filters.map((filter) => {
					const count = counts?.[filter];
					return (
						<TabsTrigger key={filter} value={filter}>
							{filter === "all" ? <LayersIcon /> : JOB_STATUS_ICONS[filter]}
							<span>{filter === "all" ? "All" : JOB_STATUS_LABELS[filter]}</span>
							{count != null ? (
								<span className="rounded-full bg-muted px-1.5 py-px text-[0.65rem] leading-4 font-medium text-muted-foreground tabular-nums">
									{count}
								</span>
							) : null}
						</TabsTrigger>
					);
				})}
			</TabsList>
		</Tabs>
	);
}

/* ----------------------------------- queue --------------------------------- */

type JobQueueSectionProps = {
	status: JobStatusValue;
	/** Section heading — defaults to the status label. */
	title?: React.ReactNode;
	/** Item count pill shown next to the title. */
	count?: React.ReactNode;
	/** Wrap the section in a collapsible disclosure (default: true). */
	collapsible?: boolean;
	/** Initial open state when collapsible (default: true). */
	defaultOpen?: boolean;
	/** Trailing header actions (e.g. "clear finished"). */
	actions?: React.ReactNode;
	className?: string;
	children: React.ReactNode;
};

function JobQueueSectionHeader({
	status,
	title,
	count,
	collapsible,
	actions,
}: {
	status: JobStatusValue;
	title?: React.ReactNode;
	count?: React.ReactNode;
	collapsible: boolean;
	actions?: React.ReactNode;
}) {
	const content = (
		<>
			{collapsible ? (
				<ChevronDownIcon className="size-3.5 text-muted-foreground transition-transform group-data-[panel-open]/queue-trigger:rotate-180" />
			) : null}
			<span className="text-muted-foreground [&_svg]:size-3.5">{JOB_STATUS_ICONS[status]}</span>
			<span className="text-sm font-medium">{title ?? JOB_STATUS_LABELS[status]}</span>
			{count != null ? (
				<span className="rounded-full bg-muted px-1.5 py-px text-[0.65rem] leading-4 font-medium text-muted-foreground tabular-nums">
					{count}
				</span>
			) : null}
		</>
	);
	return (
		<div className="flex items-center justify-between gap-2">
			{collapsible ? (
				<CollapsibleTrigger className="group/queue-trigger flex flex-1 items-center gap-1.5 rounded-md px-1 py-1 text-left outline-none hover:bg-muted/60 focus-visible:ring-2 focus-visible:ring-ring/50">
					{content}
				</CollapsibleTrigger>
			) : (
				<div className="flex flex-1 items-center gap-1.5 px-1 py-1">{content}</div>
			)}
			{actions ? <div className="flex shrink-0 items-center gap-1">{actions}</div> : null}
		</div>
	);
}

function JobQueueSection({
	status,
	title,
	count,
	collapsible = true,
	defaultOpen = true,
	actions,
	className,
	children,
}: JobQueueSectionProps) {
	if (!collapsible) {
		return (
			<section data-slot="job-queue-section" data-status={status} className={className}>
				<JobQueueSectionHeader
					status={status}
					title={title}
					count={count}
					collapsible={false}
					actions={actions}
				/>
				<JobList className="mt-1.5">{children}</JobList>
			</section>
		);
	}
	return (
		<Collapsible
			defaultOpen={defaultOpen}
			data-slot="job-queue-section"
			data-status={status}
			className={className}
		>
			<JobQueueSectionHeader
				status={status}
				title={title}
				count={count}
				collapsible
				actions={actions}
			/>
			<CollapsibleContent className="mt-1.5">
				<JobList>{children}</JobList>
			</CollapsibleContent>
		</Collapsible>
	);
}

type JobQueueGroup = {
	status: JobStatusValue;
	/** Section heading — defaults to the status label. */
	title?: React.ReactNode;
	/** `JobItem` props rendered as rows inside the section. */
	jobs: JobItemProps[];
	collapsible?: boolean;
	defaultOpen?: boolean;
	/** Trailing header actions (e.g. "clear finished"). */
	actions?: React.ReactNode;
};

type JobQueueProps = React.ComponentProps<"div"> & {
	/** Groups rendered in order; each becomes a collapsible status section. */
	groups: JobQueueGroup[];
};

function JobQueue({ groups, className, ...props }: JobQueueProps) {
	return (
		<div
			role="list"
			data-slot="job-queue"
			className={cn("flex flex-col gap-4", className)}
			{...props}
		>
			{groups.map((group, index) => (
				<JobQueueSection
					key={`${group.status}-${index}`}
					status={group.status}
					title={group.title}
					count={group.jobs.length}
					collapsible={group.collapsible}
					defaultOpen={group.defaultOpen}
					actions={group.actions}
				>
					{group.jobs.map((job, jobIndex) => (
						<JobItem key={jobIndex} {...job} />
					))}
				</JobQueueSection>
			))}
		</div>
	);
}

/* ---------------------------------- timeline -------------------------------- */

type JobTimelineProps = {
	status: JobStatusValue;
	/** Override the step labels (defaults to the status labels). */
	labels?: Partial<Record<JobStatusValue, React.ReactNode>>;
	/** Extra content rendered under the steps (e.g. an error message). */
	footer?: React.ReactNode;
	className?: string;
};

type JobTimelineStepState = "complete" | "active" | "failed" | "pending";

const JOB_TIMELINE_STEP_STATES: Record<JobTimelineStepState, string> = {
	complete: "text-green-600 dark:text-green-400",
	active: "text-foreground",
	failed: "text-destructive",
	pending: "text-muted-foreground/50",
};

function JobTimeline({ status, labels, footer, className }: JobTimelineProps) {
	// The terminal step is "done" or "failed" depending on the job status.
	const steps: JobStatusValue[] = ["queued", "processing", status === "failed" ? "failed" : "done"];
	const currentIndex = status === "queued" ? 0 : status === "processing" ? 1 : 2;

	const stepState = (index: number): JobTimelineStepState => {
		if (index < currentIndex) return "complete";
		if (index > currentIndex) return "pending";
		if (status === "failed" && index === 2) return "failed";
		if (status === "done") return "complete";
		return "active";
	};

	const stepIcon = (step: JobStatusValue, state: JobTimelineStepState) => {
		switch (state) {
			case "complete":
				return <CheckIcon className="size-4" />;
			case "failed":
				return <XCircleIcon className="size-4" />;
			case "active":
				return JOB_STATUS_ICONS[step];
			default:
				return <CircleIcon className="size-4" />;
		}
	};

	return (
		<div data-slot="job-timeline" data-status={status} className={className}>
			<ol className="flex items-start">
				{steps.map((step, index) => {
					const state = stepState(index);
					const previousComplete = index > 0 && stepState(index - 1) === "complete";
					return (
						<li key={step} className="flex flex-1 items-center gap-2">
							{index > 0 ? (
								<span
									aria-hidden
									className={cn("h-px flex-1", previousComplete ? "bg-green-500" : "bg-border")}
								/>
							) : null}
							<span className={cn("flex shrink-0 items-center", JOB_TIMELINE_STEP_STATES[state])}>
								{stepIcon(step, state)}
							</span>
							<span
								className={cn(
									"truncate text-xs",
									state === "pending" ? "text-muted-foreground" : "text-foreground",
								)}
							>
								{labels?.[step] ?? JOB_STATUS_LABELS[step]}
							</span>
						</li>
					);
				})}
			</ol>
			{footer}
		</div>
	);
}

/* ------------------------------- batch progress ----------------------------- */

type JobBatchProgressProps = {
	/** Statuses of every job in the batch. */
	jobs: readonly JobStatusValue[];
	/** Override the summary text (default: "X of Y done"). */
	label?: React.ReactNode;
	className?: string;
};

function JobBatchProgress({ jobs, label, className }: JobBatchProgressProps) {
	const total = jobs.length;
	const done = jobs.filter((status) => status === "done").length;
	const failed = jobs.filter((status) => status === "failed").length;
	const percent = total === 0 ? 0 : Math.round((done / total) * 100);
	const indicatorStatus: JobStatusValue = failed > 0 && done === 0 ? "failed" : "processing";

	return (
		<div data-slot="job-batch-progress" className={cn("flex flex-col gap-1.5", className)}>
			<div className="flex items-center justify-between gap-2 text-xs text-muted-foreground">
				<span className="truncate">{label ?? `${done} of ${total} done`}</span>
				<span className="shrink-0 tabular-nums">
					{failed > 0 ? `${failed} failed · ` : ""}
					{percent}%
				</span>
			</div>
			<Progress value={percent} className={cn("w-full", JOB_STATUS_PROGRESS[indicatorStatus])} />
		</div>
	);
}

/* --------------------------------- empty state ------------------------------ */

type JobEmptyStateProps = {
	/** Heading — defaults to "No jobs". */
	title?: React.ReactNode;
	/** Supporting copy — defaults to a queue hint. */
	description?: React.ReactNode;
	/** Leading visual — defaults to a checks icon tile. */
	icon?: React.ReactNode;
	/** Optional call to action (e.g. a "New export" button). */
	action?: React.ReactNode;
	className?: string;
};

function JobEmptyState({
	title = "No jobs",
	description = "Jobs you queue — transcriptions, exports, syncs — will show up here.",
	icon,
	action,
	className,
}: JobEmptyStateProps) {
	return (
		<Empty data-slot="job-empty-state" className={className}>
			<EmptyHeader>
				<EmptyMedia variant="icon">{icon ?? <ListChecksIcon />}</EmptyMedia>
				<EmptyTitle>{title}</EmptyTitle>
				<EmptyDescription>{description}</EmptyDescription>
			</EmptyHeader>
			{action ? <EmptyContent>{action}</EmptyContent> : null}
		</Empty>
	);
}

/* --------------------------------- error alert ------------------------------ */

type JobErrorAlertProps = {
	/** Alert heading — defaults to "Job failed". */
	title?: React.ReactNode;
	/** Job name shown next to the heading. */
	jobTitle?: React.ReactNode;
	/** Error message or failure reason. */
	error?: React.ReactNode;
	/** Attempt metadata, e.g. "attempt 3/3 · worker-02". */
	attempts?: React.ReactNode;
	/** Trailing actions (e.g. a Retry button). */
	actions?: React.ReactNode;
	className?: string;
};

function JobErrorAlert({
	title = "Job failed",
	jobTitle,
	error,
	attempts,
	actions,
	className,
}: JobErrorAlertProps) {
	return (
		<Alert variant="destructive" data-slot="job-error-alert" className={className}>
			<XCircleIcon />
			<AlertTitle>
				{title}
				{jobTitle ? (
					<span className="font-normal text-muted-foreground"> — {jobTitle}</span>
				) : null}
			</AlertTitle>
			<AlertDescription>
				{error}
				{attempts ? (
					<span className="mt-1 block text-xs text-muted-foreground">{attempts}</span>
				) : null}
			</AlertDescription>
			{actions ? <AlertAction>{actions}</AlertAction> : null}
		</Alert>
	);
}

/* -------------------------------- loading state ----------------------------- */

function JobItemSkeleton({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="job-item-skeleton"
			aria-hidden
			className={cn(
				"flex flex-col gap-2.5 rounded-lg border border-border bg-card p-3",
				className,
			)}
			{...props}
		>
			<div className="flex items-start justify-between gap-3">
				<div className="min-w-0 flex-1 space-y-1.5">
					<Skeleton className="h-4 w-1/2" />
					<Skeleton className="h-3 w-3/4" />
				</div>
				<Skeleton className="h-5 w-16 rounded-full" />
			</div>
			<Skeleton className="h-1 w-full rounded-full" />
			<div className="flex items-center justify-between">
				<Skeleton className="h-3 w-1/4" />
				<Skeleton className="h-3 w-1/5" />
			</div>
		</div>
	);
}

export {
	JobBatchProgress,
	JobEmptyState,
	JobErrorAlert,
	JobItem,
	JobItemSkeleton,
	JobList,
	JobQueue,
	JobQueueSection,
	JobStatus,
	JobStatusTabs,
	JobTimeline,
	jobStatusVariants,
	type JobBatchProgressProps,
	type JobEmptyStateProps,
	type JobErrorAlertProps,
	type JobItemProps,
	type JobQueueGroup,
	type JobQueueProps,
	type JobQueueSectionProps,
	type JobStatusFilter,
	type JobStatusProps,
	type JobStatusTabsProps,
	type JobTimelineProps,
};
