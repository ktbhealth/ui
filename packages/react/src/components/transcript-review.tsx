"use client";

import * as React from "react";
import { cn } from "cn";
import {
	ArrowLeftIcon,
	CheckCircle2Icon,
	CheckIcon,
	ClipboardListIcon,
	ClockIcon,
	GaugeIcon,
	PauseIcon,
	PlayIcon,
	RotateCcwIcon,
	RotateCwIcon,
	ShieldCheckIcon,
	SubtitlesIcon,
	TimerIcon,
	TriangleAlertIcon,
	Volume2Icon,
	VolumeXIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@ktbhealth/ui/components/avatar";
import { Badge } from "@ktbhealth/ui/components/badge";
import { Button } from "@ktbhealth/ui/components/button";
import { Card } from "@ktbhealth/ui/components/card";
import { Kbd, KbdGroup } from "@ktbhealth/ui/components/kbd";
import { ScrollArea } from "@ktbhealth/ui/components/scroll-area";
import { Tabs, TabsList, TabsTrigger } from "@ktbhealth/ui/components/tabs";

/* ---------------------------------- types ---------------------------------- */

/** Where the consultation audio was captured. Telemedicine consultations
 * record ONLY the external meeting tab's audio (Google Meet etc.); in-person
 * ones use the room microphone. */
export type ReviewAudioSource = "mic" | "tab";

/** The two review steps — transcript first, then anamnesis. */
export type ReviewStep = "transcript" | "anamnesis";

/** Patient + consultation metadata shown in the review chip. */
export interface ReviewPatient {
	name: string;
	/** Avatar initials — derived from `name` when omitted. */
	initials?: string;
	/** Free-form age label, e.g. `42` or `"42 anos"`. */
	age?: React.ReactNode;
	/** Consultation number, e.g. `"#17"`. */
	consultationNumber?: React.ReactNode;
	/** Consultation timestamp, already formatted for display. */
	consultedAt?: React.ReactNode;
	/** Recording duration in seconds (renders the timer badge). */
	durationSec?: number;
}

/** One timestamped chunk inside a speaker turn (a Whisper segment). */
export interface ReviewTranscriptSegment {
	text: string;
	/** Preformatted timestamp, e.g. `"0:18"`. Falls back to `startSec`. */
	time?: string;
	/** Seconds from audio start — enables click-to-seek and live highlight. */
	startSec?: number;
	endSec?: number;
	/** Topic tag, e.g. "Chief complaint" / "Symptom evolution". */
	label?: string;
	/** ASR flagged this chunk (low confidence, uncertain term…). */
	flagged?: boolean;
}

/** One diarized speaker turn in the review feed. */
export interface ReviewTurn {
	/** Stable id (React key fallback). */
	id?: string;
	/** Diarization label, e.g. `"SPEAKER_00"` or a matched name. */
	speaker?: string;
	/** Display name, e.g. "Luís Fernando". */
	name: string;
	/** Role chip, e.g. "Physician", "Patient". */
	roleLabel?: string;
	/** Drives the avatar tone: physician / patient / other. */
	role?: "physician" | "patient" | "other";
	/** Turn start timestamp, preformatted. */
	time?: string;
	/** Timestamped chunks; when omitted the turn renders `text` as one block. */
	segments?: ReviewTranscriptSegment[];
	/** Plain-text body used when `segments` is absent. */
	text?: string;
}

/** Playback snapshot consumed by the player bar and the composite. */
export interface ReviewAudioState {
	playing: boolean;
	/** Playhead position, seconds. */
	positionSec: number;
	/** Total duration, seconds. */
	durationSec: number;
	/** Playback rate multiplier (e.g. 1.25). */
	speed: number;
	/** Volume 0–1. */
	volume: number;
	muted: boolean;
}

/** Callbacks for the player bar. All optional — the bar degrades to a
 * read-only display when a handler is missing. */
export interface ReviewAudioHandlers {
	onPlayPause?: () => void;
	/** Absolute seek, seconds. */
	onSeek?: (sec: number) => void;
	/** Relative seek, seconds (±10s buttons, arrow keys). */
	onSkip?: (deltaSec: number) => void;
	/** Cycle to the next entry of `PLAYBACK_SPEEDS`. */
	onSpeedChange?: (rate: number) => void;
	onVolumeChange?: (volume: number) => void;
	onMutedChange?: (muted: boolean) => void;
}

/** Confidence banner metrics. `confidence` is a 0–100 percentage. */
export interface ReviewConfidence {
	confidence: number;
	/** Detected anomaly count (uncertain terms, overlaps…). */
	anomalies?: number;
	/** Force the banner tone; derived from `confidence` when omitted. */
	tone?: "success" | "warning" | "destructive";
	/** Banner heading — defaults to a localized-by-prop English string. */
	title?: React.ReactNode;
	/** Supporting copy under the heading. */
	description?: React.ReactNode;
	/** Right-side summary chip, e.g. "0 anomalies detected". */
	meta?: React.ReactNode;
}

/** Keyboard shortcut entry rendered in the review footer. */
export interface ReviewShortcut {
	/** Key labels, e.g. `["Space"]` or `["←"]`. */
	keys: readonly string[];
	label: string;
}

/* --------------------------------- helpers --------------------------------- */

export const REVIEW_PLAYBACK_SPEEDS = [1, 1.25, 1.5, 2] as const;

/** `m:ss` formatter shared by every timestamp in the review UI. */
export function formatReviewTime(seconds: number): string {
	const s = Math.max(0, Math.floor(seconds));
	return `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, "0")}`;
}

function initialsOf(name: string): string {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0]!.toUpperCase())
		.join("");
}

const SEGMENT_TONE: Record<NonNullable<ReviewTurn["role"]>, string> = {
	physician: "bg-secondary/15 text-secondary border-secondary/30",
	patient: "bg-primary/15 text-primary border-primary/30",
	other: "bg-muted text-muted-foreground border-border",
};

const SEGMENT_NAME_TONE: Record<NonNullable<ReviewTurn["role"]>, string> = {
	physician: "text-secondary",
	patient: "text-primary",
	other: "text-foreground",
};

/* --------------------------------- header ----------------------------------- */

export interface PatientReviewChipProps extends React.ComponentProps<"div"> {
	patient: ReviewPatient;
}

/** Pill-shaped patient identity chip: avatar initials + name, age,
 * consultation number, timestamp and a duration badge. */
export function PatientReviewChip({ patient, className, ...props }: PatientReviewChipProps) {
	return (
		<div
			data-slot="patient-review-chip"
			className={cn(
				"flex items-center gap-2 rounded-full bg-muted/70 px-3 py-1.5",
				className,
			)}
			{...props}
		>
			<Avatar className="size-7">
				<AvatarFallback className="bg-primary/15 text-[11px] font-bold text-primary">
					{patient.initials ?? initialsOf(patient.name)}
				</AvatarFallback>
			</Avatar>
			<div className="flex flex-wrap items-center gap-x-1.5 text-sm">
				<span className="font-medium">{patient.name}</span>
				{patient.age != null ? (
					<>
						<span className="text-muted-foreground/50 text-[10px]">•</span>
						<span className="text-muted-foreground">{patient.age}</span>
					</>
				) : null}
				{patient.consultationNumber != null ? (
					<>
						<span className="text-muted-foreground/50 text-[10px]">•</span>
						<span className="font-mono text-xs text-primary tabular-nums">
							{patient.consultationNumber}
						</span>
					</>
				) : null}
				{patient.consultedAt != null ? (
					<>
						<span className="text-muted-foreground/50 text-[10px]">•</span>
						<span className="font-mono text-xs text-muted-foreground tabular-nums">
							{patient.consultedAt}
						</span>
					</>
				) : null}
			</div>
			{patient.durationSec != null ? (
				<span className="ml-1 hidden items-center gap-1 rounded-full bg-background/80 px-2 py-0.5 lg:flex">
					<TimerIcon className="size-3 text-success" />
					<span className="font-mono text-[11px] text-success tabular-nums">
						{formatReviewTime(patient.durationSec)}
					</span>
				</span>
			) : null}
		</div>
	);
}

export interface ReviewHeaderProps
	extends Omit<React.ComponentProps<"div">, "title"> {
	/** Section title — defaults to "Review Mode". */
	title?: React.ReactNode;
	/** Pulsing status dot next to the title (default true). */
	live?: boolean;
	patient?: ReviewPatient;
	/** Trailing actions (postpone, queue…). */
	actions?: React.ReactNode;
}

/** Sub-header strip: live dot + title, patient chip and action buttons. */
export function ReviewHeader({
	title = "Review Mode",
	live = true,
	patient,
	actions,
	className,
	...props
}: ReviewHeaderProps) {
	return (
		<div
			data-slot="review-header"
			className={cn("flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between", className)}
			{...props}
		>
			<div className="flex flex-wrap items-center gap-3">
				<div className="flex items-center gap-2">
					<span
						className={cn(
							"size-2.5 rounded-full bg-success",
							live && "animate-pulse shadow-[0_0_8px] shadow-success/60",
						)}
					/>
					<h1 className="text-xl font-semibold tracking-tight">{title}</h1>
				</div>
				{patient ? (
					<>
						<span className="hidden h-6 w-px bg-border sm:block" />
						<PatientReviewChip patient={patient} />
					</>
				) : null}
			</div>
			{actions ? <div className="flex items-center gap-2">{actions}</div> : null}
		</div>
	);
}

/* --------------------------------- step tabs -------------------------------- */

export interface ReviewStepTabsProps {
	value: ReviewStep;
	onValueChange?: (step: ReviewStep) => void;
	transcriptLabel?: React.ReactNode;
	anamnesisLabel?: React.ReactNode;
	/** Steps already completed — renders a check on the tab. */
	completed?: Partial<Record<ReviewStep, boolean>>;
	className?: string;
}

/** Segmented pill control switching between the transcript and
 * anamnesis steps. */
export function ReviewStepTabs({
	value,
	onValueChange,
	transcriptLabel = "Transcript",
	anamnesisLabel = "Anamnesis",
	completed,
	className,
}: ReviewStepTabsProps) {
	return (
		<Tabs
			value={value}
			onValueChange={(v) => onValueChange?.(v as ReviewStep)}
			className={cn("w-fit", className)}
		>
			<TabsList className="rounded-full bg-muted p-1">
				<TabsTrigger
					value="transcript"
					className="h-auto rounded-full px-4 py-1.5 data-active:bg-primary data-active:text-primary-foreground"
				>
					<SubtitlesIcon />
					<span>{transcriptLabel}</span>
					{completed?.transcript ? <CheckIcon className="text-success" /> : null}
					{value === "transcript" ? (
						<span className="ml-0.5 size-1.5 rounded-full bg-primary-foreground" />
					) : null}
				</TabsTrigger>
				<TabsTrigger
					value="anamnesis"
					className="h-auto rounded-full px-4 py-1.5 data-active:bg-primary data-active:text-primary-foreground"
				>
					<ClipboardListIcon />
					<span>{anamnesisLabel}</span>
					{completed?.anamnesis ? <CheckIcon className="text-success" /> : null}
				</TabsTrigger>
			</TabsList>
		</Tabs>
	);
}

/* -------------------------------- player bar -------------------------------- */

export interface TranscriptPlayerBarProps extends React.ComponentProps<"div"> {
	audio: ReviewAudioState;
	handlers?: ReviewAudioHandlers;
	/** Where the audio was captured — drives the source badge. */
	audioSource?: ReviewAudioSource;
	/** Transcription engine tag, e.g. "Whisper-Large-v3 Turbo". */
	modelLabel?: React.ReactNode;
	/** Right-side badge, defaults to "Audio Master Sync". */
	syncLabel?: React.ReactNode;
	playbackLabel?: React.ReactNode;
	speedLabel?: string;
	volumeLabel?: string;
}

const SOURCE_LABELS: Record<ReviewAudioSource, string> = {
	mic: "Room microphone",
	tab: "Meeting tab loopback",
};

/** Clinical playback bar: play/pause, ±10s, clickable scrubber with
 * time display, playback-speed cycler and volume. Fully controlled via
 * `audio` + `handlers`. */
export function TranscriptPlayerBar({
	audio,
	handlers = {},
	audioSource = "mic",
	modelLabel,
	syncLabel = "Audio Master Sync",
	playbackLabel = "Clinical Playback",
	speedLabel = "Playback speed",
	volumeLabel = "Volume",
	className,
	...props
}: TranscriptPlayerBarProps) {
	const trackRef = React.useRef<HTMLDivElement>(null);
	const duration = Math.max(audio.durationSec, 0);
	const position = Math.min(Math.max(audio.positionSec, 0), duration);
	const progress = duration > 0 ? position / duration : 0;

	const seekFromEvent = (clientX: number) => {
		const el = trackRef.current;
		if (!el || duration <= 0 || !handlers.onSeek) return;
		const rect = el.getBoundingClientRect();
		const ratio = Math.min(Math.max((clientX - rect.left) / rect.width, 0), 1);
		handlers.onSeek(ratio * duration);
	};

	const cycleSpeed = () => {
		const idx = REVIEW_PLAYBACK_SPEEDS.indexOf(
			audio.speed as (typeof REVIEW_PLAYBACK_SPEEDS)[number],
		);
		const next =
			REVIEW_PLAYBACK_SPEEDS[(idx === -1 ? 0 : idx + 1) % REVIEW_PLAYBACK_SPEEDS.length];
		handlers.onSpeedChange?.(next);
	};

	const toggleMute = () => handlers.onMutedChange?.(!audio.muted);

	return (
		<div
			data-slot="transcript-player-bar"
			className={cn("flex flex-col gap-2 rounded-xl bg-muted/40 p-4", className)}
			{...props}
		>
			<div className="flex items-center justify-between gap-3">
				<div className="flex min-w-0 items-center gap-2">
					<span className="flex items-center gap-1.5 text-sm font-semibold">
						<GaugeIcon className="size-4 text-primary" />
						{playbackLabel}
					</span>
					<Badge variant="secondary" className="text-[10px] tracking-wider uppercase">
						{syncLabel}
					</Badge>
					{modelLabel ? (
						<span className="hidden items-center gap-1.5 font-mono text-[11px] text-muted-foreground sm:flex">
							<span className="size-1.5 rounded-full bg-success" />
							{modelLabel}
							<span className="text-muted-foreground/50">•</span>
							{SOURCE_LABELS[audioSource]}
						</span>
					) : null}
				</div>
				<Button
					type="button"
					variant="outline"
					size="sm"
					onClick={cycleSpeed}
					disabled={!handlers.onSpeedChange}
					title={speedLabel}
					aria-label={speedLabel}
					className="font-mono text-xs tabular-nums"
				>
					{audio.speed}×
				</Button>
			</div>

			<div className="flex flex-col items-center gap-3 sm:flex-row">
				<div className="flex shrink-0 items-center gap-1">
					<Button
						type="button"
						variant="secondary"
						size="icon"
						className="size-8"
						onClick={() => handlers.onSkip?.(-10)}
						disabled={!handlers.onSkip}
						title="Back 10 seconds [←]"
						aria-label="Back 10 seconds"
					>
						<RotateCcwIcon className="size-4" />
					</Button>
					<Button
						type="button"
						size="icon"
						className="size-10"
						onClick={handlers.onPlayPause}
						disabled={!handlers.onPlayPause}
						aria-label={audio.playing ? "Pause" : "Play"}
					>
						{audio.playing ? <PauseIcon /> : <PlayIcon />}
					</Button>
					<Button
						type="button"
						variant="secondary"
						size="icon"
						className="size-8"
						onClick={() => handlers.onSkip?.(10)}
						disabled={!handlers.onSkip}
						title="Forward 10 seconds [→]"
						aria-label="Forward 10 seconds"
					>
						<RotateCwIcon className="size-4" />
					</Button>
				</div>

				<div className="flex min-w-0 flex-1 items-center gap-3">
					<span className="w-9 shrink-0 text-right font-mono text-xs font-semibold text-primary tabular-nums">
						{formatReviewTime(position)}
					</span>
					<div
						ref={trackRef}
						role="slider"
						aria-label="Seek"
						aria-valuemin={0}
						aria-valuemax={Math.round(duration)}
						aria-valuenow={Math.round(position)}
						aria-valuetext={formatReviewTime(position)}
						tabIndex={handlers.onSeek ? 0 : -1}
						onClick={(e) => seekFromEvent(e.clientX)}
						onKeyDown={(e) => {
							if (!handlers.onSeek) return;
							if (e.key === "ArrowLeft") handlers.onSeek(Math.max(0, position - 5));
							if (e.key === "ArrowRight")
								handlers.onSeek(Math.min(duration, position + 5));
						}}
						className="group relative flex-1 cursor-pointer py-2 outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
					>
						<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
							<div
								className="h-full rounded-full bg-primary transition-[width] duration-150"
								style={{ width: `${progress * 100}%` }}
							/>
						</div>
						<div
							className="pointer-events-none absolute top-1/2 size-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary opacity-0 shadow transition-opacity group-hover:opacity-100"
							style={{ left: `${progress * 100}%` }}
						/>
					</div>
					<span className="w-9 shrink-0 font-mono text-xs text-muted-foreground tabular-nums">
						{formatReviewTime(duration)}
					</span>
				</div>

				<div className="hidden shrink-0 items-center gap-1.5 md:flex">
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						onClick={toggleMute}
						disabled={!handlers.onMutedChange}
						aria-label={volumeLabel}
					>
						{audio.muted || audio.volume === 0 ? (
							<VolumeXIcon className="size-4" />
						) : (
							<Volume2Icon className="size-4" />
						)}
					</Button>
					<input
						type="range"
						min={0}
						max={100}
						value={Math.round(audio.volume * 100)}
						onChange={(e) => handlers.onVolumeChange?.(Number(e.target.value) / 100)}
						disabled={!handlers.onVolumeChange}
						aria-label={volumeLabel}
						className="w-16 accent-primary"
					/>
				</div>
			</div>
		</div>
	);
}

/* ------------------------------ confidence banner --------------------------- */

const CONFIDENCE_TONES = {
	success: {
		wrap: "bg-success/10",
		icon: "bg-success/15 text-success",
		title: "text-success",
		badge: "bg-success/20 text-success",
	},
	warning: {
		wrap: "bg-warning/10",
		icon: "bg-warning/15 text-warning",
		title: "text-warning",
		badge: "bg-warning/20 text-warning",
	},
	destructive: {
		wrap: "bg-destructive/10",
		icon: "bg-destructive/15 text-destructive",
		title: "text-destructive",
		badge: "bg-destructive/20 text-destructive",
	},
} as const;

function confidenceTone(confidence: number, tone?: ReviewConfidence["tone"]) {
	if (tone) return tone;
	if (confidence >= 90) return "success";
	if (confidence >= 70) return "warning";
	return "destructive";
}

export interface ConfidenceBannerProps
	extends Omit<React.ComponentProps<"div">, "title">,
		ReviewConfidence {}

/** AI confidence strip: verified icon, confidence %, model-approval badge,
 * anomalies count and a one-line rationale. */
export function ConfidenceBanner({
	confidence,
	anomalies = 0,
	tone,
	title,
	description,
	meta,
	className,
	...props
}: ConfidenceBannerProps) {
	const resolved = confidenceTone(confidence, tone);
	const styles = CONFIDENCE_TONES[resolved];
	const pct = Math.round(confidence);
	return (
		<div
			data-slot="confidence-banner"
			data-tone={resolved}
			className={cn("flex items-center justify-between gap-3 rounded-xl p-4", styles.wrap, className)}
			{...props}
		>
			<div className="flex min-w-0 items-center gap-3">
				<div
					className={cn(
						"flex size-9 shrink-0 items-center justify-center rounded-lg",
						styles.icon,
					)}
				>
					<ShieldCheckIcon className="size-5" />
				</div>
				<div className="flex min-w-0 flex-col">
					<div className="flex flex-wrap items-center gap-1.5">
						<span className={cn("text-sm font-semibold", styles.title)}>
							{title ??
								(resolved === "success"
									? `High-confidence transcript (${pct}%)`
									: `Transcript needs review (${pct}%)`)}
						</span>
						<Badge className={cn("text-[10px] font-bold tracking-wider uppercase", styles.badge)}>
							{resolved === "success"
								? "Model approved"
								: anomalies > 0
									? `${anomalies} anomaly${anomalies === 1 ? "" : "s"}`
									: "Review recommended"}
						</Badge>
					</div>
					{description ? (
						<p className="truncate text-sm text-muted-foreground">{description}</p>
					) : null}
				</div>
			</div>
			{meta ? (
				<span className="hidden shrink-0 items-center gap-1 rounded-lg bg-background/60 px-3 py-1 font-mono text-[11px] text-muted-foreground lg:flex">
					<CheckIcon className={cn("size-3.5", resolved === "success" ? "text-success" : "text-warning")} />
					{meta}
				</span>
			) : anomalies > 0 ? (
				<span className="hidden shrink-0 items-center gap-1 rounded-lg bg-background/60 px-3 py-1 font-mono text-[11px] text-muted-foreground lg:flex">
					<TriangleAlertIcon className="size-3.5 text-warning" />
					{anomalies} anomaly{anomalies === 1 ? "" : "s"} detected
				</span>
			) : (
				<span className="hidden shrink-0 items-center gap-1 rounded-lg bg-background/60 px-3 py-1 font-mono text-[11px] text-muted-foreground lg:flex">
					<CheckIcon className="size-3.5 text-success" />
					0 anomalies detected
				</span>
			)}
		</div>
	);
}

/* ---------------------------------- feed ------------------------------------ */

export interface TranscriptSegmentProps extends React.ComponentProps<"div"> {
	segment: ReviewTranscriptSegment;
	/** Active under the playhead. */
	active?: boolean;
	/** Click-to-seek handler (receives segment start seconds). */
	onSeek?: () => void;
}

/** One timestamped segment card inside a speaker turn: mm:ss stamp,
 * optional topic tag and the transcribed text. Flagged segments get
 * warning styling. */
export function TranscriptSegment({
	segment,
	active = false,
	onSeek,
	className,
	...props
}: TranscriptSegmentProps) {
	const time = segment.time ?? (segment.startSec != null ? formatReviewTime(segment.startSec) : null);
	return (
		<div
			data-slot="transcript-segment"
			data-active={active || undefined}
			data-flagged={segment.flagged || undefined}
			className={cn(
				"flex flex-col gap-1 rounded-xl bg-muted/50 p-3 text-sm leading-relaxed transition-colors",
				segment.flagged
					? "border border-warning/30 bg-warning/10"
					: "hover:bg-muted",
				active && "bg-primary/10 ring-1 ring-primary/30",
				className,
			)}
			{...props}
		>
			<div className="flex items-center justify-between gap-2 text-muted-foreground">
				{time != null ? (
					<button
						type="button"
						onClick={onSeek}
						disabled={!onSeek}
						className={cn(
							"font-mono text-[11px] tabular-nums",
							onSeek && "text-primary hover:underline",
						)}
					>
						{time}
					</button>
				) : (
					<span />
				)}
				{segment.label ? (
					<Badge
						variant="secondary"
						className={cn(
							"text-[10px]",
							segment.flagged ? "bg-warning/20 text-warning" : "text-muted-foreground",
						)}
					>
						{segment.flagged ? <TriangleAlertIcon data-icon="inline-start" /> : null}
						{segment.label}
					</Badge>
				) : null}
			</div>
			{onSeek ? (
				<button type="button" onClick={onSeek} className="text-left">
					{segment.text}
				</button>
			) : (
				<p>{segment.text}</p>
			)}
		</div>
	);
}

export interface TranscriptTurnProps extends React.ComponentProps<"div"> {
	turn: ReviewTurn;
	/** Turn index — used for the avatar fallback number. */
	index?: number;
	/** Current playhead (seconds) — highlights the active segment. */
	currentTimeSec?: number;
	onSeekSegment?: (segmentIndex: number, startSec?: number) => void;
}

/** One diarized speaker turn: avatar + name/role/time header plus its
 * timestamped segments (or a single text block). */
export function TranscriptTurn({
	turn,
	index = 0,
	currentTimeSec,
	onSeekSegment,
	className,
	...props
}: TranscriptTurnProps) {
	const tone = turn.role ?? "other";
	const hasSegments = turn.segments != null && turn.segments.length > 0;
	return (
		<div
			data-slot="transcript-turn"
			className={cn("group flex items-start gap-3", className)}
			{...props}
		>
			<Avatar className={cn("size-9 rounded-xl border", SEGMENT_TONE[tone])}>
				<AvatarFallback
					className={cn("rounded-xl text-sm font-bold", SEGMENT_TONE[tone])}
				>
					{initialsOf(turn.name) || index + 1}
				</AvatarFallback>
			</Avatar>
			<div className="flex min-w-0 flex-1 flex-col gap-1.5">
				<div className="flex flex-wrap items-center gap-2">
					<span className={cn("text-sm font-semibold", SEGMENT_NAME_TONE[tone])}>
						{turn.name}
					</span>
					{turn.roleLabel ? (
						<Badge variant="secondary" className="text-[10px] font-normal">
							{turn.roleLabel}
						</Badge>
					) : null}
					{turn.time ? (
						<span className="font-mono text-[11px] text-muted-foreground tabular-nums">
							{turn.time}
						</span>
					) : null}
				</div>
				{hasSegments ? (
					<div className="flex flex-col gap-2">
						{turn.segments!.map((segment, i) => {
							const active =
								currentTimeSec != null &&
								segment.startSec != null &&
								currentTimeSec >= segment.startSec &&
								(segment.endSec == null || currentTimeSec < segment.endSec);
							return (
								<TranscriptSegment
									key={i}
									segment={segment}
									active={active}
									onSeek={
										onSeekSegment && segment.startSec != null
											? () => onSeekSegment(i, segment.startSec)
											: undefined
									}
								/>
							);
						})}
					</div>
				) : (
					<div className="rounded-xl bg-muted/50 p-3 text-sm leading-relaxed">
						{turn.text}
					</div>
				)}
			</div>
		</div>
	);
}

export interface TranscriptFeedProps extends React.ComponentProps<"div"> {
	turns: ReviewTurn[];
	/** Playhead position — highlights the segment under it. */
	currentTimeSec?: number;
	/** Click-to-seek on a segment: (turnIndex, segmentIndex, startSec). */
	onSeekSegment?: (turnIndex: number, segmentIndex: number, startSec?: number) => void;
	/** Max height of the scrollable feed. */
	maxHeight?: number | string;
}

/** Scrollable dialogue feed of diarized speaker turns. */
export function TranscriptFeed({
	turns,
	currentTimeSec,
	onSeekSegment,
	maxHeight = 480,
	className,
	...props
}: TranscriptFeedProps) {
	return (
		<ScrollArea
			data-slot="transcript-feed"
			className={cn("min-h-0 flex-1", className)}
			style={{ maxHeight }}
			{...props}
		>
			<div className="flex flex-col gap-4 p-4">
				{turns.map((turn, i) => (
					<TranscriptTurn
						key={turn.id ?? i}
						turn={turn}
						index={i}
						currentTimeSec={currentTimeSec}
						onSeekSegment={(segIdx, startSec) => onSeekSegment?.(i, segIdx, startSec)}
					/>
				))}
			</div>
		</ScrollArea>
	);
}

/* --------------------------------- footer ----------------------------------- */

export interface ReviewFooterProps extends React.ComponentProps<"div"> {
	shortcuts?: ReviewShortcut[];
	/** Primary CTA label — defaults to "Confirm transcript and continue to Anamnesis". */
	confirmLabel?: React.ReactNode;
	/** Label while the confirm action is in flight. */
	confirmingLabel?: React.ReactNode;
	confirming?: boolean;
	onConfirm?: () => void;
	confirmDisabled?: boolean;
}

const DEFAULT_SHORTCUTS: ReviewShortcut[] = [
	{ keys: ["Space"], label: "Play/Pause" },
	{ keys: ["←"], label: "-10s" },
	{ keys: ["→"], label: "+10s" },
	{ keys: ["C"], label: "Confirm" },
];

/** Footer strip: keyboard-shortcut legend on the left, primary confirm
 * CTA on the right. */
export function ReviewFooter({
	shortcuts = DEFAULT_SHORTCUTS,
	confirmLabel = "Confirm transcript and continue to Anamnesis",
	confirmingLabel = "Confirming…",
	confirming = false,
	onConfirm,
	confirmDisabled = false,
	className,
	...props
}: ReviewFooterProps) {
	return (
		<div
			data-slot="review-footer"
			className={cn(
				"flex flex-col items-center justify-between gap-3 sm:flex-row",
				className,
			)}
			{...props}
		>
			<div className="flex flex-wrap items-center gap-3 font-mono text-[11px] text-muted-foreground">
				<span className="text-muted-foreground/60">Shortcuts:</span>
				{shortcuts.map((s, i) => (
					<React.Fragment key={i}>
						{i > 0 ? <span className="text-muted-foreground/40">•</span> : null}
						<span className="flex items-center gap-1.5">
							<KbdGroup>
								{s.keys.map((k) => (
									<Kbd key={k}>{k}</Kbd>
								))}
							</KbdGroup>
							<span className="text-muted-foreground/60">{s.label}</span>
						</span>
					</React.Fragment>
				))}
			</div>
			<Button
				type="button"
				size="lg"
				onClick={onConfirm}
				disabled={confirmDisabled || confirming || !onConfirm}
				className="w-full gap-2 sm:w-auto"
			>
				<CheckCircle2Icon />
				{confirming ? confirmingLabel : confirmLabel}
			</Button>
		</div>
	);
}

/* ------------------------------- composite ---------------------------------- */

export interface TranscriptReviewLabels {
	postpone?: React.ReactNode;
	queue?: React.ReactNode;
	queueCount?: React.ReactNode;
	playback?: React.ReactNode;
	syncBadge?: React.ReactNode;
	speed?: string;
	volume?: string;
	transcriptTab?: React.ReactNode;
	anamnesisTab?: React.ReactNode;
}

export interface TranscriptReviewProps
	extends Omit<React.ComponentProps<"div">, "title"> {
	title?: React.ReactNode;
	live?: boolean;
	patient: ReviewPatient;
	onPostpone?: () => void;
	onQueue?: () => void;
	/** Pending items badge on the queue button. */
	queueCount?: React.ReactNode;
	step?: ReviewStep;
	onStepChange?: (step: ReviewStep) => void;
	completedSteps?: Partial<Record<ReviewStep, boolean>>;
	audioSource?: ReviewAudioSource;
	/** Transcription engine tag shown next to the player, e.g. "Whisper-Large-v3 Turbo". */
	modelLabel?: React.ReactNode;
	/** Sample-rate tag, e.g. "48kHz". */
	sampleRate?: React.ReactNode;
	/** Controlled playback state. When omitted, the composite runs a
	 * built-in simulated playback driven by `durationSec` so the screen
	 * is fully interactive in Storybook without a real audio element. */
	audio?: ReviewAudioState;
	handlers?: ReviewAudioHandlers;
	/** Fallback duration (seconds) for the simulated player. */
	durationSec?: number;
	confidence?: ReviewConfidence;
	turns: ReviewTurn[];
	/** Segment click-to-seek: (turnIndex, segmentIndex, startSec). */
	onSeekSegment?: (turnIndex: number, segmentIndex: number, startSec?: number) => void;
	shortcuts?: ReviewShortcut[];
	confirmLabel?: React.ReactNode;
	confirmingLabel?: React.ReactNode;
	confirming?: boolean;
	onConfirm?: () => void;
	confirmDisabled?: boolean;
	labels?: TranscriptReviewLabels;
}

/**
 * Transcript Review Cockpit — the post-consultation audio review screen
 * (player bar + AI confidence banner + diarized transcript feed +
 * confirm CTA) composed from design-system primitives.
 *
 * Playback is controlled: pass `audio` + `handlers` to drive a real
 * `<audio>` element, or omit `audio` and the composite simulates
 * playback internally (position advances on a timer, clamped to
 * `durationSec`) so every control stays interactive in demos.
 */
export function TranscriptReview({
	title = "Review Mode",
	live = true,
	patient,
	onPostpone,
	onQueue,
	queueCount,
	step,
	onStepChange,
	completedSteps,
	audioSource = "mic",
	modelLabel = "Whisper-Large-v3 Turbo",
	sampleRate = "48kHz",
	audio: audioProp,
	handlers: handlersProp,
	durationSec = 47,
	confidence,
	turns,
	onSeekSegment,
	shortcuts,
	confirmLabel,
	confirmingLabel,
	confirming,
	onConfirm,
	confirmDisabled,
	labels,
	className,
	...props
}: TranscriptReviewProps) {
	const [innerStep, setInnerStep] = React.useState<ReviewStep>("transcript");
	const activeStep = step ?? innerStep;
	const setStep = (s: ReviewStep) => {
		setInnerStep(s);
		onStepChange?.(s);
	};

	// ---- simulated playback (demo mode when `audio` is not provided) ----
	const [sim, setSim] = React.useState({ playing: false, positionSec: 0, speed: 1, volume: 0.75, muted: false });
	React.useEffect(() => {
		if (audioProp || !sim.playing) return;
		const id = setInterval(() => {
			setSim((s) => {
				const next = s.positionSec + 0.25 * s.speed;
				return next >= durationSec
					? { ...s, positionSec: durationSec, playing: false }
					: { ...s, positionSec: next };
			});
		}, 250);
		return () => clearInterval(id);
	}, [audioProp, sim.playing, sim.speed, durationSec]);

	const audio: ReviewAudioState = audioProp ?? {
		playing: sim.playing,
		positionSec: sim.positionSec,
		durationSec,
		speed: sim.speed,
		volume: sim.volume,
		muted: sim.muted,
	};
	const simHandlers: ReviewAudioHandlers = React.useMemo(
		() => ({
			onPlayPause: () =>
				setSim((s) => ({
					...s,
					playing: s.positionSec >= durationSec ? true : !s.playing,
					positionSec: s.positionSec >= durationSec ? 0 : s.positionSec,
				})),
			onSeek: (sec) => setSim((s) => ({ ...s, positionSec: Math.min(Math.max(sec, 0), durationSec) })),
			onSkip: (delta) =>
				setSim((s) => ({
					...s,
					positionSec: Math.min(Math.max(s.positionSec + delta, 0), durationSec),
				})),
			onSpeedChange: (rate) => setSim((s) => ({ ...s, speed: rate })),
			onVolumeChange: (volume) => setSim((s) => ({ ...s, volume, muted: volume === 0 ? s.muted : false })),
			onMutedChange: (muted) => setSim((s) => ({ ...s, muted })),
		}),
		[durationSec],
	);
	const handlers = audioProp ? (handlersProp ?? {}) : simHandlers;

	return (
		<div
			data-slot="transcript-review"
			className={cn("flex w-full max-w-5xl flex-col gap-6", className)}
			{...props}
		>
			<ReviewHeader
				title={title}
				live={live}
				patient={patient}
				actions={
					<>
						<Button
							type="button"
							variant="secondary"
							size="sm"
							onClick={onPostpone}
							disabled={!onPostpone}
						>
							<ClockIcon data-icon="inline-start" />
							{labels?.postpone ?? "Postpone review"}
						</Button>
						<Button
							type="button"
							variant="secondary"
							size="sm"
							onClick={onQueue}
							disabled={!onQueue}
						>
							<ArrowLeftIcon data-icon="inline-start" />
							{labels?.queue ?? "Review queue"}
							{queueCount != null ? (
								<span className="ml-1 flex size-5 items-center justify-center rounded-full bg-primary/15 font-mono text-[11px] font-semibold text-primary">
									{queueCount}
								</span>
							) : null}
						</Button>
					</>
				}
			/>

			<div className="flex flex-wrap items-center justify-between gap-3">
				<ReviewStepTabs
					value={activeStep}
					onValueChange={setStep}
					transcriptLabel={labels?.transcriptTab ?? "Transcript"}
					anamnesisLabel={labels?.anamnesisTab ?? "Anamnesis"}
					completed={completedSteps}
				/>
				{modelLabel ? (
					<span className="hidden items-center gap-2 font-mono text-[11px] text-muted-foreground sm:flex">
						<span className="flex items-center gap-1.5 text-success">
							<span className="size-1.5 rounded-full bg-success" />
							{modelLabel}
						</span>
						<span className="text-muted-foreground/40">•</span>
						<span>{SOURCE_LABELS[audioSource]}</span>
						<span className="text-muted-foreground/40">•</span>
						<span>{sampleRate}</span>
					</span>
				) : null}
			</div>

			<Card size="sm" className="gap-0 overflow-hidden p-0">
				<div className="border-b p-4">
					<TranscriptPlayerBar
						audio={audio}
						handlers={handlers}
						audioSource={audioSource}
						modelLabel={null}
						syncLabel={labels?.syncBadge ?? "Audio Master Sync"}
						playbackLabel={labels?.playback ?? "Clinical Playback"}
						speedLabel={labels?.speed ?? "Playback speed"}
						volumeLabel={labels?.volume ?? "Volume"}
					/>
				</div>
				{activeStep === "transcript" ? (
					<>
						{confidence ? (
							<div className="px-4 pt-4">
								<ConfidenceBanner {...confidence} />
							</div>
						) : null}
						<TranscriptFeed
							turns={turns}
							currentTimeSec={audio.positionSec}
							onSeekSegment={onSeekSegment}
							maxHeight={480}
						/>
						<div className="border-t p-4">
							<ReviewFooter
								shortcuts={shortcuts}
								confirmLabel={confirmLabel}
								confirmingLabel={confirmingLabel}
								confirming={confirming}
								onConfirm={onConfirm}
								confirmDisabled={confirmDisabled}
							/>
						</div>
					</>
				) : (
					<div className="flex min-h-40 items-center justify-center p-8 text-sm text-muted-foreground">
						Anamnesis review step — compose with the anamnesis panel blocks.
					</div>
				)}
			</Card>
		</div>
	);
}

