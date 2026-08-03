import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { GithubIcon, LinkedinIcon } from "@/components/social-icons";

describe("social icons", () => {
	it("renders a GitHub SVG with currentColor fill and aria-hidden", () => {
		const { container } = render(<GithubIcon className="h-4 w-4" />);
		const svg = container.querySelector("svg");
		expect(svg).not.toBeNull();
		expect(svg).toHaveAttribute("aria-hidden", "true");
		expect(svg).toHaveAttribute("fill", "currentColor");
		expect(svg?.querySelector("path")).not.toBeNull();
		expect(svg?.getAttribute("class")).toContain("h-4");
	});

	it("renders a LinkedIn SVG", () => {
		const { container } = render(<LinkedinIcon />);
		expect(container.querySelector("svg path")).not.toBeNull();
	});

	it("passes through extra SVG props", () => {
		const { container } = render(<GithubIcon data-testid="gh" />);
		expect(container.querySelector('[data-testid="gh"]')).not.toBeNull();
	});
});
