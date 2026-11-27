"use client";

import * as React from "react";
import { useControllableState } from "@radix-ui/react-use-controllable-state";
import { cn } from "cn";
import {
	ActivityIcon,
	ArrowLeftRightIcon,
	CheckIcon,
	ChevronDownIcon,
	LoaderCircleIcon,
	LockIcon,
	MicIcon,
	MicOffIcon,
	MonitorSmartphoneIcon,
	PencilLineIcon,
	SettingsIcon,
	StethoscopeIcon,
	VideoIcon,
	Volume2Icon,
	WifiIcon,
} from "lucide-react";

import { Avatar, AvatarFallback } from "@ktbhealth/ui/components/avatar";
import { Badge } from "@ktbhealth/ui/components/badge";
import { Button } from "@ktbhealth/ui/components/button";
import { Checkbox } from "@ktbhealth/ui/components/checkbox";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@ktbhealth/ui/components/select";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@ktbhealth/ui/components/tooltip";

/* ---------------------------------- types ---------------------------------- */

/**
 * Capture modality for the pre-consultation room. In telemedicine the
 * consultation happens in an external tool (Google Meet etc.) — KTB only
 * captures the meeting tab's audio (tab audio / stereo loopback), not the
 * mic on the patient side. In-person captures the room microphone.
 */
export type PreconsultationModality = "in-person" | "telemedicine";

export type PreconsultationAudioStatus = "ready" | "muted" | "testing" | "calibrated";

export interface PreconsultationPhysician {
	name: string;
	/** e.g. "CRM-SP 184920 · Cardiology" */
	credentials?: React.ReactNode;
	/** Avatar initials — defaults to the first letters of `name`. */
	initials?: string;
}

export interface PreconsultationPatient {
	name: string;
	/** e.g. 42 or "42y" — rendered next to the name. */
	age?: React.ReactNode;
	initials?: string;
	/** e.g. "Mild hypertension" — shown as a subtle secondary line. */
	condition?: React.ReactNode;
}

export interface PreconsultationAudioDevice {
	id: string;
	label: string;
	/**
	 * Capture semantics of the source — `"tab-audio"` is the telemedicine
	 * meeting-tab capture, `"microphone"`/`"loopback"` the in-person path.
	 */
	kind?: "microphone" | "tab-audio" | "loopback" | (string & {});
}

export interface PreconsultationTelemetry {
	/** e.g. "KTB Health ClinicalPulse v2.5" */
	version?: React.ReactNode;
	/** Numeric latency in ms — rendered as a "<24 ms"-style chip. */
	latencyMs?: number | null;
	/** Full override for the latency chip label. */
	latencyLabel?: React.ReactNode;
	/** e.g. "End-to-end encrypted" */
	encryptionLabel?: React.ReactNode;
}

export interface PreconsultationRoomLabels {
	brandName: string;
	roomTitle: string;
	readyTitle: string;
	consentTitle: string;
	consentDescription: React.ReactNode;
	changePatient: string;
	testAudio: string;
	testingAudio: string;
	calibratedAudio: string;
	startSession: string;
	startingSession: string;
	secondaryAction: string;
	modalityInPerson: string;
	modalityTelemedicine: string;
	/** Capture-mode copy under the preview avatar. */
	captureInPerson: string;
	captureTelemedicine: string;
	/** Default device labels per modality. */
	deviceInPerson: string;
	deviceTelemedicine: string;
	/** Engine/tech tag next to the modality selector. */
	engineInPerson: string;
	engineTelemedicine: string;
	audioStatus: Record<PreconsultationAudioStatus, string>;
	networkStatus: string;
	encryption: string;
	connectionStable: string;
}

export const PRECONSULTATION_ROOM_LABELS: PreconsultationRoomLabels = {
	brandName: "KTB Health",
	roomTitle: "Consultation Room",
	readyTitle: "Ready to start the consultation?",
	consentTitle: "Informed patient consent",
	consentDescription:
		"I declare that the patient was duly informed and consented to automated medical recording and transcription (in compliance with LGPD and CFM regulations).",
	changePatient: "Change",
	testAudio: "Test audio (3s)",
	testingAudio: "Testing audio…",
	calibratedAudio: "Audio calibrated",
	startSession: "Start Session",
	startingSession: "Starting recording & transcription…",
	secondaryAction: "Quick post-consultation dictation",
	modalityInPerson: "In-person consult",
	modalityTelemedicine: "Teleconsult",
	captureInPerson: "Room microphone active",
	captureTelemedicine: "Stereo capture (physician + meeting tab)",
	deviceInPerson: "Room microphone",
	deviceTelemedicine: "Meeting tab — audio only",
	engineInPerson: "Local Whisper · 48 kHz",
	engineTelemedicine: "Dual diarization · stereo loopback",
	audioStatus: {
		ready: "Audio ready",
		muted: "Microphone muted",
		testing: "Testing audio…",
		calibrated: "Audio calibrated",
	},
	networkStatus: "Network status",
	encryption: "End-to-end encrypted",
	connectionStable: "Stable connection",
};

/* --------------------------------- helpers --------------------------------- */

function initialsOf(name: string) {
	return (
		name
			.split(/\s+/)
			.filter(Boolean)
			.slice(0, 2)
			.map((part) => part[0])
			.join("")
			.toUpperCase() || "?"
	);
}

function useMergedLabels(
	labels?: Partial<PreconsultationRoomLabels>,
): PreconsultationRoomLabels {
	return React.useMemo(
		() => ({ ...PRECONSULTATION_ROOM_LABELS, ...labels }),
		[labels],
	);
}

/* --------------------------------- header ---------------------------------- */

export interface RoomHeaderProps extends React.ComponentProps<"header"> {
	physician: PreconsultationPhysician;
	brandName?: React.ReactNode;
	roomTitle?: React.ReactNode;
	/** Shown under the physician name (defaults to `physician.credentials`). */
	physicianMeta?: React.ReactNode;
	/** Connection status dot — `false` hides it. */
	connected?: boolean;
	connectionLabel?: string;
}

function RoomHeader({
	physician,
	brandName,
	roomTitle,
	physicianMeta,
	connected = true,
	connectionLabel = PRECONSULTATION_ROOM_LABELS.connectionStable,
	className,
	...props
}: RoomHeaderProps) {
	const initials = physician.initials ?? initialsOf(physician.name);
	return (
		<header
			data-slot="preconsultation-room-header"
			className={cn(
				"flex h-16 shrink-0 items-center justify-between border-b border-border/60 bg-background/90 px-6 backdrop-blur-md lg:px-10",
				className,
			)}
			{...props}
		>
			<div className="flex items-center gap-3">
				<div className="flex items-center gap-2.5">
					<div className="flex size-8 items-center justify-center rounded-lg border border-primary/30 bg-primary/10 text-primary shadow-sm">
						<StethoscopeIcon className="size-5" aria-hidden />
					</div>
					<span className="font-heading text-base font-bold tracking-tight lg:text-lg">
						{brandName ?? PRECONSULTATION_ROOM_LABELS.brandName}
					</span>
				</div>
				<span className="text-sm text-muted-foreground">/</span>
				<span className="text-xs font-medium text-muted-foreground lg:text-sm">
					{roomTitle ?? PRECONSULTATION_ROOM_LABELS.roomTitle}
				</span>
			</div>
			<div className="flex items-center gap-4">
				<div className="hidden flex-col text-right leading-tight sm:flex">
					<span className="text-xs font-semibold lg:text-sm">{physician.name}</span>
					{physicianMeta ?? physician.credentials ? (
						<span className="font-mono text-[11px] text-muted-foreground">
							{physicianMeta ?? physician.credentials}
						</span>
					) : null}
				</div>
				<div className="relative">
					<Avatar className="size-9 ring-2 ring-border/60">
						<AvatarFallback className="bg-primary/15 text-xs font-semibold text-primary">
							{initials}
						</AvatarFallback>
					</Avatar>
					{connected ? (
						<span
							title={connectionLabel}
							className="absolute -right-0.5 -bottom-0.5 size-2.5 rounded-full bg-success ring-2 ring-background"
						/>
					) : null}
				</div>
			</div>
		</header>
	);
}

/* ------------------------------ modality selector --------------------------- */

export interface ModalitySelectorProps
	extends Omit<React.ComponentProps<"div">, "onChange"> {
	modality: PreconsultationModality;
	onChange?: (modality: PreconsultationModality) => void;
	labels?: Partial<PreconsultationRoomLabels>;
}

const modalityOptionClass =
	"flex items-center gap-1.5 rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all";

function ModalitySelector({
	modality,
	onChange,
	labels,
	className,
	...props
}: ModalitySelectorProps) {
	const t = useMergedLabels(labels);
	const options: {
		value: PreconsultationModality;
		label: string;
		icon: React.ReactNode;
	}[] = [
		{ value: "in-person", label: t.modalityInPerson, icon: <StethoscopeIcon className="size-4" /> },
		{ value: "telemedicine", label: t.modalityTelemedicine, icon: <VideoIcon className="size-4" /> },
	];
	return (
		<div
			data-slot="preconsultation-modality-selector"
			role="radiogroup"
			aria-label="Consultation modality"
			className={cn(
				"inline-flex rounded-xl border border-border/60 bg-muted/60 p-1",
				className,
			)}
			{...props}
		>
			{options.map((option) => {
				const active = option.value === modality;
				return (
					<button
						key={option.value}
						type="button"
						role="radio"
						aria-checked={active}
						onClick={() => onChange?.(option.value)}
						className={cn(
							modalityOptionClass,
							active
								? "bg-primary font-semibold text-primary-foreground shadow-sm"
								: "text-muted-foreground hover:text-foreground",
						)}
					>
						{option.icon}
						{option.label}
					</button>
				);
			})}
		</div>
	);
}

/* --------------------------------- vu meter --------------------------------- */

const VU_BAR_HEIGHTS = ["h-3", "h-5", "h-4", "h-2"] as const;
const VU_BAR_DELAYS = ["animate-[pulse_0.9s_infinite]", "animate-[pulse_0.7s_infinite]", "animate-[pulse_1.1s_infinite]", "animate-[pulse_0.8s_infinite]"] as const;

export interface VuMeterProps extends React.ComponentProps<"div"> {
	/** 0–1 capture level. `undefined` renders the ambient demo animation. */
	level?: number;
	/** When false the bars render flat and still (muted / idle). */
	active?: boolean;
}

function VuMeter({ level, active = true, className, ...props }: VuMeterProps) {
	return (
		<div
			data-slot="preconsultation-vu-meter"
			aria-hidden
			className={cn(
				"flex items-center gap-1 rounded-full border border-border/50 bg-muted/60 px-2.5 py-2",
				className,
			)}
			{...props}
		>
			{VU_BAR_HEIGHTS.map((height, index) => {
				const animated = active && level === undefined;
				return (
					<span
						key={index}
						className={cn(
							"w-1 rounded-full",
							animated
								? cn(VU_BAR_DELAYS[index], index % 2 === 0 ? "bg-primary" : "bg-success")
								: "bg-border",
							!animated && active && "bg-success",
							!active && "opacity-50",
						)}
						style={
							level !== undefined
								? {
										height: `${Math.max(4, Math.min(20, level * 20 * (1 - index * 0.15)))}px`,
									}
								: undefined
						}
					>
						{level === undefined && !animated ? (
							<span className={cn("block w-full", height)} />
						) : null}
					</span>
				);
			})}
		</div>
	);
}

/* ----------------------------- control strip -------------------------------- */

export interface PreviewControlStripProps extends React.ComponentProps<"div"> {
	micMuted?: boolean;
	onMicToggle?: () => void;
	onSpeakerToggle?: () => void;
	onSettings?: () => void;
	micLabel?: string;
	speakerLabel?: string;
	settingsLabel?: string;
	vuLevel?: number;
	vuActive?: boolean;
}

function roundControlClass(active?: boolean, danger?: boolean) {
	return cn(
		"flex size-10 items-center justify-center rounded-full transition-all",
		active && !danger && "bg-muted text-success hover:bg-muted/80",
		danger && "bg-destructive/15 text-destructive hover:bg-destructive/25",
		!active && !danger && "bg-muted text-foreground hover:bg-muted/80",
	);
}

function PreviewControlStrip({
	micMuted = false,
	onMicToggle,
	onSpeakerToggle,
	onSettings,
	micLabel = "Toggle microphone",
	speakerLabel = "Speakers",
	settingsLabel = "Audio settings",
	vuLevel,
	vuActive,
	className,
	...props
}: PreviewControlStripProps) {
	return (
		<div
			data-slot="preconsultation-control-strip"
			className={cn(
				"flex items-center justify-center rounded-full border border-border/50 bg-background/85 px-4 py-2 shadow-xl backdrop-blur-md",
				className,
			)}
			{...props}
		>
			<button
				type="button"
				aria-label={micLabel}
				aria-pressed={micMuted}
				onClick={onMicToggle}
				className={cn(roundControlClass(!micMuted, micMuted), "relative")}
			>
				{micMuted ? <MicOffIcon className="size-5" /> : <MicIcon className="size-5" />}
				{!micMuted ? (
					<span className="absolute -top-0.5 -right-0.5 size-2.5 rounded-full bg-success" />
				) : null}
			</button>
			<button
				type="button"
				aria-label={speakerLabel}
				onClick={onSpeakerToggle}
				className={roundControlClass()}
			>
				<Volume2Icon className="size-5" />
			</button>
			<VuMeter level={vuLevel} active={vuActive ?? !micMuted} />
			<button
				type="button"
				aria-label={settingsLabel}
				onClick={onSettings}
				className={cn(roundControlClass(), "text-muted-foreground hover:text-foreground")}
			>
				<SettingsIcon className="size-5" />
			</button>
		</div>
	);
}

/* ------------------------------ preview screen ------------------------------ */

export interface AudioPreviewScreenProps extends React.ComponentProps<"div"> {
	status?: PreconsultationAudioStatus;
	/** e.g. "120 ms" — rendered next to the status label. */
	latencyLabel?: React.ReactNode;
	/** Device chip label (defaults to the modality-appropriate label). */
	deviceLabel?: React.ReactNode;
	/** Extra detail for the device chip (e.g. device kind). */
	deviceDetail?: React.ReactNode;
	/** Selectable capture devices — renders a picker when provided. */
	devices?: PreconsultationAudioDevice[];
	selectedDeviceId?: string;
	onDeviceChange?: (deviceId: string) => void;
	/** Center avatar initials + caption (defaults to the physician). */
	avatarInitials?: string;
	avatarCaption?: React.ReactNode;
	/** Whether the acoustic rings pulse (default: status !== "muted"). */
	pulsing?: boolean;
	micMuted?: boolean;
	onMicToggle?: () => void;
	onSpeakerToggle?: () => void;
	onAudioSettings?: () => void;
	vuLevel?: number;
	vuActive?: boolean;
	/** Quick audio test link under the screen. */
	onAudioTest?: () => void;
	testLabel?: React.ReactNode;
	labels?: Partial<PreconsultationRoomLabels>;
}

const STATUS_BADGE_CLASS: Record<PreconsultationAudioStatus, string> = {
	ready: "bg-success/10 text-success",
	calibrated: "bg-success/10 text-success",
	muted: "bg-destructive/10 text-destructive",
	testing: "bg-warning/10 text-warning",
};

function AudioPreviewScreen({
	status = "ready",
	latencyLabel,
	deviceLabel,
	deviceDetail,
	devices,
	selectedDeviceId,
	onDeviceChange,
	avatarInitials,
	avatarCaption,
	pulsing,
	micMuted = false,
	onMicToggle,
	onSpeakerToggle,
	onAudioSettings,
	vuLevel,
	vuActive,
	onAudioTest,
	testLabel,
	labels,
	className,
	...props
}: AudioPreviewScreenProps) {
	const t = useMergedLabels(labels);
	const resolvedDeviceLabel = deviceLabel ?? (deviceDetail ?? t.deviceInPerson);
	const ringsActive = pulsing ?? status !== "muted";
	return (
		<div className="flex w-full flex-col items-center">
			<div
				data-slot="preconsultation-preview-screen"
				className={cn(
					"relative flex aspect-video w-full max-h-[460px] flex-col justify-between overflow-hidden rounded-3xl border border-border/50 bg-muted/40 p-5 shadow-2xl",
					className,
				)}
				{...props}
			>
				{/* ambient glow */}
				<div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-muted/40 via-transparent to-background" />
				<div className="pointer-events-none absolute -top-24 -left-24 size-72 rounded-full bg-primary/10 blur-3xl" />
				<div className="pointer-events-none absolute -right-24 -bottom-24 size-72 rounded-full bg-success/10 blur-3xl" />

				{/* top row: status + device */}
				<div className="relative z-10 flex w-full items-center justify-between gap-2">
					<Badge
						variant="outline"
						className={cn("border-border/50 bg-background/80 backdrop-blur-md", STATUS_BADGE_CLASS[status])}
					>
						{status === "testing" ? (
							<LoaderCircleIcon className="animate-spin" />
						) : status === "muted" ? (
							<MicOffIcon />
						) : (
							<span className="relative flex size-2">
								<span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
								<span className="relative inline-flex size-2 rounded-full bg-success" />
							</span>
						)}
						{t.audioStatus[status]}
						{latencyLabel ? (
							<>
								<span className="text-muted-foreground">•</span>
								<span className="font-mono text-[11px] text-muted-foreground">{latencyLabel}</span>
							</>
						) : null}
					</Badge>
					{devices && devices.length > 0 ? (
						<Select
							value={selectedDeviceId}
							onValueChange={(value) => onDeviceChange?.(String(value))}
						>
							<SelectTrigger
								size="sm"
								className="h-7 max-w-56 rounded-full border-border/50 bg-background/80 px-3 text-xs backdrop-blur-md"
							>
								<SelectValue placeholder={String(resolvedDeviceLabel)} />
							</SelectTrigger>
							<SelectContent>
								{devices.map((device) => (
									<SelectItem key={device.id} value={device.id}>
										{device.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					) : (
						<button
							type="button"
							onClick={onDeviceChange ? () => onDeviceChange("") : undefined}
							className="flex h-7 max-w-56 items-center gap-1.5 rounded-full border border-border/50 bg-background/80 px-3 text-xs text-muted-foreground backdrop-blur-md transition-colors hover:text-foreground"
							title={typeof deviceDetail === "string" ? deviceDetail : undefined}
						>
							<span className="relative flex size-2 shrink-0">
								<span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
								<span className="relative inline-flex size-2 rounded-full bg-success" />
							</span>
							<span className="truncate">{resolvedDeviceLabel}</span>
							{onDeviceChange ? <ChevronDownIcon className="size-3.5 shrink-0" /> : null}
						</button>
					)}
				</div>

				{/* center: avatar + acoustic rings */}
				<div className="relative z-10 my-auto flex flex-col items-center justify-center">
					<div className="relative flex items-center justify-center">
						{ringsActive ? (
							<>
								<span className="absolute size-36 scale-125 animate-pulse rounded-full border border-primary/20" />
								<span className="absolute size-28 scale-110 rounded-full border border-success/30" />
								<span className="absolute size-24 rounded-full bg-primary/10" />
							</>
						) : null}
						<Avatar className="relative z-10 size-20 border-2 border-primary bg-muted shadow-xl">
							<AvatarFallback className="bg-transparent text-2xl font-bold tracking-tight text-primary">
								{avatarInitials ?? "?"}
							</AvatarFallback>
						</Avatar>
					</div>
					{avatarCaption ? (
						<div className="mt-3 text-center text-sm font-semibold">{avatarCaption}</div>
					) : null}
				</div>

				{/* bottom: floating control strip */}
				<div className="relative z-10 flex w-full flex-col items-center gap-2.5">
					<PreviewControlStrip
						micMuted={micMuted}
						onMicToggle={onMicToggle}
						onSpeakerToggle={onSpeakerToggle}
						onSettings={onAudioSettings}
						vuLevel={vuLevel}
						vuActive={vuActive}
					/>
					{onAudioTest ? (
						<button
							type="button"
							onClick={onAudioTest}
							className="text-xs font-medium text-primary underline-offset-2 hover:underline"
						>
							{testLabel ?? t.testAudio}
						</button>
					) : null}
				</div>
			</div>
		</div>
	);
}

/* -------------------------------- tech tag ---------------------------------- */

export interface PreviewTechTagProps extends React.ComponentProps<"span"> {
	label: React.ReactNode;
	/** Network latency chip value, e.g. 24 → "<24 ms". */
	latencyMs?: number | null;
	networkTooltip?: string;
}

function PreviewTechTag({
	label,
	latencyMs,
	networkTooltip,
	className,
	...props
}: PreviewTechTagProps) {
	return (
		<span
			data-slot="preconsultation-tech-tag"
			className={cn(
				"hidden items-center gap-1.5 rounded-lg border border-border/50 bg-muted/60 px-2.5 py-1 font-mono text-[11px] text-muted-foreground sm:flex",
				className,
			)}
			{...props}
		>
			{latencyMs != null ? (
				<Tooltip>
					<TooltipTrigger
						render={
							<span className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border/50 bg-muted px-2 py-0.5 text-success hover:border-border" />
						}
					>
						<span className="relative flex size-2">
							<span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
							<span className="relative inline-flex size-2 rounded-full bg-success" />
						</span>
						<WifiIcon className="size-3.5" />
						<span className="text-foreground">&lt;{latencyMs}ms</span>
					</TooltipTrigger>
					<TooltipContent>{networkTooltip ?? `Network: excellent (< ${latencyMs}ms)`}</TooltipContent>
				</Tooltip>
			) : null}
			{label}
		</span>
	);
}

/* ------------------------------ patient quick card --------------------------- */

export interface PatientQuickCardProps extends React.ComponentProps<"div"> {
	patient: PreconsultationPatient;
	onChange?: () => void;
	changeLabel?: string;
	ageSuffix?: string;
}

function PatientQuickCard({
	patient,
	onChange,
	changeLabel = PRECONSULTATION_ROOM_LABELS.changePatient,
	ageSuffix = "y",
	className,
	...props
}: PatientQuickCardProps) {
	const initials = patient.initials ?? initialsOf(patient.name);
	return (
		<div
			data-slot="preconsultation-patient-card"
			className={cn(
				"flex items-center justify-between gap-3 rounded-2xl border border-border/50 bg-muted/50 p-4 shadow-sm transition-colors hover:border-border",
				className,
			)}
			{...props}
		>
			<div className="flex min-w-0 items-center gap-3.5">
				<div className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border/50 bg-background text-base font-bold text-primary shadow-inner">
					{initials}
				</div>
				<div className="flex min-w-0 flex-col">
					<div className="flex items-center gap-2">
						<span className="truncate text-sm font-semibold">{patient.name}</span>
						{patient.age != null ? (
							<span className="shrink-0 text-xs text-muted-foreground">
								• {patient.age}
								{typeof patient.age === "number" ? ageSuffix : ""}
							</span>
						) : null}
					</div>
					{patient.condition ? (
						<div className="mt-0.5 truncate text-xs text-muted-foreground">
							{patient.condition}
						</div>
					) : null}
				</div>
			</div>
			<Button
				type="button"
				variant="outline"
				size="sm"
				onClick={onChange}
				className="shrink-0 gap-1 text-xs text-primary hover:text-primary"
			>
				<ArrowLeftRightIcon className="size-3.5" />
				{changeLabel}
			</Button>
		</div>
	);
}

/* --------------------------------- consent ---------------------------------- */

export interface ConsentBlockProps extends Omit<React.ComponentProps<"div">, "onChange" | "title"> {
	checked?: boolean;
	defaultChecked?: boolean;
	onCheckedChange?: (checked: boolean) => void;
	title?: React.ReactNode;
	description?: React.ReactNode;
	/** Footer line under the consent copy (e.g. regulation reference). */
	footer?: React.ReactNode;
}

function ConsentBlock({
	checked,
	defaultChecked = false,
	onCheckedChange,
	title = PRECONSULTATION_ROOM_LABELS.consentTitle,
	description = PRECONSULTATION_ROOM_LABELS.consentDescription,
	footer,
	className,
	...props
}: ConsentBlockProps) {
	const [isChecked, setIsChecked] = useControllableState({
		prop: checked,
		defaultProp: defaultChecked,
		onChange: onCheckedChange,
	});
	return (
		<div
			data-slot="preconsultation-consent"
			data-checked={isChecked || undefined}
			className={cn(
				"rounded-2xl border p-4 transition-all",
				isChecked
					? "border-primary/50 bg-muted"
					: "border-border/50 bg-muted/40",
				className,
			)}
			{...props}
		>
			<label className="flex cursor-pointer items-start gap-3 select-none">
				<Checkbox
					checked={isChecked}
					onCheckedChange={(next) => setIsChecked(next === true)}
					className="mt-0.5"
				/>
				<div className="flex flex-col gap-1 text-xs leading-relaxed text-muted-foreground">
					<span className="font-medium text-foreground">{title}</span>
					<span>{description}</span>
				</div>
			</label>
			{footer ? (
				<div className="mt-3 border-t border-border/40 pt-3 font-mono text-[11px] text-muted-foreground">
					{footer}
				</div>
			) : null}
		</div>
	);
}

/* -------------------------------- telemetry --------------------------------- */

export interface TelemetryBarProps extends React.ComponentProps<"div"> {
	telemetry?: PreconsultationTelemetry;
}

function TelemetryBar({ telemetry, className, ...props }: TelemetryBarProps) {
	const t = PRECONSULTATION_ROOM_LABELS;
	const latency =
		telemetry?.latencyLabel ??
		(telemetry?.latencyMs != null ? `<${telemetry.latencyMs}ms` : null);
	return (
		<div
			data-slot="preconsultation-telemetry"
			className={cn(
				"flex h-8 shrink-0 items-center justify-between border-t border-border/40 bg-muted/30 px-6 font-mono text-[11px] text-muted-foreground lg:px-10",
				className,
			)}
			{...props}
		>
			<div className="flex items-center gap-3">
				{telemetry?.version ? <span>{telemetry.version}</span> : null}
				{telemetry?.version ? <span>•</span> : null}
				{latency ? (
					<Tooltip>
						<TooltipTrigger
							render={
								<span className="flex cursor-pointer items-center gap-1.5 rounded-full border border-border/50 bg-muted px-2 py-0.5 text-success hover:border-border" />
							}
						>
							<span className="relative flex size-2">
								<span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
								<span className="relative inline-flex size-2 rounded-full bg-success" />
							</span>
							<WifiIcon className="size-3.5" />
							<span className="text-foreground">{latency}</span>
						</TooltipTrigger>
						<TooltipContent>{t.networkStatus}: {String(latency)}</TooltipContent>
					</Tooltip>
				) : null}
			</div>
			<div className="flex items-center gap-3">
				<LockIcon className="size-3" />
				<span>{telemetry?.encryptionLabel ?? t.encryption}</span>
			</div>
		</div>
	);
}

/* --------------------------------- composite -------------------------------- */

export interface PreconsultationRoomProps extends React.ComponentProps<"div"> {
	physician: PreconsultationPhysician;
	patient: PreconsultationPatient;
	/** Capture modality — first-class: telemedicine = meeting-tab audio only. */
	modality?: PreconsultationModality;
	defaultModality?: PreconsultationModality;
	onModalityChange?: (modality: PreconsultationModality) => void;
	/** Mic mute state — uncontrolled when omitted. */
	micMuted?: boolean;
	defaultMicMuted?: boolean;
	onMicToggle?: (muted: boolean) => void;
	/** Consent gate for the start button — uncontrolled when omitted. */
	consentChecked?: boolean;
	defaultConsentChecked?: boolean;
	onConsentChange?: (checked: boolean) => void;
	/** Capture audio status override; derived from mic/test state otherwise. */
	audioStatus?: PreconsultationAudioStatus;
	latencyLabel?: React.ReactNode;
	deviceLabel?: React.ReactNode;
	deviceDetail?: React.ReactNode;
	devices?: PreconsultationAudioDevice[];
	selectedDeviceId?: string;
	onDeviceChange?: (deviceId: string) => void;
	vuLevel?: number;
	/** Telemetry strip data. */
	telemetry?: PreconsultationTelemetry;
	/** Start CTA. Disabled until consent is checked. */
	onStart?: () => void;
	startLabel?: React.ReactNode;
	starting?: boolean;
	/** Secondary action (e.g. quick dictation). */
	onPostpone?: () => void;
	postponeLabel?: React.ReactNode;
	onChangePatient?: () => void;
	onAudioTest?: () => void;
	onSpeakerToggle?: () => void;
	onAudioSettings?: () => void;
	labels?: Partial<PreconsultationRoomLabels>;
}

function PreconsultationRoom({
	physician,
	patient,
	modality: controlledModality,
	defaultModality = "in-person",
	onModalityChange,
	micMuted: controlledMicMuted,
	defaultMicMuted = false,
	onMicToggle,
	consentChecked: controlledConsent,
	defaultConsentChecked = false,
	onConsentChange,
	audioStatus,
	latencyLabel,
	deviceLabel,
	deviceDetail,
	devices,
	selectedDeviceId,
	onDeviceChange,
	vuLevel,
	telemetry,
	onStart,
	startLabel,
	starting = false,
	onPostpone,
	postponeLabel,
	onChangePatient,
	onAudioTest,
	onSpeakerToggle,
	onAudioSettings,
	labels,
	className,
	...props
}: PreconsultationRoomProps) {
	const t = useMergedLabels(labels);

	const [modality, setModality] = useControllableState<PreconsultationModality>({
		prop: controlledModality,
		defaultProp: defaultModality,
		onChange: onModalityChange,
	});
	const [micMuted, setMicMuted] = useControllableState({
		prop: controlledMicMuted,
		defaultProp: defaultMicMuted,
		onChange: onMicToggle,
	});
	const [consent, setConsent] = useControllableState({
		prop: controlledConsent,
		defaultProp: defaultConsentChecked,
		onChange: onConsentChange,
	});

	// Local playback-test simulation: 3s "testing" → "calibrated" → back.
	const [testPhase, setTestPhase] = React.useState<"idle" | "testing" | "calibrated">("idle");
	const testTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
	React.useEffect(
		() => () => {
			if (testTimer.current) clearTimeout(testTimer.current);
		},
		[],
	);

	const isTelemedicine = modality === "telemedicine";
	const derivedStatus: PreconsultationAudioStatus =
		testPhase === "testing"
			? "testing"
			: testPhase === "calibrated"
				? "calibrated"
				: micMuted
					? "muted"
					: "ready";
	const status = audioStatus ?? derivedStatus;

	const resolvedDeviceLabel =
		deviceLabel ?? (isTelemedicine ? t.deviceTelemedicine : t.deviceInPerson);
	const resolvedDeviceDetail =
		deviceDetail ??
		(isTelemedicine ? t.captureTelemedicine : t.captureInPerson);
	const engineLabel = isTelemedicine ? t.engineTelemedicine : t.engineInPerson;
	const captureCaption = isTelemedicine ? t.captureTelemedicine : t.captureInPerson;

	function handleAudioTest() {
		if (testPhase !== "idle") return;
		setTestPhase("testing");
		testTimer.current = setTimeout(() => {
			setTestPhase("calibrated");
			testTimer.current = setTimeout(() => setTestPhase("idle"), 2200);
		}, 1800);
		onAudioTest?.();
	}

	const testButtonLabel =
		testPhase === "testing"
			? t.testingAudio
			: testPhase === "calibrated"
				? t.calibratedAudio
				: t.testAudio;

	const startButton = (
		<Button
			type="button"
			size="lg"
			disabled={!consent || starting}
			onClick={onStart}
			className="h-auto w-full justify-center gap-2.5 rounded-2xl py-3.5 text-sm font-semibold lg:text-base"
		>
			{starting ? (
				<LoaderCircleIcon className="size-5 animate-spin" />
			) : (
				<CheckIcon className="size-5" />
			)}
			{starting ? t.startingSession : (startLabel ?? t.startSession)}
		</Button>
	);

	return (
		<div
			data-slot="preconsultation-room"
			data-modality={modality}
			className={cn("flex h-full min-h-0 flex-col bg-background text-foreground", className)}
			{...props}
		>
			<RoomHeader
				physician={physician}
				brandName={t.brandName}
				roomTitle={t.roomTitle}
			/>

			<main className="mx-auto flex w-full max-w-[1440px] flex-1 flex-col justify-center overflow-hidden px-6 py-4 lg:px-12 lg:py-4">
				<div className="grid h-full max-h-[720px] grid-cols-1 items-center gap-8 lg:grid-cols-12 lg:gap-10">
					{/* left: media preview */}
					<div className="flex h-full flex-col items-center justify-center lg:col-span-7">
						<div className="mb-3 flex w-full items-center justify-between px-1">
							<ModalitySelector
								modality={modality}
								onChange={setModality}
								labels={labels}
							/>
							<PreviewTechTag
								label={engineLabel}
								latencyMs={telemetry?.latencyMs}
								networkTooltip={t.networkStatus}
							/>
						</div>
						<AudioPreviewScreen
							status={status}
							latencyLabel={latencyLabel}
							deviceLabel={resolvedDeviceLabel}
							deviceDetail={resolvedDeviceDetail}
							devices={devices}
							selectedDeviceId={selectedDeviceId}
							onDeviceChange={onDeviceChange}
							avatarInitials={physician.initials ?? initialsOf(physician.name)}
							avatarCaption={`${physician.name} (You)`}
							micMuted={micMuted}
							onMicToggle={() => setMicMuted(!micMuted)}
							onSpeakerToggle={onSpeakerToggle}
							onAudioSettings={onAudioSettings}
							vuLevel={vuLevel}
							onAudioTest={handleAudioTest}
							testLabel={testButtonLabel}
							labels={labels}
							className="max-h-full"
						/>
						<div className="mt-2.5 flex w-full items-center justify-between px-3 text-xs text-muted-foreground">
							<span className="flex items-center gap-1.5">
								<MonitorSmartphoneIcon className="size-3.5" />
								{captureCaption}
							</span>
							<Badge variant="outline" className="gap-1.5 border-border/50 font-mono text-[11px]">
								<ActivityIcon className="size-3" />
								{engineLabel}
							</Badge>
						</div>
					</div>

					{/* right: start card */}
					<div className="flex h-full flex-col justify-center lg:col-span-5">
						<div className="mx-auto flex w-full max-w-lg flex-col gap-4 lg:mx-0">
							<h2 className="font-heading text-2xl leading-snug font-bold tracking-tight">
								{t.readyTitle}
							</h2>
							<PatientQuickCard
								patient={patient}
								onChange={onChangePatient}
								changeLabel={t.changePatient}
							/>
							<ConsentBlock
								checked={consent}
								onCheckedChange={setConsent}
								title={t.consentTitle}
								description={t.consentDescription}
							/>
							<div className="flex flex-col gap-2.5 pt-1">
								{consent ? startButton : (
									<Tooltip>
										<TooltipTrigger render={<span className="block w-full" />}>
											{startButton}
										</TooltipTrigger>
										<TooltipContent>Check the consent box to enable</TooltipContent>
									</Tooltip>
								)}
								{onPostpone ? (
									<Button
										type="button"
										variant="outline"
										onClick={onPostpone}
										className="h-auto w-full justify-center gap-1.5 rounded-xl py-2.5 text-xs font-semibold text-muted-foreground hover:text-foreground"
									>
										<PencilLineIcon className="size-4" />
										{postponeLabel ?? t.secondaryAction}
									</Button>
								) : null}
							</div>
						</div>
					</div>
				</div>
			</main>

			<TelemetryBar telemetry={telemetry} />
		</div>
	);
}

export {
	PreconsultationRoom,
	AudioPreviewScreen,
	ConsentBlock,
	ModalitySelector,
	PatientQuickCard,
	PreviewControlStrip,
	PreviewTechTag,
	RoomHeader,
	TelemetryBar,
	VuMeter,
};
