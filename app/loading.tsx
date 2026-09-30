/**
 * Root loading fallback — same minimal editorial language as the
 * `SiteLoader` splash (serif mark + thin progress line), rendered inline
 * while a route segment streams in.
 */
export default function Loading() {
	return (
		<div
			role="status"
			aria-label="Loading page"
			aria-busy="true"
			className="mx-auto flex min-h-[50vh] max-w-4xl flex-col items-center justify-center gap-5 px-4 py-20"
		>
			<p className="font-serif text-3xl tracking-tight text-foreground">WinTuner</p>
			<p className="font-mono text-[11px] uppercase tracking-[0.3em] text-muted-foreground">
				loading
			</p>
			<div className="h-px w-40 overflow-hidden bg-border">
				<div className="h-full w-full origin-left animate-site-loader-bar bg-primary" />
			</div>
		</div>
	);
}
