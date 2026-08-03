"use client"

import { useEffect, useRef } from "react"

/**
 * Cursor glow effect.
 *
 * Updates element styles directly via refs inside a single rAF per frame —
 * React state is not involved, so moving the mouse never re-renders the
 * component. Respects `prefers-reduced-motion` by keeping the effect
 * invisible for users who opt out of motion.
 */
export function CursorGlow() {
	const glowRef = useRef<HTMLDivElement>(null)
	const dotRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		const glow = glowRef.current
		const dot = dotRef.current
		if (!glow || !dot) return

		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			// Motion disabled — keep both elements hidden.
			glow.style.display = "none"
			dot.style.display = "none"
			return
		}

		let x = -400
		let y = -400
		let visible = false
		let hovering = false
		let frame = 0

		const apply = () => {
			frame = 0
			const translate = `translate(${x}px, ${y}px) translate(-50%, -50%)`
			glow.style.transform = translate
			dot.style.transform = translate
			glow.style.opacity = visible ? "1" : "0"
			dot.style.opacity = visible ? "0.15" : "0"
			glow.style.width = hovering ? "500px" : "400px"
			glow.style.height = hovering ? "500px" : "400px"
		}

		const onMouseMove = (e: MouseEvent) => {
			x = e.clientX
			y = e.clientY
			if (!frame) frame = requestAnimationFrame(apply)
			if (!visible) {
				visible = true
				if (frame) cancelAnimationFrame(frame)
				frame = requestAnimationFrame(apply)
			}
		}

		const onMouseOver = (e: MouseEvent) => {
			const target = e.target as HTMLElement
			hovering = !!target.closest(
				'a, button, [role="button"], input, textarea, select',
			)
			if (frame) cancelAnimationFrame(frame)
			frame = requestAnimationFrame(apply)
		}

		const onMouseLeave = () => {
			visible = false
			if (frame) cancelAnimationFrame(frame)
			frame = requestAnimationFrame(apply)
		}

		window.addEventListener("mousemove", onMouseMove, { passive: true })
		document.addEventListener("mouseover", onMouseOver, { passive: true })
		document.body.addEventListener("mouseleave", onMouseLeave)

		return () => {
			if (frame) cancelAnimationFrame(frame)
			window.removeEventListener("mousemove", onMouseMove)
			document.removeEventListener("mouseover", onMouseOver)
			document.body.removeEventListener("mouseleave", onMouseLeave)
		}
	}, [])

	return (
		<>
			<div ref={glowRef} className="cursor-glow hidden lg:block" />
			<div
				ref={dotRef}
				className="cursor-glow-dot hidden lg:block pointer-events-none fixed w-8 h-8 rounded-full mix-blend-screen"
			/>
		</>
	)
}
