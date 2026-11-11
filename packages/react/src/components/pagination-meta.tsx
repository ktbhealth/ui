import * as React from "react";
import { cn } from "cn";

type PaginationRangeValue = {
	from: number;
	to: number;
	total: number;
};

type PaginationRangeProps = {
	page: number;
	pageSize: number;
	total: number;
	formatRange?: (range: PaginationRangeValue) => React.ReactNode;
} & React.ComponentProps<"span">;

function PaginationRange({
	className,
	page,
	pageSize,
	total,
	formatRange,
	...props
}: PaginationRangeProps) {
	const safeTotal = Math.max(0, Math.floor(total));
	const safePage = Math.max(1, Math.floor(page));
	const safePageSize = Math.max(1, Math.floor(pageSize));
	const from = safeTotal === 0 ? 0 : (safePage - 1) * safePageSize + 1;
	const to = Math.min(safePage * safePageSize, safeTotal);
	const range: PaginationRangeValue =
		from > to ? { from: 0, to: 0, total: safeTotal } : { from, to, total: safeTotal };

	return (
		<span data-slot="pagination-range" className={cn(className)} {...props}>
			{formatRange
				? formatRange(range)
				: `Showing ${range.from}–${range.to} of ${range.total}`}
		</span>
	);
}

type PaginationMetaProps = {
	meta?: React.ReactNode;
} & React.ComponentProps<"div">;

function PaginationMeta({ className, meta, children, ...props }: PaginationMetaProps) {
	return (
		<div
			data-slot="pagination-meta"
			className={cn(
				"flex flex-wrap items-center justify-between gap-4 border-t px-3 py-2 text-xs text-muted-foreground",
				className,
			)}
			{...props}
		>
			{meta != null ? (
				<div data-slot="pagination-meta-info" className="min-w-0">
					{meta}
				</div>
			) : null}
			{children ? (
				<div data-slot="pagination-meta-actions" className="flex items-center gap-2">
					{children}
				</div>
			) : null}
		</div>
	);
}

export { PaginationMeta, PaginationRange };
export type { PaginationMetaProps, PaginationRangeProps, PaginationRangeValue };
