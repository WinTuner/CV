import { describe, expect, it, vi, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { SpotlightTracker } from "@/components/spotlight-tracker";

afterEach(() => {
	vi.restoreAllMocks();
});

describe("SpotlightTracker", () => {
	it("writes --mx/--my relative to the hovered card", () => {
		window.matchMedia = vi.fn().mockReturnValue({ matches: false }) as never;
		const { container } = render(
			<>
				<SpotlightTracker />
				<div className="spotlight-card" data-testid="card" />
			</>,
		);
		const card = container.querySelector<HTMLElement>('[data-testid="card"]')!;
		vi.spyOn(card, "getBoundingClientRect").mockReturnValue({
			left: 10,
			top: 20,
			right: 110,
			bottom: 120,
			width: 100,
			height: 100,
			x: 10,
			y: 20,
			toJSON: () => ({}),
		});
		fireEvent.mouseMove(card, { clientX: 60, clientY: 70 });
		expect(card.style.getPropertyValue("--mx")).toBe("50px");
		expect(card.style.getPropertyValue("--my")).toBe("50px");
	});

	it("skips the listener on coarse pointers", () => {
		window.matchMedia = vi.fn().mockReturnValue({ matches: true }) as never;
		const addSpy = vi.spyOn(document, "addEventListener");
		render(<SpotlightTracker />);
		expect(
			addSpy.mock.calls.some(([type]) => type === "mousemove"),
		).toBe(false);
	});
});
