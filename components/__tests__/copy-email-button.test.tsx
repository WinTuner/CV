import { describe, expect, it, vi, afterEach } from "vitest";
import { render, fireEvent, act } from "@testing-library/react";
import { CopyEmailButton } from "@/components/copy-email-button";

const props = {
	email: "test@example.com",
	copyLabel: "Copy email",
	copiedLabel: "Email copied!",
};

afterEach(() => {
	vi.restoreAllMocks();
	vi.useRealTimers();
});

describe("CopyEmailButton", () => {
	it("copies via Clipboard API and announces via live region", async () => {
		const writeText = vi.fn().mockResolvedValue(undefined);
		Object.assign(navigator, { clipboard: { writeText } });
		vi.useFakeTimers();
		const { container } = render(<CopyEmailButton {...props} />);
		const button = container.querySelector("button")!;
		expect(button).toHaveAttribute("aria-label", "Copy email");
		await act(async () => {
			fireEvent.click(button);
		});
		expect(writeText).toHaveBeenCalledWith("test@example.com");
		expect(button).toHaveAttribute("aria-label", "Email copied!");
		expect(container.querySelector('[role="status"]')?.textContent).toBe(
			"Email copied!",
		);
		act(() => {
			vi.advanceTimersByTime(2000);
		});
		expect(button).toHaveAttribute("aria-label", "Copy email");
	});

	it("falls back to execCommand when Clipboard API fails", async () => {
		Object.assign(navigator, {
			clipboard: { writeText: vi.fn().mockRejectedValue(new Error("denied")) },
		});
		if (typeof document.execCommand !== "function") {
			Object.assign(document, { execCommand: vi.fn() });
		}
		const execSpy = vi
			.spyOn(document, "execCommand")
			.mockReturnValue(true);
		const { container } = render(<CopyEmailButton {...props} />);
		await act(async () => {
			fireEvent.click(container.querySelector("button")!);
		});
		expect(execSpy).toHaveBeenCalledWith("copy");
		expect(
			container.querySelector("button"),
		).toHaveAttribute("aria-label", "Email copied!");
	});
});
