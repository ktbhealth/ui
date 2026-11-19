"use client";

import * as React from "react";
import { HexColorPicker } from "react-colorful";
import { cn } from "cn";

import { Input } from "./input";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";

const CHECKERBOARD: React.CSSProperties = {
	backgroundImage:
		"conic-gradient(#d4d4d8 25%, transparent 0 50%, #d4d4d8 0 75%, transparent 0)",
	backgroundSize: "8px 8px",
};

let colorCanvas: HTMLCanvasElement | null = null;

function cssColorToHex(color: string): string | null {
	if (typeof document === "undefined" || color.trim() === "") {
		return null;
	}
	colorCanvas ??= document.createElement("canvas");
	const ctx = colorCanvas.getContext("2d");
	if (ctx === null) {
		return null;
	}
	ctx.fillStyle = "#000000";
	ctx.fillStyle = color;
	const serialized = ctx.fillStyle;
	return /^#[0-9a-f]{6}$/i.test(serialized) ? serialized.toLowerCase() : null;
}

export interface ColorPickerProps {
	/** Current color — any CSS color syntax (hex, rgb, hsl, oklch, …). */
	value?: string;
	/** Called with `#rrggbb` when the picker is used, or the raw text when typed. */
	onChange?: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	className?: string;
}

function ColorPicker({
	value = "",
	onChange,
	placeholder = "#000000",
	disabled = false,
	className,
}: ColorPickerProps) {
	const parsedHex = React.useMemo(() => cssColorToHex(value), [value]);
	const [pickerHex, setPickerHex] = React.useState(parsedHex ?? "#000000");
	const [text, setText] = React.useState(value);
	// Hex last emitted by the picker itself — while a parent update is
	// still in flight (startTransition below), `value` can echo back a
	// stale color; the guard keeps the picker from snapping backwards
	// mid-drag.
	const lastPickerEmit = React.useRef<string | null>(null);

	React.useEffect(() => {
		setText(value);
	}, [value]);

	React.useEffect(() => {
		if (parsedHex !== null && parsedHex !== lastPickerEmit.current) {
			lastPickerEmit.current = null;
			setPickerHex(parsedHex);
		}
	}, [parsedHex]);

	const commitText = (next: string) => {
		lastPickerEmit.current = null;
		setText(next);
		React.startTransition(() => onChange?.(next));
	};

	return (
		<Popover>
			<PopoverTrigger
				disabled={disabled}
				className={cn(
					"flex h-8 w-full min-w-0 items-center gap-2 rounded-lg border border-input bg-transparent px-2 text-left text-sm transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-input/30",
					className,
				)}
			>
				<span
					aria-hidden="true"
					className="size-4 shrink-0 rounded-sm border border-foreground/10"
					style={{ ...CHECKERBOARD, backgroundColor: value || "transparent" }}
				/>
				<span className="min-w-0 flex-1 truncate font-mono text-xs text-muted-foreground">
					{value === "" ? placeholder : value}
				</span>
			</PopoverTrigger>
			<PopoverContent align="start" className="w-64 gap-3">
				<HexColorPicker
					color={pickerHex}
					onChange={(hex) => {
						lastPickerEmit.current = hex;
						setPickerHex(hex);
						// Parent updates can be expensive (live token
						// re-derivation) — keep them off the picker's
						// critical path so dragging stays smooth.
						React.startTransition(() => onChange?.(hex));
					}}
				/>
				<Input
					value={text}
					onChange={(event) => commitText(event.target.value)}
					placeholder={placeholder}
					className="font-mono text-xs"
					aria-label="Color value"
				/>
			</PopoverContent>
		</Popover>
	);
}

export { ColorPicker };
export { cssColorToHex };
