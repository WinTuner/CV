"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";

interface DownloadResumeButtonProps {
	targetRef: { current: HTMLDivElement | null };
	language: "en" | "th";
}

/**
 * Generates a real PDF file client-side by rasterizing the resume content.
 * The heavy libraries (html2canvas + jspdf) are only downloaded when the
 * button is clicked, so they never touch the initial page bundle.
 */
export function DownloadResumeButton({
	targetRef,
	language,
}: DownloadResumeButtonProps) {
	const [isGenerating, setIsGenerating] = useState(false);

	const handleDownload = async () => {
		const element = targetRef.current;
		if (!element || isGenerating) return;

		setIsGenerating(true);
		try {
			const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
				import("html2canvas-pro"),
				import("jspdf"),
			]);

			const canvas = await html2canvas(element, {
				scale: 2,
				backgroundColor: "#f2fbff",
				useCORS: true,
				ignoreElements: (el) =>
					el instanceof HTMLElement && el.hasAttribute("data-pdf-ignore"),
				onclone: (clonedDoc) => {
					// Force the light palette for the captured copy so the PDF
					// looks identical whether or not the visitor is in dark mode.
					clonedDoc.documentElement.classList.remove("dark");
				},
			});

			const pdf = new jsPDF({
				unit: "mm",
				format: "a4",
				orientation: "portrait",
			});

			const pageWidth = 210;
			const pageHeight = 297;
			const pagePx = Math.round((canvas.width * pageHeight) / pageWidth);

			let offset = 0;
			while (offset < canvas.height) {
				const sliceHeight = Math.min(pagePx, canvas.height - offset);
				const slice = document.createElement("canvas");
				slice.width = canvas.width;
				slice.height = sliceHeight;
				const ctx = slice.getContext("2d");
				if (!ctx) throw new Error("Canvas 2D context unavailable");
				ctx.fillStyle = "#f2fbff";
				ctx.fillRect(0, 0, canvas.width, sliceHeight);
				ctx.drawImage(canvas, 0, offset, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

				pdf.addImage(
					slice.toDataURL("image/jpeg", 0.92),
					"JPEG",
					0,
					0,
					pageWidth,
					(pageHeight * sliceHeight) / pagePx,
				);

				offset += pagePx;
				if (offset < canvas.height) pdf.addPage();
			}

			pdf.save(`WinTuner-Resume-${language.toUpperCase()}.pdf`);
		} catch (error) {
			console.error("Failed to generate resume PDF:", error);
		} finally {
			setIsGenerating(false);
		}
	};

	return (
		<button
			type="button"
			onClick={handleDownload}
			disabled={isGenerating}
			className="group flex items-center gap-3 rounded-lg border border-border/50 bg-card/50 px-4 py-3 transition-all duration-300 hover:border-primary/50 hover:bg-card print:hidden disabled:cursor-wait disabled:opacity-60 cursor-pointer"
		>
			{isGenerating ? (
				<Loader2 className="h-4 w-4 animate-spin text-primary" />
			) : (
				<FileDown className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
			)}
			<span className="text-sm text-muted-foreground font-semibold group-hover:text-foreground truncate">
				{language === "th" ? "ดาวน์โหลด PDF" : "Download PDF"}
			</span>
		</button>
	);
}
