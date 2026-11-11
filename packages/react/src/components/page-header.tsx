import * as React from "react";
import { cn } from "cn";

type PageHeaderProps = {
	title: React.ReactNode;
	description?: React.ReactNode;
	eyebrow?: React.ReactNode;
	icon?: React.ReactNode;
	actions?: React.ReactNode;
} & React.ComponentProps<"div">;

function PageHeader({
	className,
	title,
	description,
	eyebrow,
	icon,
	actions,
	...props
}: PageHeaderProps) {
	return (
		<div
			data-slot="page-header"
			className={cn("flex flex-wrap items-start justify-between gap-4", className)}
			{...props}
		>
			<div className="flex min-w-0 items-start gap-3">
				{icon ? (
					<div
						data-slot="page-header-icon"
						className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground [&_svg:not([class*='size-'])]:size-5"
					>
						{icon}
					</div>
				) : null}
				<div className="flex min-w-0 flex-col gap-1">
					{eyebrow ? (
						<p
							data-slot="page-header-eyebrow"
							className="text-xs font-medium tracking-wider text-muted-foreground uppercase"
						>
							{eyebrow}
						</p>
					) : null}
					<div
						data-slot="page-header-title"
						className="font-heading text-2xl font-semibold tracking-tight"
					>
						{title}
					</div>
					{description ? (
						<div
							data-slot="page-header-description"
							className="text-sm text-pretty text-muted-foreground"
						>
							{description}
						</div>
					) : null}
				</div>
			</div>
			{actions ? (
				<div
					data-slot="page-header-actions"
					className="flex shrink-0 flex-wrap items-center justify-end gap-2"
				>
					{actions}
				</div>
			) : null}
		</div>
	);
}

export { PageHeader };
export type { PageHeaderProps };
