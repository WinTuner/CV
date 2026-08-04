import { afterEach, describe, expect, it, vi } from "vitest";
import { act, render, screen } from "@testing-library/react";
import { useInView } from "@/lib/use-in-view";

function Probe({ threshold = 0.1 }: { threshold?: number }) {
	const { ref, isInView } = useInView<HTMLDivElement>({ threshold });
	return (
		<div ref={ref} data-testid="probe">
			{isInView ? "visible" : "hidden"}
		</div>
	);
}

class MockIntersectionObserver {
	callback: IntersectionObserverCallback;
	elements: Element[] = [];

	constructor(callback: IntersectionObserverCallback) {
		this.callback = callback;
	}

	observe(element: Element) {
		this.elements.push(element);
	}

	unobserve() {}

	disconnect() {
		this.elements = [];
	}

	/** Test helper: fire an intersection with `isIntersecting`. */
	intersect(isIntersecting: boolean) {
		this.callback(
			this.elements.map((target) => ({
				target,
				isIntersecting,
			})) as IntersectionObserverEntry[],
			this as unknown as IntersectionObserver,
		);
	}
}

function installMockIntersectionObserver() {
	const instances: MockIntersectionObserver[] = [];
	// IntersectionObserver is invoked with `new`; an arrow-function mock
	// throws "is not a constructor". Use a regular function that hands each
	// construction its own observer capturing the component's callback.
	vi.stubGlobal(
		"IntersectionObserver",
		vi.fn(function (callback: IntersectionObserverCallback) {
			const instance = new MockIntersectionObserver(callback);
			instances.push(instance);
			return instance;
		}),
	);
	return {
		intersect(isIntersecting: boolean) {
			for (const instance of instances) instance.intersect(isIntersecting);
		},
	};
}

afterEach(() => {
	vi.unstubAllGlobals();
	vi.restoreAllMocks();
});

describe("useInView", () => {
	it("starts hidden and flips to visible on intersection", async () => {
		const observer = installMockIntersectionObserver();
		render(<Probe />);

		expect(screen.getByTestId("probe")).toHaveTextContent("hidden");

		await act(async () => {
			observer.intersect(true);
		});
		expect(screen.getByTestId("probe")).toHaveTextContent("visible");
	});

	it("respects prefers-reduced-motion and shows content immediately", () => {
		installMockIntersectionObserver();
		vi.stubGlobal(
			"matchMedia",
			vi
				.fn()
				.mockReturnValue({
					matches: true,
					addListener: vi.fn(),
					removeListener: vi.fn(),
				}),
		);

		render(<Probe />);
		expect(screen.getByTestId("probe")).toHaveTextContent("visible");
	});
});
