import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { renderTextWithLinks } from "@/lib/render-text-with-links";

describe("renderTextWithLinks", () => {
	it("returns plain text as-is when there are no links", () => {
		const text = "No links here";
		expect(renderTextWithLinks(text)).toBe(text);
	});

	it("renders a markdown link as an anchor with target=_blank", () => {
		const { container } = render(
			<>{renderTextWithLinks("[LINE OA](https://line.me/R/ti/p/%40636owbhl)")}</>,
		);
		const link = container.querySelector("a");
		expect(link).not.toBeNull();
		expect(link).toHaveAttribute("href", "https://line.me/R/ti/p/%40636owbhl");
		expect(link).toHaveAttribute("target", "_blank");
		expect(link).toHaveAttribute("rel", "noopener noreferrer");
		expect(link).toHaveTextContent("LINE OA");
	});

	it("keeps surrounding text intact around links", () => {
		const { container } = render(
			<>{renderTextWithLinks("Read [the docs](https://docs.example.com) today.")}</>,
		);
		const link = container.querySelector("a");
		expect(link).toHaveTextContent("the docs");
		expect(container.textContent).toContain("Read ");
		expect(container.textContent).toContain(" today.");
	});

	it("renders multiple links in a single string", () => {
		const { container } = render(
			<>{renderTextWithLinks("See [a](https://a.example) and [b](https://b.example).")}</>,
		);
		const links = container.querySelectorAll("a");
		expect(links).toHaveLength(2);
		expect(links[0]).toHaveTextContent("a");
		expect(links[1]).toHaveTextContent("b");
	});

	it("renders an empty string", () => {
		expect(renderTextWithLinks("")).toBe("");
	});
});
