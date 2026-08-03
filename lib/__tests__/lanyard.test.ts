import { afterEach, describe, expect, it, vi } from "vitest"
import { fetchDiscordPresence } from "@/lib/lanyard"

const DISCORD_ID = "876802812510613546"

function jsonResponse(status: number, body: unknown) {
	return new Response(JSON.stringify(body), {
		status,
		headers: { "Content-Type": "application/json" },
	})
}

afterEach(() => {
	vi.restoreAllMocks()
})

describe("fetchDiscordPresence", () => {
	it("returns ok with the presence payload", async () => {
		const presence = {
			discord_status: "online",
			discord_user: {
				username: "wintuner",
				global_name: "Thanatphong Tarin",
				avatar: "abc",
				id: DISCORD_ID,
			},
			activities: [],
			listening_to_spotify: false,
		}
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(jsonResponse(200, { success: true, data: presence })),
		)

		const result = await fetchDiscordPresence(DISCORD_ID)
		expect(result).toEqual({ status: "ok", presence })
	})

	it("maps HTTP 404 to not-monitored", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(jsonResponse(404, {})),
		)

		const result = await fetchDiscordPresence(DISCORD_ID)
		expect(result).toEqual({ status: "not-monitored" })
	})

	it("maps user_not_monitored error to not-monitored", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(
				jsonResponse(200, {
					success: false,
					error: { code: "user_not_monitored", message: "User is not being monitored" },
				}),
			),
		)

		const result = await fetchDiscordPresence(DISCORD_ID)
		expect(result).toEqual({ status: "not-monitored" })
	})

	it("returns error for non-2xx responses", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(jsonResponse(500, {})),
		)

		const result = await fetchDiscordPresence(DISCORD_ID)
		expect(result.status).toBe("error")
		if (result.status === "error") {
			expect(result.message).toContain("500")
		}
	})

	it("returns error for network failures", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockRejectedValue(new TypeError("fetch failed")),
		)

		const result = await fetchDiscordPresence(DISCORD_ID)
		expect(result.status).toBe("error")
	})

	it("passes the AbortSignal through and rethrows AbortError", async () => {
		const controller = new AbortController()
		const fetchMock = vi.fn().mockRejectedValue(new DOMException("aborted", "AbortError"))
		vi.stubGlobal("fetch", fetchMock)

		await expect(fetchDiscordPresence(DISCORD_ID, controller.signal)).rejects.toThrow(
			"aborted",
		)
		expect(fetchMock).toHaveBeenCalledWith(
			`https://api.lanyard.rest/v1/users/${DISCORD_ID}`,
			expect.objectContaining({ signal: controller.signal }),
		)
	})
})
