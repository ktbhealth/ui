"use client";

import {
	Combobox,
	ComboboxContent,
	ComboboxEmpty,
	ComboboxInput,
	ComboboxItem,
	ComboboxList,
} from "@ktbhealth/ui/components/combobox";

export interface SearchableSelectItem {
	readonly value: string;
	readonly label: string;
}

/**
 * Single-select combobox for long option lists — the input doubles as
 * trigger and search filter, so dozens of rows stay usable where a
 * plain `Select` dropdown would not. Options are flat `{value, label}`
 * pairs; filtering is case-insensitive substring on the label.
 *
 * `value` is the selected item's `value` or null when nothing is
 * selected (the input then shows `placeholder`). `clearable` renders
 * the clear affordance so the user can return to the null state.
 */
function SearchableSelect({
	items,
	value,
	onValueChange,
	placeholder,
	emptyMessage,
	id,
	ariaLabel,
	ariaLabelledby,
	disabled = false,
	clearable = false,
	className,
}: {
	readonly items: readonly SearchableSelectItem[];
	readonly value: string | null;
	readonly onValueChange: (value: string | null) => void;
	readonly placeholder: string;
	readonly emptyMessage: string;
	readonly id?: string;
	readonly ariaLabel?: string;
	readonly ariaLabelledby?: string;
	readonly disabled?: boolean;
	readonly clearable?: boolean;
	readonly className?: string;
}) {
	const selected = items.find((item) => item.value === value) ?? null;

	return (
		<Combobox
			items={items}
			value={selected}
			onValueChange={(item: SearchableSelectItem | null) => onValueChange(item?.value ?? null)}
			itemToStringLabel={(item: SearchableSelectItem) => item.label}
			isItemEqualToValue={(a: SearchableSelectItem, b: SearchableSelectItem) => a.value === b.value}
			filter={(item: SearchableSelectItem, query: string) =>
				item.label.toLowerCase().includes(query.trim().toLowerCase())
			}
			autoHighlight
		>
			<ComboboxInput
				id={id}
				aria-label={ariaLabel}
				aria-labelledby={ariaLabelledby}
				placeholder={placeholder}
				disabled={disabled}
				showClear={clearable}
				className={className}
			/>
			<ComboboxContent>
				<ComboboxEmpty>{emptyMessage}</ComboboxEmpty>
				<ComboboxList>
					{(item: SearchableSelectItem) => (
						<ComboboxItem key={item.value} value={item}>
							{item.label}
						</ComboboxItem>
					)}
				</ComboboxList>
			</ComboboxContent>
		</Combobox>
	);
}

export { SearchableSelect };
