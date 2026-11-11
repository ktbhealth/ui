import * as React from "react";
import { cn } from "cn";

type DataToolbarResultCount = {
	shown: number;
	total: number;
};

type DataToolbarProps = {
	search?: React.ReactNode;
	filters?: React.ReactNode;
	actions?: React.ReactNode;
	resultCount?: React.ReactNode | DataToolbarResultCount;
} & React.ComponentProps<"div">;

function DataToolbar({
	className,
	search,
	filters,
	actions,
	resultCount,
	...props
}: DataToolbarProps) {
	return (
		<div
			data-slot="data-toolbar"
			className={cn("flex flex-wrap items-center gap-2", className)}
			{...props}
		>
			{search || filters ? (
				<div
					data-slot="data-toolbar-filters"
					className="flex min-w-0 flex-1 flex-wrap items-center gap-2"
				>
					{search}
					{filters}
				</div>
			) : null}
			{resultCount != null || actions ? (
				<div
					data-slot="data-toolbar-actions"
					className="flex flex-wrap items-center justify-end gap-2"
				>
					{resultCount != null ? (
						<span
							data-slot="data-toolbar-count"
							className="text-xs text-muted-foreground"
						>
							{typeof resultCount === "object" &&
							"shown" in resultCount &&
							"total" in resultCount
								? `Showing ${resultCount.shown} of ${resultCount.total}`
								: resultCount}
						</span>
					) : null}
					{actions}
				</div>
			) : null}
		</div>
	);
}

export { DataToolbar };
export type { DataToolbarProps, DataToolbarResultCount };
