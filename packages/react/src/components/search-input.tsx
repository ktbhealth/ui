import * as React from "react";
import { SearchIcon } from "lucide-react";
import { cn } from "cn";

import { Input } from "./input.tsx";

type SearchInputProps = {
	/** Classes for the outer relative wrapper (width, margins). */
	className?: string;
	/** Classes merged onto the inner Input. */
	inputClassName?: string;
	/** Classes merged onto the search icon. */
	iconClassName?: string;
} & Omit<React.ComponentProps<"input">, "type" | "className">;

function SearchInput({ className, inputClassName, iconClassName, ...props }: SearchInputProps) {
	return (
		<div data-slot="search-input" className={cn("relative", className)}>
			<SearchIcon
				data-slot="search-input-icon"
				className={cn(
					"absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground",
					iconClassName,
				)}
			/>
			<Input type="search" className={cn("pl-8", inputClassName)} {...props} />
		</div>
	);
}

export { SearchInput };
export type { SearchInputProps };
