import { describe, expect, it, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { SiteLoader } from "@/components/site-loader";
import Loading from "@/app/loading";

function setReadyState(state: DocumentReadyState) {
	Object.defineProperty(document, "readyState", { value: state, configurable: true });
}

describe("site loading animation", () => {
	beforeEach(() => {
		sessionStorage.clear();
		setReadyState("loading");
	});

	afterEach(() => {
		setReadyState("complete");
	});

	it("splash announces loading with wordmark and progress line", () => {
		render(<SiteLoader />);
		const status = screen.getByRole("status", { name: "Loading site" });
		expect(status).toBeInTheDocument();
		expect(screen.getByText("WinTuner")).toBeInTheDocument();
		expect(status.querySelector(".animate-site-loader-bar")).not.toBeNull();
	});

	it("skips the splash when the page already loaded", () => {
		setReadyState("complete");
		render(<SiteLoader />);
		expect(screen.queryByRole("status", { name: "Loading site" })).not.toBeInTheDocument();
	});

	it("root loading fallback renders the same editorial mark", () => {
		render(<Loading />);
		expect(screen.getByRole("status", { name: "Loading page" })).toBeInTheDocument();
	});
});
