import * as React from "react";
import { cn } from "cn";
import {
	ArrowLeftIcon,
	FileSignatureIcon,
	HospitalIcon,
	InfoIcon,
	MicIcon,
	MonitorIcon,
	PauseIcon,
	PencilIcon,
	PlayIcon,
	RefreshCwIcon,
	ShieldCheckIcon,
	StethoscopeIcon,
	VideoIcon,
	Volume2Icon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@ktbhealth/ui/components/avatar";
import { Badge } from "@ktbhealth/ui/components/badge";
import { Button } from "@ktbhealth/ui/components/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@ktbhealth/ui/components/card";
import { Progress } from "@ktbhealth/ui/components/progress";
import { ScrollArea } from "@ktbhealth/ui/components/scroll-area";

/* ---------------------------------- types ---------------------------------- */

/** Consultation modality — telemedicine consults capture the meeting
 * tab's audio only (external tool like Google Meet), not the mic. */
export type AnamnesisModality = "in-person" | "telemedicine";

/** Which audio source the consultation recording came from. */
export type AnamnesisAudioSource = "mic" | "tab";

/** AI extraction confidence reported per structured-record section. */
export type AnamnesisConfidence = "high" | "medium" | "low" | "unconfirmed";

export interface AnamnesisReviewPatient {
	name: React.ReactNode;
	/** Free-form age/gender descriptor, e.g. "42 years (M)". */
	demographics?: React.ReactNode;
	/** Consultation number/id shown as telemetry, e.g. "#17". */
	consultationId?: React.ReactNode;
	date?: React.ReactNode;
}

export interface AnamnesisReviewPhysician {
	name: React.ReactNode;
	/** Credential line, e.g. "CRM/SP 184.920". */
	credential?: React.ReactNode;
}

export interface AnamnesisHypothesis {
	label: React.ReactNode;
	/** Diagnosis code shown on the right, e.g. "CID M54.4". */
	cid?: React.ReactNode;
}

export interface AnamnesisTranscriptTurn {
	id?: React.Key;
	/** Speaker display name, e.g. "Dr. Emmanuel". */
	speaker: React.ReactNode;
	/** Role used for styling — "doctor" and "patient" get distinct tones. */
	role?: "doctor" | "patient" | (string & {});
	/** Optional timestamp label, e.g. "00:18". */
	time?: React.ReactNode;
	text: React.ReactNode;
	/** Marks segments the transcription engine flagged as uncertain. */
	uncertain?: boolean;
	onSeek?: () => void;
}

/* ------------------------------ small helpers ------------------------------ */

const CONFIDENCE_BADGE: Record<AnamnesisConfidence, string> = {
	high: "border-transparent bg-success/10 text-success dark:bg-success/20",
	medium: "border-transparent bg-warning/10 text-warning dark:bg-warning/20",
	low: "border-transparent bg-destructive/10 text-destructive dark:bg-destructive/20",
	unconfirmed: "border-border bg-muted text-muted-foreground",
};

const CONFIDENCE_LABELS: Record<AnamnesisConfidence, string> = {
	high: "High confidence",
	medium: "Medium confidence",
	low: "Low confidence",
	unconfirmed: "Unconfirmed",
};

/** "m:ss" clock label for audio positions in seconds. */
export function formatAnamnesisClock(seconds: number): string {
	const total = Math.max(0, Math.round(seconds));
	return `${Math.floor(total / 60)}:${(total % 60).toString().padStart(2, "0")}`;
}

function initialsOf(name: React.ReactNode): string {
	if (typeof name !== "string") return "?";
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0]!.toUpperCase())
		.join("");
}

/* --------------------------------- header ---------------------------------- */

export interface AnamnesisReviewHeaderProps extends React.ComponentProps<"div"> {
	patient: AnamnesisReviewPatient;
	physician?: AnamnesisReviewPhysician;
	modality?: AnamnesisModality;
	/** Back action — renders a ghost button when provided. */
	onBack?: () => void;
	backLabel?: React.ReactNode;
	modalityLabels?: Partial<Record<AnamnesisModality, React.ReactNode>>;
}

function AnamnesisReviewHeader({
	patient,
	physician,
	modality = "in-person",
	onBack,
	backLabel = "Back to queue",
	modalityLabels,
	className,
	...props
}: AnamnesisReviewHeaderProps) {
	const modalityLabel =
		modalityLabels?.[modality] ?? (modality === "telemedicine" ? "Telemedicine" : "In-person");
	return (
		<div
			data-slot="anamnesis-review-header"
			className={cn(
				"flex flex-wrap items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3",
				className,
			)}
			{...props}
		>
			<div className="flex min-w-0 items-center gap-3">
				<span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-primary">
					<HospitalIcon className="size-5" />
				</span>
				<div className="flex min-w-0 flex-col">
					<span className="truncate text-sm font-semibold text-foreground">
						{patient.name}
					</span>
					<span className="flex flex-wrap items-center gap-x-2 text-xs text-muted-foreground">
						{patient.demographics ? <span>{patient.demographics}</span> : null}
						{patient.consultationId ? (
							<span className="font-mono text-primary">{patient.consultationId}</span>
						) : null}
						{patient.date ? <span>{patient.date}</span> : null}
					</span>
				</div>
			</div>
			<div className="flex items-center gap-3">
				<Badge variant="outline" className="gap-1">
					{modality === "telemedicine" ? (
						<VideoIcon data-icon="inline-start" />
					) : (
						<StethoscopeIcon data-icon="inline-start" />
					)}
					{modalityLabel}
				</Badge>
				{physician ? (
					<div className="flex items-center gap-2">
						<div className="hidden flex-col text-right sm:flex">
							<span className="text-xs font-medium leading-tight text-foreground">
								{physician.name}
							</span>
							{physician.credential ? (
								<span className="font-mono text-[11px] leading-tight text-muted-foreground">
									{physician.credential}
								</span>
							) : null}
						</div>
						<Avatar size="sm" className="bg-primary text-primary-foreground">
							<AvatarFallback className="bg-primary text-primary-foreground">
								{initialsOf(physician.name)}
							</AvatarFallback>
						</Avatar>
					</div>
				) : null}
				{onBack ? (
					<Button variant="ghost" size="sm" onClick={onBack}>
						<ArrowLeftIcon data-icon="inline-start" />
						{backLabel}
					</Button>
				) : null}
			</div>
		</div>
	);
}

/* ------------------------------- record sections ---------------------------- */

export interface AnamnesisSectionProps extends Omit<React.ComponentProps<"section">, "title"> {
	title: React.ReactNode;
	/** Accent color for the leading dot — any Tailwind bg-* token class. */
	dotClassName?: string;
	/** AI extraction confidence — renders a colored badge. */
	confidence?: AnamnesisConfidence;
	confidenceLabel?: React.ReactNode;
	/** Marks a section the physician edited manually. */
	edited?: boolean;
	editedLabel?: React.ReactNode;
	onEdit?: () => void;
	editLabel?: string;
}

function AnamnesisSection({
	title,
	dotClassName = "bg-primary",
	confidence,
	confidenceLabel,
	edited = false,
	editedLabel = "edited",
	onEdit,
	editLabel = "Edit section",
	className,
	children,
	...props
}: AnamnesisSectionProps) {
	return (
		<section data-slot="anamnesis-section" className={cn("flex flex-col gap-2", className)} {...props}>
			<div className="flex items-center justify-between gap-2">
				<h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
					<span aria-hidden className={cn("size-1.5 rounded-full", dotClassName)} />
					{title}
					{edited ? (
						<span className="text-[11px] font-normal text-muted-foreground">
							({editedLabel})
						</span>
					) : null}
				</h3>
				<span className="flex items-center gap-1.5">
					{confidence ? (
						<Badge variant="secondary" className={cn("text-[10px]", CONFIDENCE_BADGE[confidence])}>
							{confidenceLabel ?? CONFIDENCE_LABELS[confidence]}
						</Badge>
					) : null}
					{onEdit ? (
						<Button
							variant="ghost"
							size="icon-xs"
							aria-label={editLabel}
							onClick={onEdit}
							className="text-muted-foreground"
						>
							<PencilIcon />
						</Button>
					) : null}
				</span>
			</div>
			{children}
		</section>
	);
}

/** Inset content well used inside `AnamnesisSection` bodies. */
function AnamnesisSectionBody({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="anamnesis-section-body"
			className={cn(
				"rounded-lg bg-muted/60 p-4 text-sm leading-relaxed text-foreground",
				className,
			)}
			{...props}
		/>
	);
}

/** Inline "listen to this audio segment" link rendered under section text. */
export interface AnamnesisAudioSegmentProps extends React.ComponentProps<"button"> {
	/** Range label, e.g. "00:18 - 00:42". */
	range?: React.ReactNode;
	label?: React.ReactNode;
}

function AnamnesisAudioSegment({
	range,
	label = "Listen to matching segment",
	className,
	...props
}: AnamnesisAudioSegmentProps) {
	return (
		<button
			type="button"
			data-slot="anamnesis-audio-segment"
			className={cn(
				"inline-flex items-center gap-1 font-mono text-xs text-primary hover:underline",
				className,
			)}
			{...props}
		>
			<PlayIcon className="size-3.5" />
			{label}
			{range ? <span className="text-muted-foreground">({range})</span> : null}
		</button>
	);
}

/* ---------------------------------- lists ---------------------------------- */

export interface HypothesisListProps extends React.ComponentProps<"div"> {
	items: readonly AnamnesisHypothesis[];
}

function HypothesisList({ items, className, ...props }: HypothesisListProps) {
	return (
		<div
			data-slot="hypothesis-list"
			className={cn("flex flex-col gap-1.5", className)}
			{...props}
		>
			{items.map((item, index) => (
				<div
					key={index}
					className="flex items-center justify-between gap-3 text-sm font-medium text-foreground"
				>
					<span className="min-w-0">
						{index + 1}. {item.label}
					</span>
					{item.cid ? (
						<span className="shrink-0 font-mono text-xs text-primary">{item.cid}</span>
					) : null}
				</div>
			))}
		</div>
	);
}

export interface ConductListProps extends React.ComponentProps<"ul"> {
	items: readonly React.ReactNode[];
}

function ConductList({ items, className, ...props }: ConductListProps) {
	return (
		<ul
			data-slot="conduct-list"
			className={cn("list-disc space-y-1 pl-5 text-sm text-muted-foreground", className)}
			{...props}
		>
			{items.map((item, index) => (
				<li key={index}>{item}</li>
			))}
		</ul>
	);
}

/* ------------------------------- pending strip ------------------------------ */

export interface PendingDataStripProps extends Omit<React.ComponentProps<"div">, "title"> {
	title?: React.ReactNode;
	items: readonly React.ReactNode[];
	emptyLabel?: React.ReactNode;
}

function PendingDataStrip({
	title = "Data not informed / pending",
	items,
	emptyLabel = "Nothing pending",
	className,
	...props
}: PendingDataStripProps) {
	return (
		<div
			data-slot="pending-data-strip"
			className={cn(
				"flex flex-col gap-2 rounded-lg border border-border/60 bg-muted/40 p-4",
				className,
			)}
			{...props}
		>
			<span className="text-xs font-semibold text-muted-foreground">{title}</span>
			{items.length === 0 ? (
				<span className="text-xs text-muted-foreground">{emptyLabel}</span>
			) : (
				<div className="grid grid-cols-1 gap-2 text-xs text-muted-foreground sm:grid-cols-3">
					{items.map((item, index) => (
						<div key={index} className="flex items-center gap-1.5">
							<InfoIcon className="size-3.5 shrink-0" />
							<span className="min-w-0">{item}</span>
						</div>
					))}
				</div>
			)}
		</div>
	);
}

/* ------------------------------- audio mini-player -------------------------- */

export interface ConsultationAudioCardProps extends Omit<React.ComponentProps<"div">, "title"> {
	title?: React.ReactNode;
	/** Current playback position in seconds. */
	position?: number;
	/** Total duration in seconds. */
	duration?: number;
	playing?: boolean;
	onTogglePlay?: () => void;
	/** Audio capture source — telemedicine records the meeting tab. */
	audioSource?: AnamnesisAudioSource;
	/** Telemetry line under the player, e.g. "Captures meeting tab audio only". */
	telemetry?: React.ReactNode;
	playLabel?: string;
	pauseLabel?: string;
}

function ConsultationAudioCard({
	title = "Consultation audio",
	position = 0,
	duration = 0,
	playing = false,
	onTogglePlay,
	audioSource,
	telemetry,
	playLabel = "Play",
	pauseLabel = "Pause",
	className,
	...props
}: ConsultationAudioCardProps) {
	const percent = duration > 0 ? Math.min(100, (position / duration) * 100) : 0;
	return (
		<Card
			data-slot="consultation-audio-card"
			size="sm"
			className={cn("gap-3", className)}
			{...props}
		>
			<CardHeader className="flex-row items-center justify-between gap-2">
				<CardTitle className="flex items-center gap-1.5 text-sm">
					<MicIcon className="size-4 text-primary" />
					{title}
				</CardTitle>
				<span className="font-mono text-xs text-muted-foreground tabular-nums">
					{formatAnamnesisClock(position)} / {formatAnamnesisClock(duration)}
				</span>
			</CardHeader>
			<CardContent className="flex flex-col gap-3">
				<div className="flex items-center gap-3 rounded-lg bg-muted/60 p-3">
					<Button
						type="button"
						size="icon"
						aria-label={playing ? pauseLabel : playLabel}
						onClick={onTogglePlay}
						disabled={!onTogglePlay}
						className="rounded-lg"
					>
						{playing ? <PauseIcon className="fill-current" /> : <PlayIcon className="fill-current" />}
					</Button>
					<Progress value={percent} className="min-w-0 flex-1">
						<span className="sr-only">
							{formatAnamnesisClock(position)} / {formatAnamnesisClock(duration)}
						</span>
					</Progress>
					<Volume2Icon className="size-4 shrink-0 text-muted-foreground" />
				</div>
				{audioSource || telemetry ? (
					<div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
						{audioSource ? (
							<Badge variant="outline" className="gap-1 text-[10px] font-normal">
								{audioSource === "tab" ? (
									<MonitorIcon data-icon="inline-start" />
								) : (
									<MicIcon data-icon="inline-start" />
								)}
								{audioSource === "tab" ? "Meeting tab audio" : "Microphone"}
							</Badge>
						) : null}
						{telemetry ? <span>{telemetry}</span> : null}
					</div>
				) : null}
			</CardContent>
		</Card>
	);
}

/* ------------------------------- support transcript ------------------------- */

const TURN_TONES: Record<string, string> = {
	doctor: "bg-muted/50",
	patient: "border-l-2 border-primary bg-muted",
};

export interface SupportTranscriptProps extends Omit<React.ComponentProps<"div">, "title"> {
	title?: React.ReactNode;
	participantsLabel?: React.ReactNode;
	turns: readonly AnamnesisTranscriptTurn[];
	/** Extra classes for the scrollable list (e.g. height constraints). */
	listClassName?: string;
}

function SupportTranscript({
	title = "Support transcript",
	participantsLabel,
	turns,
	listClassName,
	className,
	...props
}: SupportTranscriptProps) {
	return (
		<Card data-slot="support-transcript" size="sm" className={cn("gap-3", className)} {...props}>
			<CardHeader className="flex-row items-center justify-between gap-2 border-b border-border/60 pb-3">
				<CardTitle className="text-sm">{title}</CardTitle>
				{participantsLabel ? (
					<span className="text-xs text-muted-foreground">{participantsLabel}</span>
				) : null}
			</CardHeader>
			<CardContent className="p-0">
				<ScrollArea className="max-h-[380px]">
					<div className={cn("flex flex-col gap-3 px-4 py-3", listClassName)}>
						{turns.map((turn, index) => {
							const role = typeof turn.role === "string" ? turn.role : "";
							const tone = TURN_TONES[role] ?? "bg-muted/40";
							const speakerColor =
								role === "doctor" ? "text-primary" : role === "patient" ? "text-info" : "text-foreground";
							return (
								<div
									key={turn.id ?? index}
									className={cn("rounded-lg p-3 text-xs leading-relaxed", tone)}
								>
									<div className="mb-1 flex items-baseline gap-2">
										{turn.onSeek ? (
											<button
												type="button"
												onClick={turn.onSeek}
												className={cn(
													"font-semibold hover:underline",
													speakerColor,
												)}
											>
												{turn.speaker}
											</button>
										) : (
											<span className={cn("font-semibold", speakerColor)}>{turn.speaker}</span>
										)}
										{turn.time ? (
											<span className="font-mono text-[10px] text-muted-foreground tabular-nums">
												({turn.time})
											</span>
										) : null}
										{turn.uncertain ? (
											<Badge variant="outline" className="ml-auto text-[9px] font-normal">
												uncertain
											</Badge>
										) : null}
									</div>
									<p className="text-muted-foreground">“{turn.text}”</p>
								</div>
							);
						})}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}

/* -------------------------------- homologation bar --------------------------- */

export interface HomologationBarProps extends Omit<React.ComponentProps<"div">, "title"> {
	physicianName?: React.ReactNode;
	credential?: React.ReactNode;
	title?: React.ReactNode;
	description?: React.ReactNode;
	signatureLabel?: React.ReactNode;
	onRegenerate?: () => void;
	onApprove?: () => void;
	regenerateLabel?: React.ReactNode;
	approveLabel?: React.ReactNode;
	regenerateDisabled?: boolean;
	approveDisabled?: boolean;
	/** Hide the regenerate action entirely (e.g. no transcript edits). */
	hideRegenerate?: boolean;
}

function HomologationBar({
	physicianName,
	credential,
	title = "Clinical digital homologation",
	description,
	signatureLabel = "ICP-Brasil signature",
	onRegenerate,
	onApprove,
	regenerateLabel = "Re-analyze with AI",
	approveLabel = "Approve and sign record",
	regenerateDisabled = false,
	approveDisabled = false,
	hideRegenerate = false,
	className,
	...props
}: HomologationBarProps) {
	return (
		<Card
			data-slot="homologation-bar"
			size="sm"
			className={cn("flex-row items-center justify-between gap-4 py-4", className)}
			{...props}
		>
			<div className="flex min-w-0 items-center gap-3">
				<span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-success/10 text-success">
					<ShieldCheckIcon className="size-5" />
				</span>
				<div className="flex min-w-0 flex-col">
					<span className="text-sm font-semibold text-foreground">{title}</span>
					<span className="truncate text-xs text-muted-foreground">
						{description ?? (
							<>
								{physicianName}
								{credential ? ` • ${credential}` : ""} • {signatureLabel}
							</>
						)}
					</span>
				</div>
			</div>
			<div className="flex shrink-0 items-center gap-2">
				{!hideRegenerate && onRegenerate ? (
					<Button variant="outline" size="sm" onClick={onRegenerate} disabled={regenerateDisabled}>
						<RefreshCwIcon data-icon="inline-start" />
						{regenerateLabel}
					</Button>
				) : null}
				{onApprove ? (
					<Button size="sm" onClick={onApprove} disabled={approveDisabled}>
						<FileSignatureIcon data-icon="inline-start" />
						{approveLabel}
					</Button>
				) : null}
			</div>
		</Card>
	);
}

/* --------------------------------- record card ------------------------------ */

export interface AnamnesisReviewSections {
	chiefComplaint?: {
		text: React.ReactNode;
		confidence?: AnamnesisConfidence;
		confidenceLabel?: React.ReactNode;
		edited?: boolean;
		onEdit?: () => void;
	};
	history?: {
		/** Paragraphs of the history of present illness. */
		paragraphs?: readonly React.ReactNode[];
		text?: React.ReactNode;
		/** Optional "listen to audio segment" link under the text. */
		audioSegment?: { range?: React.ReactNode; label?: React.ReactNode; onSeek: () => void };
		confidence?: AnamnesisConfidence;
		confidenceLabel?: React.ReactNode;
		edited?: boolean;
		onEdit?: () => void;
	};
	hypotheses?: {
		items: readonly AnamnesisHypothesis[];
		confidence?: AnamnesisConfidence;
		confidenceLabel?: React.ReactNode;
		edited?: boolean;
		onEdit?: () => void;
	};
	conduct?: {
		items: readonly React.ReactNode[];
		confidence?: AnamnesisConfidence;
		confidenceLabel?: React.ReactNode;
		edited?: boolean;
		onEdit?: () => void;
	};
	pending?: {
		title?: React.ReactNode;
		items: readonly React.ReactNode[];
	};
}

export interface AnamnesisReviewProps extends Omit<React.ComponentProps<"div">, "title"> {
	patient: AnamnesisReviewPatient;
	physician?: AnamnesisReviewPhysician;
	modality?: AnamnesisModality;
	/** Overrides for the modality badge labels. */
	modalityLabels?: Partial<Record<AnamnesisModality, React.ReactNode>>;
	/** Back action on the header — renders a ghost button when provided. */
	onBack?: () => void;
	backLabel?: React.ReactNode;
	/** Defaults to "tab" for telemedicine, "mic" for in-person. */
	audioSource?: AnamnesisAudioSource;
	/** Record card copy — defaults are English, localize via props. */
	title?: React.ReactNode;
	description?: React.ReactNode;
	onEditAll?: () => void;
	editAllLabel?: React.ReactNode;
	sections: AnamnesisReviewSections;
	labels?: {
		chiefComplaint?: React.ReactNode;
		history?: React.ReactNode;
		hypotheses?: React.ReactNode;
		conduct?: React.ReactNode;
	};
	/** Right column — pass `null` to hide a block. */
	audio?: Omit<ConsultationAudioCardProps, "className"> | null;
	transcript?: Omit<SupportTranscriptProps, "className"> | null;
	homologation?: Omit<HomologationBarProps, "className"> | null;
	/** Fully custom header/footer overrides. */
	header?: React.ReactNode;
	recordCard?: React.ReactNode;
	footer?: React.ReactNode;
}

function AnamnesisReview({
	patient,
	physician,
	modality = "in-person",
	modalityLabels,
	onBack,
	backLabel,
	audioSource,
	title = "Structured record for validation",
	description = "Review and adjust the information before final homologation.",
	onEditAll,
	editAllLabel = "Edit all",
	sections,
	labels,
	audio,
	transcript,
	homologation,
	header,
	recordCard,
	footer,
	className,
	...props
}: AnamnesisReviewProps) {
	const resolvedAudioSource = audioSource ?? (modality === "telemedicine" ? "tab" : "mic");
	const { chiefComplaint, history, hypotheses, conduct, pending } = sections;

	return (
		<div
			data-slot="anamnesis-review"
			data-modality={modality}
			className={cn("flex w-full flex-col gap-4", className)}
			{...props}
		>
			{header ?? (
				<AnamnesisReviewHeader
					patient={patient}
					physician={physician}
					modality={modality}
					modalityLabels={modalityLabels}
					onBack={onBack}
					backLabel={backLabel}
				/>
			)}

			<div className="grid grid-cols-1 items-start gap-4 lg:grid-cols-12">
				<div className="flex flex-col gap-4 lg:col-span-8">
					{recordCard ?? (
						<Card size="sm" className="gap-5">
							<CardHeader className="flex-row items-start justify-between gap-4 border-b border-border/60 pb-4">
								<div className="flex flex-col gap-1">
									<CardTitle className="text-lg">{title}</CardTitle>
									<CardDescription>{description}</CardDescription>
								</div>
								{onEditAll ? (
									<Button variant="ghost" size="sm" onClick={onEditAll}>
										<PencilIcon data-icon="inline-start" />
										{editAllLabel}
									</Button>
								) : null}
							</CardHeader>
							<CardContent className="flex flex-col gap-5">
								{chiefComplaint ? (
									<AnamnesisSection
										title={labels?.chiefComplaint ?? "Chief complaint (QP)"}
										confidence={chiefComplaint.confidence}
										confidenceLabel={chiefComplaint.confidenceLabel}
										edited={chiefComplaint.edited}
										onEdit={chiefComplaint.onEdit}
									>
										<AnamnesisSectionBody>{chiefComplaint.text}</AnamnesisSectionBody>
									</AnamnesisSection>
								) : null}

								{history ? (
									<AnamnesisSection
										title={labels?.history ?? "History of present illness (HDA)"}
										confidence={history.confidence}
										confidenceLabel={history.confidenceLabel}
										edited={history.edited}
										onEdit={history.onEdit}
									>
										<AnamnesisSectionBody className="flex flex-col gap-3 text-muted-foreground">
											{history.text}
											{history.paragraphs?.map((p, i) => (
												<p key={i} className="text-foreground">
													{p}
												</p>
											))}
											{history.audioSegment ? (
												<span className="pt-1">
													<AnamnesisAudioSegment
														range={history.audioSegment.range}
														label={history.audioSegment.label}
														onClick={history.audioSegment.onSeek}
													/>
												</span>
											) : null}
										</AnamnesisSectionBody>
									</AnamnesisSection>
								) : null}

								{hypotheses || conduct ? (
									<div className="grid grid-cols-1 gap-5 md:grid-cols-2">
										{hypotheses ? (
											<AnamnesisSection
												title={labels?.hypotheses ?? "Diagnostic hypotheses"}
												dotClassName="bg-info"
												confidence={hypotheses.confidence}
												confidenceLabel={hypotheses.confidenceLabel}
												edited={hypotheses.edited}
												onEdit={hypotheses.onEdit}
											>
												<AnamnesisSectionBody>
													<HypothesisList items={hypotheses.items} />
												</AnamnesisSectionBody>
											</AnamnesisSection>
										) : null}
										{conduct ? (
											<AnamnesisSection
												title={labels?.conduct ?? "Recommended conduct"}
												dotClassName="bg-success"
												confidence={conduct.confidence}
												confidenceLabel={conduct.confidenceLabel}
												edited={conduct.edited}
												onEdit={conduct.onEdit}
											>
												<AnamnesisSectionBody>
													<ConductList items={conduct.items} />
												</AnamnesisSectionBody>
											</AnamnesisSection>
										) : null}
									</div>
								) : null}

								{pending ? (
									<PendingDataStrip title={pending.title} items={pending.items} />
								) : null}
							</CardContent>
						</Card>
					)}
				</div>

				<div className="flex flex-col gap-4 lg:col-span-4">
					{audio === null ? null : (
						<ConsultationAudioCard {...(audio ?? { audioSource: resolvedAudioSource })} />
					)}
					{transcript === null ? null : transcript ? (
						<SupportTranscript {...transcript} />
					) : null}
				</div>
			</div>

			{footer ??
				(homologation === null ? null : (
					<HomologationBar
						physicianName={physician?.name}
						credential={physician?.credential}
						{...(homologation ?? {})}
					/>
				))}
		</div>
	);
}

export {
	AnamnesisAudioSegment,
	AnamnesisReview,
	AnamnesisReviewHeader,
	AnamnesisSection,
	AnamnesisSectionBody,
	ConductList,
	ConsultationAudioCard,
	HomologationBar,
	HypothesisList,
	PendingDataStrip,
	SupportTranscript,
};
