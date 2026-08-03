export interface LanyardPresence {
  discord_status: "online" | "idle" | "dnd" | "offline"
  discord_user: {
    username: string
    global_name: string
    avatar: string
    id: string
  }
  activities: Array<{
    name: string
    type: number
    details?: string
    state?: string
    assets?: {
      large_image?: string
      large_text?: string
      small_image?: string
      small_text?: string
    }
    timestamps?: {
      start?: number
      end?: number
    }
  }>
  listening_to_spotify: boolean
  spotify?: {
    track_id: string
    song: string
    artist: string
    album: string
    album_art_url: string
  }
}

export type DiscordPresenceResult =
  | { status: "ok"; presence: LanyardPresence }
  | { status: "not-monitored" }
  | { status: "error"; message: string }

const LANYARD_API = "https://api.lanyard.rest/v1/users"

/**
 * Fetch a Discord user's live presence from Lanyard.
 *
 * Lanyard only tracks users who joined its Discord server
 * (https://discord.gg/WwBvqKjSne); unmonitored users return
 * `user_not_monitored` — surfaced here as a distinct status so the UI
 * can explain the fix instead of showing a fake offline state.
 */
export async function fetchDiscordPresence(
  userId: string,
  signal?: AbortSignal,
): Promise<DiscordPresenceResult> {
  try {
    const response = await fetch(`${LANYARD_API}/${userId}`, {
      signal,
      headers: { Accept: "application/json" },
    })

    if (response.status === 404) {
      return { status: "not-monitored" }
    }

    if (!response.ok) {
      return { status: "error", message: `Lanyard API ${response.status}` }
    }

    const payload = (await response.json()) as {
      success: boolean
      data?: LanyardPresence
      error?: { code?: string; message?: string }
    }

    if (!payload.success || !payload.data) {
      if (payload.error?.code === "user_not_monitored") {
        return { status: "not-monitored" }
      }
      return {
        status: "error",
        message: payload.error?.message ?? "Unexpected Lanyard response",
      }
    }

    return { status: "ok", presence: payload.data }
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error
    }
    return {
      status: "error",
      message: error instanceof Error ? error.message : "Network error",
    }
  }
}
