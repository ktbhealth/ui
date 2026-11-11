import * as React from "react";
import { AlertDialog as AlertDialogPrimitive } from "@base-ui/react/alert-dialog";
import { cn } from "cn";

import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@ktbhealth/ui/components/alert-dialog";
import { Button } from "@ktbhealth/ui/components/button";
import { Spinner } from "@ktbhealth/ui/components/spinner";

type ConfirmDialogProps = {
	title: React.ReactNode;
	description?: React.ReactNode;
	confirmLabel?: React.ReactNode;
	cancelLabel?: React.ReactNode;
	variant?: "default" | "destructive";
	loading?: boolean;
	onConfirm: () => void | Promise<void>;
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?: (open: boolean) => void;
	className?: string;
} & Omit<AlertDialogPrimitive.Root.Props, "open" | "defaultOpen" | "onOpenChange" | "children">;

function ConfirmDialog({
	className,
	title,
	description,
	confirmLabel = "Confirm",
	cancelLabel = "Cancel",
	variant = "default",
	loading = false,
	onConfirm,
	open,
	defaultOpen,
	onOpenChange,
	...props
}: ConfirmDialogProps) {
	const [pending, setPending] = React.useState(false);
	const busy = pending || loading;

	const handleConfirm = async () => {
		if (busy) return;
		setPending(true);
		try {
			await onConfirm();
			onOpenChange?.(false);
		} catch {
			// Errors are the consumer's responsibility — keep the dialog open.
		} finally {
			setPending(false);
		}
	};

	return (
		<AlertDialog
			open={open}
			defaultOpen={defaultOpen}
			onOpenChange={onOpenChange}
			{...props}
		>
			<AlertDialogContent className={cn(className)} data-slot="confirm-dialog-content">
				<AlertDialogHeader>
					<AlertDialogTitle>{title}</AlertDialogTitle>
					{description ? (
						<AlertDialogDescription>{description}</AlertDialogDescription>
					) : null}
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel disabled={busy}>{cancelLabel}</AlertDialogCancel>
					<Button
						data-slot="confirm-dialog-action"
						variant={variant === "destructive" ? "destructive" : "default"}
						disabled={busy}
						onClick={() => {
							void handleConfirm();
						}}
					>
						{busy ? <Spinner /> : null}
						{confirmLabel}
					</Button>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}

export { ConfirmDialog };
export type { ConfirmDialogProps };
