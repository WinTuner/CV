import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
	return <div aria-hidden="true" className={cn("animate-pulse rounded bg-muted", className)} />;
}

export function PageHeaderSkeleton() {
	return (
		<div className="mb-12 space-y-4">
			<Skeleton className="h-12 w-64 rounded-lg" />
			<Skeleton className="h-6 w-96 rounded" />
		</div>
	);
}
