import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteLoader } from "@/components/site-loader";
import Loading from "@/app/loading";

describe("site loading animation", () => {
	it("splash announces loading with wordmark and progress line", () => {
		render(<SiteLoader />);
		const status = screen.getByRole("status", { name: "Loading site" });
		expect(status).toBeInTheDocument();
		expect(screen.getByText("WinTuner")).toBeInTheDocument();
		expect(status.querySelector(".animate-site-loader-bar")).not.toBeNull();
	});

	it("root loading fallback renders the same editorial mark", () => {
		render(<Loading />);
		expect(screen.getByRole("status", { name: "Loading page" })).toBeInTheDocument();
	});
});
