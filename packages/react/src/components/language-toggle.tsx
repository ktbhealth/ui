"use client";

import * as React from "react";
import { LanguagesIcon } from "lucide-react";
import { Button } from "@ktbhealth/ui/components/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuTrigger,
} from "@ktbhealth/ui/components/dropdown-menu";

export interface LanguageToggleProps
	extends Omit<React.ComponentProps<typeof Button>, "children"> {
	/** Available locale codes, e.g. `["en", "pt-BR", "es"]`. */
	locales: readonly string[];
	/** Currently selected locale. */
	value: string;
	/** Called with the locale code when the user picks a new language. */
	onValueChange: (locale: string) => void;
	/** Display names keyed by locale code. Falls back to the code itself. */
	labels?: Record<string, string>;
	/** Accessible label for the icon-only trigger button. */
	label?: string;
	/** Alignment of the dropdown menu relative to the trigger. */
	align?: React.ComponentProps<typeof DropdownMenuContent>["align"];
}

function LanguageToggle({
	locales,
	value,
	onValueChange,
	labels,
	label = "Language",
	variant = "ghost",
	size = "icon-sm",
	align = "end",
	className,
	...props
}: LanguageToggleProps) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger
				render={
					<Button
						variant={variant}
						size={size}
						aria-label={label}
						className={className}
						{...props}
					>
						<LanguagesIcon />
					</Button>
				}
			/>
			<DropdownMenuContent align={align}>
				<DropdownMenuRadioGroup
					value={value}
					onValueChange={(locale) => onValueChange(String(locale))}
				>
					{locales.map((locale) => (
						<DropdownMenuRadioItem
							key={locale}
							value={locale}
							aria-current={locale === value ? "true" : undefined}
						>
							{labels?.[locale] ?? locale}
						</DropdownMenuRadioItem>
					))}
				</DropdownMenuRadioGroup>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

export { LanguageToggle };
