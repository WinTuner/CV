"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Copy } from "lucide-react";
import { cn } from "@/lib/utils";

interface CopyEmailButtonProps {
	email: string;
	copyLabel: string;
	copiedLabel: string;
	className?: string;
	iconClassName?: string;
}

/**
 * One-click email copy with screen-reader announcement.
 *
 * Uses the async Clipboard API with a textarea+execCommand fallback for
 * non-secure contexts. Feedback is icon swap + polite live region (no
 * layout shift, no toast overlay to manage).
 */
export function CopyEmailButton({
	email,
	copyLabel,
	copiedLabel,
	className,
	iconClassName = "h-4 w-4",
}: CopyEmailButtonProps) {
	const [copied, setCopied] = useState(false);
	const timer = useRef(0);

	useEffect(() => () => window.clearTimeout(timer.current), []);

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(email);
		} catch {
			// Best-effort fallback for non-secure contexts.
			try {
				const ta = document.createElement("textarea");
				ta.value = email;
				ta.setAttribute("readonly", "");
				ta.style.position = "absolute";
				ta.style.opacity = "0";
				document.body.appendChild(ta);
				ta.select();
				document.execCommand?.("copy");
				document.body.removeChild(ta);
			} catch {
				// Clipboard unavailable — still show feedback.
			}
		}
		setCopied(true);
		window.clearTimeout(timer.current);
		timer.current = window.setTimeout(() => setCopied(false), 2000);
	};

	return (
		<button
			type="button"
			onClick={copy}
			title={copied ? copiedLabel : copyLabel}
			aria-label={copied ? copiedLabel : copyLabel}
			className={cn(
				"inline-flex items-center justify-center text-muted-foreground transition-colors duration-300 hover:text-primary",
				className,
			)}
		>
			{copied ? (
				<Check className={cn(iconClassName, "text-primary")} aria-hidden="true" />
			) : (
				<Copy className={iconClassName} aria-hidden="true" />
			)}
			<span role="status" aria-live="polite" className="sr-only">
				{copied ? copiedLabel : ""}
			</span>
		</button>
	);
}
