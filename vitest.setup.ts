import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

// Node 26 defines a global (undefined) `localStorage`, which stops the jsdom
// environment from installing its own. Provide a minimal in-memory storage.
if (!globalThis.localStorage) {
	const store = new Map<string, string>();
	Object.defineProperty(globalThis, "localStorage", {
		configurable: true,
		value: {
			getItem: (key: string) => store.get(key) ?? null,
			setItem: (key: string, value: string) => void store.set(key, String(value)),
			removeItem: (key: string) => void store.delete(key),
			clear: () => store.clear(),
			key: (index: number) => [...store.keys()][index] ?? null,
			get length() {
				return store.size;
			},
		},
	});
}

// jsdom does not implement matchMedia; default to motion allowed so hooks
// can read it (individual tests override via vi.stubGlobal).
if (!window.matchMedia) {
	Object.defineProperty(window, "matchMedia", {
		writable: true,
		value: vi.fn().mockImplementation((query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addListener: vi.fn(),
			removeListener: vi.fn(),
			addEventListener: vi.fn(),
			removeEventListener: vi.fn(),
			dispatchEvent: vi.fn(),
		})),
	});
}
