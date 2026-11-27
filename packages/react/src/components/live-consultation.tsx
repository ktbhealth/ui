import * as React from "react";
import { cn } from "cn";
import {
	CheckIcon,
	CopyIcon,
	DownloadIcon,
	LockIcon,
	MicIcon,
	NotebookPenIcon,
	PanelRightIcon,
	PauseIcon,
	PlayIcon,
	Settings2Icon,
	SparklesIcon,
	SquarePenIcon,
	TriangleAlertIcon,
	VideoIcon,
	WandSparklesIcon,
	XIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "./avatar";
import { Badge } from "./badge";
import { Bubble, BubbleContent } from "./bubble";
import { Button } from "./button";
import {
	Message,
	MessageAvatar,
	MessageContent,
	MessageHeader,
} from "./message";
import { ScrollArea } from "./scroll-area";
import {
	Sheet,
	SheetContent,
	SheetTitle,
} from "./sheet";

/**
 * Live Consultation — real-time diarized transcription screen
 * (Google Meet-style centered layout). Presentational composite:
 * header with patient context + live pill, centered transcript panel
 * with speaker turns, live status strip, bottom control bar and an
 * AI-structured anamnesis drawer. All copy is overridable via `labels`.
 */

// ---------- types ----------

export type LiveConsultationModality = "in-person" | "telemedicine";
export type LiveConsultationStatus = "live" | "paused" | "ended";

export interface LiveConsultationPatient {
	name: string;
	/** Rendered as "{age} {labels.yearsOld}" when provided. */
	age?: number | string;
	/** Rendered as "Prontuário #{recordNumber}" (labels.recordPrefix). */
	recordNumber?: string | number;
	/** Small warning/info badge next to the name (e.g. "Hipertensão leve"). */
	condition?: string;
	/** Avatar initials override — derived from `name` when omitted. */
	initials?: string;
}

export interface LiveConsultationParagraph {
	/** mm:ss stamp, e.g. "01:38". */
	time: string;
	text: string;
}

export interface LiveConsultationTurn {
	/** Speaker index — selects the cyclic tone (primary/success/warning/info). */
	speaker: number;
	name: string;
	/** Neutral role chip, e.g. "Médico" / "Paciente". */
	role?: string;
	paragraphs: LiveConsultationParagraph[];
}

export interface AnamnesisCalloutData {
	/** Box tone — warning for risk factors (default), info for neutral notes. */
	tone?: "warning" | "info" | "success" | "destructive";
	/** Optional bold lead-in, e.g. "Fator Relevante:". */
	title?: React.ReactNode;
	children: React.ReactNode;
}

export interface AnamnesisChecklistItem {
	text: React.ReactNode;
	/** Rendered with a filled check when true, hollow when false/omitted. */
	done?: boolean;
}

export interface AnamnesisSectionData {
	id?: string;
	title: string;
	/** Right-side status chip — "Confirmado", "98% Confiança", "Sugestão"… */
	status?: React.ReactNode;
	/** Section dot color — token utility like "bg-primary" / "bg-info". */
	accent?: string;
	/** Section body — paragraph text or arbitrary markup (e.g. CID <ul>). */
	body?: React.ReactNode;
	/** Highlighted callout rendered under the body (risk factors…). */
	callout?: AnamnesisCalloutData;
	/** Checklist rendered under the body (recommended conduct…). */
	checklist?: AnamnesisChecklistItem[];
}

export interface LiveConsultationLabels {
	live: string;
	paused: string;
	ended: string;
	encryption: string;
	anamnesis: string;
	endConsultation: string;
	transcriptTitle: string;
	diarizationActive: string;
	diarizationPaused: string;
	diarizationEnded: string;
	copy: string;
	export: string;
	listening: string;
	pausedListening: string;
	endedListening: string;
	audioSourceInPerson: string;
	audioSourceTelemedicine: string;
	audioQuality: string;
	settings: string;
	addNote: string;
	pauseTranscription: string;
	resumeTranscription: string;
	anamnesisDrawerTitle: string;
	anamnesisPrivacy: string;
	generatePrescription: string;
	closeDrawer: string;
	synchronized: string;
	pendingSync: string;
	edit: string;
	save: string;
	concludeAnamnesis: string;
	yearsOld: string;
	recordPrefix: string;
}

const DEFAULT_LABELS: LiveConsultationLabels = {
	live: "AO VIVO",
	paused: "PAUSADA",
	ended: "ENCERRADA",
	encryption: "E2E / LGPD",
	anamnesis: "Anamnese IA",
	endConsultation: "Encerrar Consulta",
	transcriptTitle: "Transcrição da Consulta em Tempo Real",
	diarizationActive: "Diarização Ativa",
	diarizationPaused: "Diarização Pausada",
	diarizationEnded: "Diarização Encerrada",
	copy: "Copiar",
	export: "Exportar",
	listening: "Ouvindo diálogo e transcrevendo em tempo real...",
	pausedListening: "Transcrição pausada — áudio continua sendo capturado.",
	endedListening: "Consulta encerrada — transcrição finalizada.",
	audioSourceInPerson: "Áudio HD 48kHz",
	audioSourceTelemedicine: "Meeting tab audio",
	audioQuality: "Áudio HD",
	settings: "Configurações",
	addNote: "Nota Clínica",
	pauseTranscription: "Pausar transcrição",
	resumeTranscription: "Retomar transcrição",
	anamnesisDrawerTitle: "Anamnese Estruturada por IA",
	anamnesisPrivacy:
		"Consulta criptografada de ponta a ponta e segura (LGPD Compliant)",
	generatePrescription: "Gerar Receita",
	closeDrawer: "Fechar gaveta",
	synchronized: "Sincronizado",
	pendingSync: "Sincronizando…",
	edit: "Editar",
	save: "Salvar",
	concludeAnamnesis: "Concluir Anamnese",
	yearsOld: "anos",
	recordPrefix: "Prontuário #",
};

function useLabels(labels?: Partial<LiveConsultationLabels>): LiveConsultationLabels {
	return React.useMemo(
		() => ({ ...DEFAULT_LABELS, ...labels }),
		[labels],
	);
}

// ---------- speaker tones (same cyclic pattern as the catalog blocks) ----------

const SPEAKER_TONES = [
	{ avatar: "bg-primary/15 text-primary border-primary/40", name: "text-primary" },
	{ avatar: "bg-success/15 text-success border-success/40", name: "text-success" },
	{ avatar: "bg-warning/15 text-warning border-warning/40", name: "text-warning" },
	{ avatar: "bg-info/15 text-info border-info/40", name: "text-info" },
] as const;

function speakerTone(speaker: number) {
	return SPEAKER_TONES[speaker % SPEAKER_TONES.length]!;
}

function initialsOf(name: string): string {
	return name
		.split(/\s+/)
		.filter(Boolean)
		.slice(0, 2)
		.map((w) => w[0]!.toUpperCase())
		.join("");
}

function formatElapsed(seconds?: number): string | undefined {
	if (seconds === undefined) return undefined;
	const m = Math.floor(seconds / 60);
	const s = Math.floor(seconds % 60);
	return `${m}:${s.toString().padStart(2, "0")}`;
}

// ---------- small pieces ----------

/** Animated VU bars for the live status strip; static when not live. */
export function LiveVuMeter({
	active = true,
	className,
}: {
	active?: boolean;
	className?: string;
}) {
	return (
		<span className={cn("flex h-4 items-end gap-0.5", className)} aria-hidden>
			{[0, 0.12, 0.24, 0.36, 0.48].map((delay) => (
				<span
					key={delay}
					className={cn(
						"w-0.5 rounded-full",
						active
							? "animate-[livevu_1.1s_ease-in-out_infinite] bg-success"
							: "bg-muted-foreground/40",
					)}
					style={{
						animationDelay: `${delay}s`,
						height: active ? "10px" : "6px",
					}}
				/>
			))}
			<style>{`@keyframes livevu { 0%,100% { height: 6px } 50% { height: 14px } }`}</style>
		</span>
	);
}

/** Centered privacy pill (E2E / LGPD note) reused across the screen. */
export function LivePrivacyPill({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) {
	return (
		<div className={cn("my-1 flex items-center justify-center", className)}>
			<span className="inline-flex items-center gap-1.5 rounded-full border border-info/30 bg-info/10 px-3 py-1 text-[11px] text-info shadow-sm">
				<LockIcon className="size-2.5" />
				{children}
			</span>
		</div>
	);
}

// ---------- header ----------

export interface LiveConsultationHeaderProps {
	patient: LiveConsultationPatient;
	status?: LiveConsultationStatus;
	/** Elapsed mm:ss — pass `elapsed` string or `elapsedSeconds`. */
	elapsed?: string;
	elapsedSeconds?: number;
	modality?: LiveConsultationModality;
	/** Anamnesis topic count shown as a badge on the drawer toggle. */
	anamnesisCount?: number;
	anamnesisOpen?: boolean;
	onToggleAnamnesis?: () => void;
	onEndConsultation?: () => void;
	labels?: Partial<LiveConsultationLabels>;
	className?: string;
}

export function LiveConsultationHeader({
	patient,
	status = "live",
	elapsed,
	elapsedSeconds,
	modality = "in-person",
	anamnesisCount,
	anamnesisOpen = false,
	onToggleAnamnesis,
	onEndConsultation,
	labels: labelsProp,
	className,
}: LiveConsultationHeaderProps) {
	const L = useLabels(labelsProp);
	const timer = elapsed ?? formatElapsed(elapsedSeconds);
	const tone =
		status === "live"
			? "border-destructive/30 bg-destructive/10 text-destructive"
			: status === "paused"
				? "border-warning/30 bg-warning/10 text-warning"
				: "border-border bg-muted text-muted-foreground";
	const dot =
		status === "live"
			? "bg-destructive animate-pulse"
			: status === "paused"
				? "bg-warning"
				: "bg-muted-foreground/50";
	const statusLabel =
		status === "live" ? L.live : status === "paused" ? L.paused : L.ended;

	const meta: React.ReactNode[] = [];
	if (patient.age !== undefined) {
		meta.push(`${patient.age} ${L.yearsOld}`);
	}
	if (patient.recordNumber !== undefined) {
		meta.push(
			<span key="record" className="font-mono text-primary/90">
				{L.recordPrefix}
				{patient.recordNumber}
			</span>,
		);
	}

	return (
		<header
			className={cn(
				"flex h-14 shrink-0 items-center justify-between gap-3 border-b bg-card/60 px-4 backdrop-blur-md md:px-6",
				className,
			)}
		>
			<div className="flex min-w-0 items-center gap-3">
				<Avatar className="size-8 rounded-full border border-primary/40 bg-primary/15">
					<AvatarFallback className="rounded-full bg-primary/15 text-xs font-bold text-primary">
						{patient.initials ?? initialsOf(patient.name)}
					</AvatarFallback>
				</Avatar>
				<div className="min-w-0">
					<div className="flex flex-wrap items-center gap-x-2 gap-y-0.5">
						<h1 className="truncate text-sm font-semibold tracking-tight">
							{patient.name}
						</h1>
						{meta.map((m, i) => (
							<React.Fragment key={i}>
								{i === 0 ? null : <span className="text-xs text-muted-foreground">•</span>}
								<span className="text-xs text-muted-foreground">{m}</span>
							</React.Fragment>
						))}
						{patient.condition ? (
							<Badge
								variant="outline"
								className="ml-1 border-warning/25 bg-warning/10 px-2 py-0 text-[10px] font-medium text-warning"
							>
								{patient.condition}
							</Badge>
						) : null}
					</div>
				</div>
			</div>

			<div className="flex shrink-0 items-center gap-2.5">
				<div
					className={cn(
						"hidden items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground md:flex",
						tone,
					)}
				>
					<span className={cn("size-2 rounded-full", dot)} />
					<span className="font-mono text-xs font-semibold tabular-nums">
						{statusLabel}
					</span>
					{timer ? (
						<>
							<span className="text-muted-foreground/60">|</span>
							<span className="font-mono font-medium tabular-nums">{timer}</span>
						</>
					) : null}
					<span className="text-muted-foreground/60">•</span>
					<span className="inline-flex items-center gap-1 text-[11px]">
						<LockIcon className="size-2.5" />
						{L.encryption}
					</span>
					<span className="text-muted-foreground/60">•</span>
					<span className="inline-flex items-center gap-1 text-[11px]">
						{modality === "telemedicine" ? (
							<VideoIcon className="size-2.5" />
						) : (
							<MicIcon className="size-2.5" />
						)}
						{modality === "telemedicine"
							? L.audioSourceTelemedicine
							: L.audioSourceInPerson}
					</span>
				</div>

				{onToggleAnamnesis ? (
					<Button
						variant="outline"
						size="sm"
						className={cn(
							"h-8 gap-1.5 border-primary/40 bg-primary/10 text-xs font-semibold text-primary hover:bg-primary/20",
							anamnesisOpen && "bg-primary/20",
						)}
						onClick={onToggleAnamnesis}
					>
						<SparklesIcon className="size-3" />
						{L.anamnesis}
						{anamnesisCount !== undefined && anamnesisCount > 0 ? (
							<span className="rounded-full bg-primary px-1.5 py-px text-[10px] font-bold text-primary-foreground">
								{anamnesisCount}
							</span>
						) : null}
					</Button>
				) : null}

				{onEndConsultation ? (
					<Button
						variant="destructive"
						size="sm"
						className="h-8 text-xs font-semibold"
						onClick={onEndConsultation}
					>
						{L.endConsultation}
					</Button>
				) : null}
			</div>
		</header>
	);
}

// ---------- transcript ----------

/**
 * One diarized speaker turn: tone avatar + name/time/role header + bubble
 * with stamped sub-paragraphs. `onSeek(ParagraphIndex)` fires when a
 * stamped paragraph (or the turn itself, index 0) is clicked.
 */
export function SpeakerTurn({
	turn,
	onSeek,
	className,
}: {
	turn: LiveConsultationTurn;
	onSeek?: (paragraphIndex: number) => void;
	className?: string;
}) {
	const tone = speakerTone(turn.speaker);
	const firstTime = turn.paragraphs[0]?.time;
	return (
		<Message className={className}>
			<MessageAvatar className="self-start">
				<Avatar className={cn("size-9 rounded-xl border", tone.avatar)}>
					<AvatarFallback
						className={cn("rounded-xl text-xs font-bold", tone.avatar)}
					>
						{initialsOf(turn.name)}
					</AvatarFallback>
				</Avatar>
			</MessageAvatar>
			<MessageContent>
				<MessageHeader className="mb-1.5 flex items-center gap-2">
					<span className={cn("text-xs font-bold", tone.name)}>{turn.name}</span>
					{firstTime ? (
						onSeek ? (
							<button
								type="button"
								onClick={() => onSeek(0)}
								className="font-mono text-[11px] text-muted-foreground tabular-nums hover:text-foreground"
							>
								{firstTime}
							</button>
						) : (
							<span className="font-mono text-[11px] text-muted-foreground tabular-nums">
								{firstTime}
							</span>
						)
					) : null}
					{turn.role ? (
						<Badge variant="outline" className="px-1.5 py-0 text-[10px] font-normal">
							{turn.role}
						</Badge>
					) : null}
				</MessageHeader>
				<Bubble variant="secondary" className="max-w-full">
					<BubbleContent className="w-full rounded-2xl rounded-tl-none border-border/60 px-3.5 py-3">
						<div className="space-y-2.5">
							{turn.paragraphs.map((p, i) =>
								i === 0 ? (
									<p key={i} className="leading-relaxed">
										{p.text}
									</p>
								) : (
									<div
										key={i}
										className="flex items-start gap-2 border-t border-border/50 pt-2"
									>
										{onSeek ? (
											<button
												type="button"
												onClick={() => onSeek(i)}
												className="mt-0.5 shrink-0 font-mono text-[10px] text-muted-foreground tabular-nums hover:text-foreground"
											>
												{p.time}
											</button>
										) : (
											<span className="mt-0.5 font-mono text-[10px] text-muted-foreground tabular-nums">
												{p.time}
											</span>
										)}
										<p className="flex-1 leading-relaxed">{p.text}</p>
									</div>
								),
							)}
						</div>
					</BubbleContent>
				</Bubble>
			</MessageContent>
		</Message>
	);
}

export interface LiveTranscriptPanelProps {
	turns?: LiveConsultationTurn[];
	status?: LiveConsultationStatus;
	onCopyTranscript?: () => void;
	onExportTranscript?: () => void;
	/** Called with (turnIndex, paragraphIndex) when a stamp is clicked. */
	onSeek?: (turnIndex: number, paragraphIndex: number) => void;
	/** Extra content rendered at the end of the scroll area. */
	footer?: React.ReactNode;
	labels?: Partial<LiveConsultationLabels>;
	className?: string;
}

/**
 * Centered transcript panel: status header (title + diarization badge +
 * copy/export), scrollable speaker turns and an optional live footer.
 */
export function LiveTranscriptPanel({
	turns = [],
	status = "live",
	onCopyTranscript,
	onExportTranscript,
	onSeek,
	footer,
	labels: labelsProp,
	className,
}: LiveTranscriptPanelProps) {
	const L = useLabels(labelsProp);
	const live = status === "live";
	const diarization =
		status === "live"
			? L.diarizationActive
			: status === "paused"
				? L.diarizationPaused
				: L.diarizationEnded;
	return (
		<div
			className={cn(
				"flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl border bg-card/60 shadow-sm backdrop-blur-md",
				className,
			)}
		>
			<div className="flex shrink-0 items-center justify-between gap-2 border-b bg-card/40 px-4 py-2.5 md:px-5">
				<div className="flex min-w-0 items-center gap-2.5">
					<span
						className={cn(
							"size-2 shrink-0 rounded-full",
							live ? "animate-pulse bg-primary" : "bg-muted-foreground/50",
						)}
					/>
					<h2 className="truncate text-xs font-bold tracking-wider uppercase">
						{L.transcriptTitle}
					</h2>
					<Badge
						variant="outline"
						className="hidden px-2 py-0 text-[10px] font-normal sm:inline-flex"
					>
						{diarization}
					</Badge>
				</div>
				<div className="flex shrink-0 items-center gap-1.5">
					{onCopyTranscript ? (
						<Button
							variant="outline"
							size="sm"
							className="h-7 gap-1.5 px-2 text-[11px]"
							onClick={onCopyTranscript}
						>
							<CopyIcon className="size-3" />
							{L.copy}
						</Button>
					) : null}
					{onExportTranscript ? (
						<Button
							variant="outline"
							size="sm"
							className="h-7 gap-1.5 px-2 text-[11px]"
							onClick={onExportTranscript}
						>
							<DownloadIcon className="size-3" />
							{L.export}
						</Button>
					) : null}
				</div>
			</div>

			<ScrollArea className="min-h-0 flex-1">
				<div className="space-y-4 p-4 md:p-6">
					{turns.map((turn, i) => (
						<SpeakerTurn
							key={i}
							turn={turn}
							onSeek={
								onSeek ? (p) => onSeek(i, p) : undefined
							}
						/>
					))}
					{footer}
				</div>
			</ScrollArea>
		</div>
	);
}

// ---------- live status strip ----------

export interface LiveStatusStripProps {
	status?: LiveConsultationStatus;
	modality?: LiveConsultationModality;
	/** Audio source label override — defaults per modality. */
	audioSource?: string;
	/** Sample-rate / quality suffix, e.g. "48kHz" → "Áudio HD 48kHz". */
	audioQuality?: string;
	labels?: Partial<LiveConsultationLabels>;
	className?: string;
}

/** Bottom "listening" strip: status text + VU meter + audio source. */
export function LiveStatusStrip({
	status = "live",
	modality = "in-person",
	audioSource,
	audioQuality,
	labels: labelsProp,
	className,
}: LiveStatusStripProps) {
	const L = useLabels(labelsProp);
	const live = status === "live";
	const text =
		status === "live"
			? L.listening
			: status === "paused"
				? L.pausedListening
				: L.endedListening;
	const source =
		audioSource ??
		(modality === "telemedicine"
			? L.audioSourceTelemedicine
			: audioQuality
				? `${L.audioQuality} ${audioQuality}`
				: L.audioSourceInPerson);
	return (
		<div
			className={cn(
				"flex shrink-0 items-center justify-between gap-3 border-t bg-card/60 px-4 py-2 text-xs",
				className,
			)}
		>
			<div className="flex min-w-0 items-center gap-2.5">
				<span
					className={cn(
						"size-2 shrink-0 rounded-full",
						live
							? "animate-pulse bg-primary"
							: status === "paused"
								? "bg-warning"
								: "bg-muted-foreground/50",
					)}
				/>
				<span
					className={cn(
						"truncate italic",
						live ? "text-primary/90" : "text-muted-foreground",
					)}
				>
					{text}
				</span>
			</div>
			<div className="flex shrink-0 items-center gap-3">
				<LiveVuMeter active={live} />
				<span className="hidden font-mono text-[11px] text-muted-foreground tabular-nums sm:inline">
					{source}
				</span>
			</div>
		</div>
	);
}

// ---------- control bar ----------

export interface ConsultationControlBarProps {
	status?: LiveConsultationStatus;
	/** Anamnesis drawer toggle — receives current open state. */
	anamnesisOpen?: boolean;
	anamnesisCount?: number;
	onOpenSettings?: () => void;
	onAddNote?: () => void;
	onToggleAnamnesis?: () => void;
	/** Pause/resume transcription — button hidden when ended. */
	onToggleTranscription?: () => void;
	labels?: Partial<LiveConsultationLabels>;
	className?: string;
}

/** Bottom control bar: settings, clinical note, anamnesis drawer, pause. */
export function ConsultationControlBar({
	status = "live",
	anamnesisOpen = false,
	anamnesisCount,
	onOpenSettings,
	onAddNote,
	onToggleAnamnesis,
	onToggleTranscription,
	labels: labelsProp,
	className,
}: ConsultationControlBarProps) {
	const L = useLabels(labelsProp);
	const paused = status === "paused";
	return (
		<div
			className={cn(
				"flex shrink-0 items-center justify-center gap-2 border-t bg-card/60 px-4 py-2.5",
				className,
			)}
		>
			{onOpenSettings ? (
				<Button
					variant="ghost"
					size="sm"
					className="h-9 gap-1.5 px-3 text-xs text-muted-foreground"
					onClick={onOpenSettings}
					title={L.settings}
				>
					<Settings2Icon className="size-4" />
					<span className="hidden sm:inline">{L.settings}</span>
				</Button>
			) : null}
			{onAddNote ? (
				<Button
					variant="outline"
					size="sm"
					className="h-9 gap-1.5 border-primary/30 bg-primary/10 px-3 text-xs font-semibold text-primary hover:bg-primary/20"
					onClick={onAddNote}
				>
					<NotebookPenIcon className="size-3.5" />
					{L.addNote}
				</Button>
			) : null}
			{onToggleAnamnesis ? (
				<Button
					variant={anamnesisOpen ? "secondary" : "outline"}
					size="sm"
					className="h-9 gap-1.5 px-3 text-xs"
					onClick={onToggleAnamnesis}
				>
					<PanelRightIcon className="size-3.5" />
					{L.anamnesis}
					{anamnesisCount !== undefined && anamnesisCount > 0 ? (
						<span className="rounded-full bg-primary px-1.5 py-px text-[10px] font-bold text-primary-foreground">
							{anamnesisCount}
						</span>
					) : null}
				</Button>
			) : null}
			{onToggleTranscription && status !== "ended" ? (
				<Button
					variant="outline"
					size="sm"
					className="h-9 gap-1.5 px-3 text-xs"
					onClick={onToggleTranscription}
				>
					{paused ? (
						<PlayIcon className="size-3.5 text-success" />
					) : (
						<PauseIcon className="size-3.5" />
					)}
					{paused ? L.resumeTranscription : L.pauseTranscription}
				</Button>
			) : null}
		</div>
	);
}

// ---------- anamnesis ----------

const CALLOUT_TONES = {
	warning: "border-warning/25 bg-warning/10 text-warning",
	info: "border-info/25 bg-info/10 text-info",
	success: "border-success/25 bg-success/10 text-success",
	destructive: "border-destructive/25 bg-destructive/10 text-destructive",
} as const;

/** Highlighted callout inside an anamnesis section (risk factor…). */
export function AnamnesisCallout({
	tone = "warning",
	title,
	children,
	className,
}: AnamnesisCalloutData & { className?: string }) {
	return (
		<div
			className={cn(
				"mt-2.5 flex items-start gap-2 rounded-lg border p-2.5",
				CALLOUT_TONES[tone],
				className,
			)}
		>
			<TriangleAlertIcon className="mt-0.5 size-3.5 shrink-0" />
			<p className="text-[11px] leading-relaxed">
				{title ? <strong className="font-semibold">{title} </strong> : null}
				{children}
			</p>
		</div>
	);
}

/**
 * Structured anamnesis section card: dot + uppercase title + status chip,
 * body, optional callout and checklist.
 */
export function AnamnesisSectionCard({
	title,
	status,
	accent = "bg-primary",
	body,
	callout,
	checklist,
	className,
}: AnamnesisSectionData & { className?: string }) {
	return (
		<section className={cn("rounded-xl border bg-card p-3.5", className)}>
			<div className="mb-1.5 flex items-center justify-between gap-2">
				<div className="flex min-w-0 items-center gap-2">
					<span className={cn("size-1.5 shrink-0 rounded-full", accent)} />
					<h3 className="truncate text-xs font-bold tracking-wide uppercase">
						{title}
					</h3>
				</div>
				{status}
			</div>
			{body !== undefined ? (
				<div className="text-xs leading-relaxed text-muted-foreground">{body}</div>
			) : null}
			{callout ? (
				<AnamnesisCallout tone={callout.tone} title={callout.title}>
					{callout.children}
				</AnamnesisCallout>
			) : null}
			{checklist && checklist.length > 0 ? (
				<ul className="mt-2 space-y-1.5 text-xs text-foreground">
					{checklist.map((item, i) => (
						<li key={i} className="flex items-start gap-2">
							{item.done ? (
								<CheckIcon className="mt-0.5 size-3 shrink-0 text-info" />
							) : (
								<span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-muted-foreground/50" />
							)}
							<span>{item.text}</span>
						</li>
					))}
				</ul>
			) : null}
		</section>
	);
}

export interface AnamnesisDrawerProps {
	open: boolean;
	onOpenChange?: (open: boolean) => void;
	sections?: AnamnesisSectionData[];
	/** Topic count shown next to the title (defaults to sections.length). */
	topicCount?: number;
	synced?: boolean;
	onGeneratePrescription?: () => void;
	onClose?: () => void;
	onEdit?: () => void;
	onSave?: () => void;
	onConclude?: () => void;
	labels?: Partial<LiveConsultationLabels>;
	className?: string;
}

/**
 * Right-side anamnesis drawer (Sheet): privacy pill + structured AI
 * sections + footer with sync state and Edit/Save/Conclude actions.
 */
export function AnamnesisDrawer({
	open,
	onOpenChange,
	sections = [],
	topicCount,
	synced = true,
	onGeneratePrescription,
	onClose,
	onEdit,
	onSave,
	onConclude,
	labels: labelsProp,
	className,
}: AnamnesisDrawerProps) {
	const L = useLabels(labelsProp);
	const count = topicCount ?? sections.length;
	const handleOpenChange = (next: boolean) => {
		if (!next) onClose?.();
		onOpenChange?.(next);
	};
	return (
		<Sheet open={open} onOpenChange={handleOpenChange}>
			<SheetContent
				side="right"
				showCloseButton={false}
				className={cn("w-full gap-0 p-0 sm:max-w-[520px]", className)}
			>
				<SheetTitle className="sr-only">{L.anamnesisDrawerTitle}</SheetTitle>
				<div className="flex shrink-0 items-center justify-between gap-2 border-b bg-card/60 px-4 py-3">
					<div className="flex min-w-0 items-center gap-2.5">
						<span className="flex size-6 shrink-0 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
							<SparklesIcon className="size-3" />
						</span>
						<h2 className="truncate text-xs font-bold tracking-wider uppercase">
							{L.anamnesisDrawerTitle}
							{count > 0 ? (
								<span className="ml-1.5 font-mono text-[10px] font-normal text-muted-foreground">
									({count})
								</span>
							) : null}
						</h2>
					</div>
					<div className="flex shrink-0 items-center gap-2">
						{onGeneratePrescription ? (
							<Button
								variant="secondary"
								size="sm"
								className="h-7 gap-1.5 text-[11px]"
								onClick={onGeneratePrescription}
							>
								<WandSparklesIcon className="size-3" />
								{L.generatePrescription}
							</Button>
						) : null}
						<Button
							variant="outline"
							size="icon"
							className="size-7"
							title={L.closeDrawer}
							aria-label={L.closeDrawer}
							onClick={() => handleOpenChange(false)}
						>
							<XIcon className="size-3.5" />
						</Button>
					</div>
				</div>

				<ScrollArea className="min-h-0 flex-1">
					<div className="space-y-3.5 p-4">
						<LivePrivacyPill>{L.anamnesisPrivacy}</LivePrivacyPill>
						{sections.map((section, i) => (
							<AnamnesisSectionCard key={section.id ?? i} {...section} />
						))}
					</div>
				</ScrollArea>

				<div className="flex shrink-0 items-center justify-between gap-2 border-t bg-card/60 p-3">
					<span className="inline-flex items-center gap-1.5 text-[11px] text-muted-foreground">
						<span
							className={cn(
								"size-1.5 rounded-full",
								synced ? "bg-success" : "bg-warning",
							)}
						/>
						{synced ? L.synchronized : L.pendingSync}
					</span>
					<div className="flex items-center gap-2">
						{onEdit ? (
							<Button
								variant="outline"
								size="sm"
								className="h-8 gap-1.5 text-xs"
								onClick={onEdit}
							>
								<SquarePenIcon className="size-3" />
								{L.edit}
							</Button>
						) : null}
						{onSave ? (
							<Button
								variant="secondary"
								size="sm"
								className="h-8 gap-1.5 text-xs"
								onClick={onSave}
							>
								<CheckIcon className="size-3" />
								{L.save}
							</Button>
						) : null}
						{onConclude ? (
							<Button
								size="sm"
								className="h-8 gap-1.5 text-xs font-semibold"
								onClick={onConclude}
							>
								<WandSparklesIcon className="size-3" />
								{L.concludeAnamnesis}
							</Button>
						) : null}
					</div>
				</div>
			</SheetContent>
		</Sheet>
	);
}

// ---------- screen composite ----------

export interface LiveConsultationProps {
	patient: LiveConsultationPatient;
	/** Consultation modality — telemedicine captures only the meeting tab audio. */
	modality?: LiveConsultationModality;
	status?: LiveConsultationStatus;
	elapsed?: string;
	elapsedSeconds?: number;
	turns?: LiveConsultationTurn[];
	anamnesis?: {
		open?: boolean;
		onOpenChange?: (open: boolean) => void;
		sections?: AnamnesisSectionData[];
		topicCount?: number;
		synced?: boolean;
		onGeneratePrescription?: () => void;
		onClose?: () => void;
		onEdit?: () => void;
		onSave?: () => void;
		onConclude?: () => void;
	};
	onEndConsultation?: () => void;
	onCopyTranscript?: () => void;
	onExportTranscript?: () => void;
	onSeek?: (turnIndex: number, paragraphIndex: number) => void;
	onOpenSettings?: () => void;
	onAddNote?: () => void;
	onToggleTranscription?: () => void;
	labels?: Partial<LiveConsultationLabels>;
	className?: string;
}

/**
 * Live Consultation screen: slim header (patient + live pill + actions),
 * centered transcript panel with live status strip, bottom control bar
 * and the AI anamnesis drawer.
 */
export function LiveConsultation({
	patient,
	modality = "in-person",
	status = "live",
	elapsed,
	elapsedSeconds,
	turns = [],
	anamnesis,
	onEndConsultation,
	onCopyTranscript,
	onExportTranscript,
	onSeek,
	onOpenSettings,
	onAddNote,
	onToggleTranscription,
	labels: labelsProp,
	className,
}: LiveConsultationProps) {
	const L = useLabels(labelsProp);
	const anamnesisOpen = anamnesis?.open ?? false;
	const anamnesisCount =
		anamnesis?.topicCount ?? anamnesis?.sections?.length ?? 0;
	const toggleAnamnesis = () => {
		anamnesis?.onOpenChange?.(!anamnesisOpen);
	};

	return (
		<div
			className={cn(
				"flex h-full min-h-0 flex-col overflow-hidden bg-background",
				className,
			)}
		>
			<LiveConsultationHeader
				patient={patient}
				status={status}
				elapsed={elapsed}
				elapsedSeconds={elapsedSeconds}
				modality={modality}
				anamnesisCount={anamnesisCount}
				anamnesisOpen={anamnesisOpen}
				onToggleAnamnesis={anamnesis ? toggleAnamnesis : undefined}
				onEndConsultation={onEndConsultation}
				labels={L}
			/>

			<div className="flex min-h-0 flex-1 flex-col px-4 py-3 md:px-8">
				<div className="mx-auto flex min-h-0 w-full max-w-4xl flex-1 flex-col">
					<LiveTranscriptPanel
						turns={turns}
						status={status}
						onCopyTranscript={onCopyTranscript}
						onExportTranscript={onExportTranscript}
						onSeek={onSeek}
						labels={L}
						className="rounded-b-none border-b-0"
					/>
					<LiveStatusStrip
						status={status}
						modality={modality}
						labels={L}
						className="rounded-b-2xl border-x border-b"
					/>
				</div>
			</div>

			<ConsultationControlBar
				status={status}
				anamnesisOpen={anamnesisOpen}
				anamnesisCount={anamnesisCount}
				onOpenSettings={onOpenSettings}
				onAddNote={onAddNote}
				onToggleAnamnesis={anamnesis ? toggleAnamnesis : undefined}
				onToggleTranscription={onToggleTranscription}
				labels={L}
			/>

			{anamnesis ? (
				<AnamnesisDrawer
					open={anamnesisOpen}
					onOpenChange={anamnesis.onOpenChange}
					sections={anamnesis.sections}
					topicCount={anamnesisCount}
					synced={anamnesis.synced}
					onGeneratePrescription={anamnesis.onGeneratePrescription}
					onClose={anamnesis.onClose}
					onEdit={anamnesis.onEdit}
					onSave={anamnesis.onSave}
					onConclude={anamnesis.onConclude}
					labels={L}
				/>
			) : null}
		</div>
	);
}
