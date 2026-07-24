"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

export const DISCORD_ID = "876802812510613546" 

interface LanyardPresence {
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

export function DiscordStatus() {
  const [data, setData] = useState<LanyardPresence | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    let socket: WebSocket | null = null
    let heartbeatInterval: NodeJS.Timeout | null = null

    const connectWebSocket = () => {
      socket = new WebSocket("wss://api.lanyard.rest/socket")

      socket.onopen = () => {
        console.log("Lanyard WebSocket connected")
      }

      socket.onmessage = (event) => {
        const payload = JSON.parse(event.data)

        if (payload.op === 1) {
          // Hello message, set up heartbeat
          const interval = payload.d.heartbeat_interval
          heartbeatInterval = setInterval(() => {
            if (socket && socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ op: 3 }))
            }
          }, interval)

          // Subscribe to user presence
          socket.send(
            JSON.stringify({
              op: 2,
              d: {
                subscribe_to_id: DISCORD_ID,
              },
            })
          )
        } else if (payload.op === 0) {
          // Event messages
          if (payload.t === "INIT_STATE" || payload.t === "PRESENCE_UPDATE") {
            setData(payload.d)
          }
        }
      }

      socket.onclose = () => {
        console.log("Lanyard WebSocket closed. Reconnecting in 5 seconds...")
        if (heartbeatInterval) {
          clearInterval(heartbeatInterval)
        }
        setTimeout(connectWebSocket, 5000)
      }

      socket.onerror = (error) => {
        console.error("Lanyard WebSocket error:", error)
        socket?.close()
      }
    }

    connectWebSocket()

    return () => {
      if (heartbeatInterval) {
        clearInterval(heartbeatInterval)
      }
      if (socket) {
        socket.close()
      }
    }
  }, [])

  if (!mounted || !data) {
    return (
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 text-[11px] font-mono text-muted-foreground">
        <span className="h-1.5 w-1.5 rounded-full bg-zinc-500 animate-pulse" />
        <span>discord: loading</span>
      </div>
    )
  }

  const statusColors = {
    online: "bg-emerald-500",
    idle: "bg-amber-500",
    dnd: "bg-rose-500",
    offline: "bg-zinc-500",
  }

  const statusLabels = {
    online: "online",
    idle: "away",
    dnd: "do not disturb",
    offline: "offline",
  }

  const status = data.discord_status
  const colorClass = statusColors[status] || "bg-zinc-500"
  
  // Find current active game/coding activity (excluding Spotify)
  const activeActivity = data.activities.find(act => act.type !== 2) // type 2 is Spotify
  
  // Get active activity text
  let activityText = ""
  if (data.listening_to_spotify && data.spotify) {
    activityText = `Listening to Spotify: ${data.spotify.song}`
  } else if (activeActivity) {
    activityText = `${activeActivity.name === "Visual Studio Code" ? "Coding" : "Playing"} ${activeActivity.name}`
  }

  return (
    <div className="group relative flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-secondary/50 border border-border/50 text-[11px] font-mono text-muted-foreground transition-all duration-300 hover:border-primary/30 hover:bg-secondary/80 cursor-pointer">
      <span className="relative flex h-1.5 w-1.5">
        {status !== "offline" && (
          <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-75", colorClass)} />
        )}
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", colorClass)} />
      </span>
      <span>
        discord: <span className="text-foreground font-semibold">{statusLabels[status]}</span>
      </span>

      {/* Popover / Tooltip dropdown */}
      <div className="absolute top-full mt-2 right-0 md:left-1/2 md:right-auto md:-translate-x-1/2 z-50 w-64 rounded-xl border border-border bg-card/95 glass p-4 shadow-2xl opacity-0 scale-95 pointer-events-none group-hover:opacity-100 group-hover:scale-100 transition-all duration-300 transform origin-top select-none">
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative h-10 w-10 shrink-0 rounded-full overflow-hidden border border-border bg-secondary">
            {data.discord_user.avatar ? (
              <img
                src={`https://cdn.discordapp.com/avatars/${data.discord_user.id}/${data.discord_user.avatar}.png?size=80`}
                alt={data.discord_user.username}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="h-full w-full bg-primary/20 text-primary flex items-center justify-center font-bold text-sm">
                {data.discord_user.username.slice(0, 2).toUpperCase()}
              </div>
            )}
            <span className={cn("absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-card", colorClass)} />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate">
              {data.discord_user.global_name || data.discord_user.username}
            </p>
            <p className="text-[10px] text-muted-foreground truncate">
              @{data.discord_user.username}
            </p>
          </div>
        </div>

        {/* Activity Section */}
        {activityText && (
          <div className="mt-3 pt-3 border-t border-border/50 text-[10px] text-muted-foreground leading-relaxed">
            {data.listening_to_spotify && data.spotify ? (
              <div className="flex gap-2">
                <img
                  src={data.spotify.album_art_url}
                  alt={data.spotify.album}
                  className="h-8 w-8 rounded border border-border bg-secondary shrink-0"
                />
                <div className="min-w-0">
                  <p className="font-semibold text-foreground truncate">{data.spotify.song}</p>
                  <p className="text-muted-foreground truncate">{data.spotify.artist}</p>
                </div>
              </div>
            ) : (
              <div className="space-y-1">
                <p className="font-semibold text-foreground">
                  {activeActivity?.name === "Visual Studio Code" ? "💻 Coding" : "🎮 Playing"}
                </p>
                <p className="truncate">{activeActivity?.name}</p>
                {activeActivity?.details && <p className="truncate italic">"{activeActivity.details}"</p>}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
