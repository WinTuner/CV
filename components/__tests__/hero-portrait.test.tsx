import { describe, expect, it, vi, afterEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { HeroPortrait } from "@/components/hero/hero-portrait";
import { LanguageProvider } from "@/components/language-provider";

function mockMedia(query: string, matches: boolean) {
	window.matchMedia = vi.fn().mockImplementation((q: string) => ({
		matches: q === query ? matches : false,
		media: q,
		addEventListener: vi.fn(),
		removeEventListener: vi.fn(),
	})) as never;
}

function renderPortrait() {
	return render(
		<LanguageProvider initialLanguage="en">
			<HeroPortrait />
		</LanguageProvider>,
	);
}

function frameOf(container: HTMLElement) {
	return container.querySelector<HTMLElement>(".relative.overflow-hidden.border")!;
}

afterEach(() => {
	vi.restoreAllMocks();
});

describe("HeroPortrait tilt", () => {
	it("tilts the frame toward the pointer on fine pointers", () => {
		mockMedia("(pointer: fine)", true);
		vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
			cb(0);
			return 0;
		});
		const { container } = renderPortrait();
		const wrapper = container.querySelector<HTMLElement>("figure > div.relative")!;
		vi.spyOn(wrapper, "getBoundingClientRect");
		const frame = frameOf(container);
		vi.spyOn(frame, "getBoundingClientRect").mockReturnValue({
			left: 0,
			top: 0,
			right: 100,
			bottom: 100,
			width: 100,
			height: 100,
			x: 0,
			y: 0,
			toJSON: () => ({}),
		});
		fireEvent.mouseMove(wrapper, { clientX: 100, clientY: 0 });
		expect(frame.style.transform).toContain("rotateX(3");
		expect(frame.style.transform).toContain("rotateY(3");
	});

	it("resets the frame on mouse leave", () => {
		mockMedia("(pointer: fine)", true);
		vi.spyOn(window, "requestAnimationFrame").mockImplementation((cb) => {
			cb(0);
			return 0;
		});
		const { container } = renderPortrait();
		const wrapper = container.querySelector<HTMLElement>("figure > div.relative")!;
		const frame = frameOf(container);
		fireEvent.mouseMove(wrapper, { clientX: 50, clientY: 50 });
		fireEvent.mouseLeave(wrapper);
		expect(frame.style.transform).toBe("");
	});

	it("never tilts on coarse pointers", () => {
		mockMedia("(pointer: fine)", false);
		const { container } = renderPortrait();
		const wrapper = container.querySelector<HTMLElement>("figure > div.relative")!;
		const frame = frameOf(container);
		fireEvent.mouseMove(wrapper, { clientX: 100, clientY: 0 });
		expect(frame.style.transform).toBe("");
	});
});
