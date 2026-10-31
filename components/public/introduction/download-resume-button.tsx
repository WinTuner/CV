"use client";

import { useState } from "react";
import { FileDown, Loader2 } from "lucide-react";
import type { SupportedLanguageCode } from "@/constants/languages";

interface DownloadResumeButtonProps {
	targetRef: { current: HTMLDivElement | null };
	language: SupportedLanguageCode;
}

// Matches the light-theme `--background` token, so the PDF is not tinted.
const LIGHT_BG = "#f7f3ff";

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
		// `content-visibility: auto` skips painting offscreen sections, which made
		// html2canvas overlap or drop cards (and their photos) in the PDF. Force
		// every section to render for the duration of the capture.
		const exportStyle = document.createElement("style");
		exportStyle.textContent =
			".content-visibility-auto{content-visibility:visible!important;contain-intrinsic-size:auto!important}";
		document.head.appendChild(exportStyle);

		try {
			const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
				import("html2canvas-pro"),
				import("jspdf"),
			]);

			// Let the forced layout settle before measuring element edges.
			await new Promise((resolve) => requestAnimationFrame(resolve));

			const sourceRect = element.getBoundingClientRect();
			const canvas = await html2canvas(element, {
				scale: 2,
				backgroundColor: LIGHT_BG,
				useCORS: true,
				imageTimeout: 10_000,
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
			// Keep a printable margin: cards and photos must never touch the page edge,
			// otherwise their rounded borders appear sliced off.
			const margin = 12;
			const contentWidth = pageWidth - margin * 2;
			const contentHeight = pageHeight - margin * 2;
			const pagePx = Math.round((canvas.width * contentHeight) / contentWidth);

			// Snap page breaks to card/section edges so photos and text blocks are
			// not sliced in half. Positions are in canvas pixels.
			const scaleY = canvas.height / sourceRect.height;
			const breakpoints: number[] = [];
			// Cards and media must never be cut, so a break inside one is rejected.
			const protectedRanges: Array<[number, number]> = [];
			for (const node of element.querySelectorAll(
				"article, section, figure, img, li, h2, h3, table",
			)) {
				const rect = node.getBoundingClientRect();
				if (rect.height < 1) continue;
				const top = Math.round((rect.top - sourceRect.top) * scaleY);
				const bottom = Math.round((rect.bottom - sourceRect.top) * scaleY);
				breakpoints.push(top);
				// Headings only offer a break *before* themselves, so they never sit
				// alone at the bottom of a page.
				if (!/^H[23]$/.test(node.tagName)) breakpoints.push(bottom);
				if (node.matches("article, figure, img, table")) {
					protectedRanges.push([top, bottom]);
				}
			}
			breakpoints.sort((a, b) => a - b);

			const isInsideBlock = (point: number) =>
				protectedRanges.some(([top, bottom]) => point > top && point < bottom);

			let offset = 0;
			while (offset < canvas.height) {
				let end = Math.min(offset + pagePx, canvas.height);
				if (end < canvas.height) {
					// Never break in the top 45% of a page: prefer a slightly fuller
					// page over a near-empty one.
					const minBreak = offset + pagePx * 0.55;
					const snapped = breakpoints
						.filter(
							(point) =>
								point >= minBreak && point <= end && !isInsideBlock(point),
						)
						.pop();
					if (snapped !== undefined) end = snapped;
				}

				const sliceHeight = end - offset;
				const slice = document.createElement("canvas");
				slice.width = canvas.width;
				slice.height = sliceHeight;
				const ctx = slice.getContext("2d");
				if (!ctx) throw new Error("Canvas 2D context unavailable");
				ctx.fillStyle = LIGHT_BG;
				ctx.fillRect(0, 0, canvas.width, sliceHeight);
				ctx.drawImage(canvas, 0, offset, canvas.width, sliceHeight, 0, 0, canvas.width, sliceHeight);

				// Paint the page, then the slice inside the margins.
				pdf.setFillColor(247, 243, 255);
				pdf.rect(0, 0, pageWidth, pageHeight, "F");
				pdf.addImage(
					slice.toDataURL("image/jpeg", 0.92),
					"JPEG",
					margin,
					margin,
					contentWidth,
					(contentHeight * sliceHeight) / pagePx,
				);

				offset = end;
				if (offset < canvas.height) pdf.addPage();
			}

			pdf.save(`WinTuner-Resume-${language.toUpperCase()}.pdf`);
		} catch (error) {
			console.error("Failed to generate resume PDF:", error);
		} finally {
			exportStyle.remove();
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
				{language === "th"
					? "ดาวน์โหลด PDF"
					: language === "ja"
						? "PDFをダウンロード"
						: language === "zh"
							? "下载 PDF"
							: "Download PDF"}
			</span>
		</button>
	);
}
