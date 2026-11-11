import * as React from "react";
import { cn } from "cn";

function PageContainer({ className, ...props }: React.ComponentProps<"div">) {
	return (
		<div
			data-slot="page-container"
			className={cn("mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6", className)}
			{...props}
		/>
	);
}

export { PageContainer };
