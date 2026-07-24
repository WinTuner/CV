"use client"

import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"
import { Music, X, Volume2 } from "lucide-react"
import { DISCORD_ID } from "./discord-status"

interface LanyardSpotify {
  listening_to_spotify: boolean
  spotify?: {
    track_id: string
    song: string
    artist: string
    album: string
    album_art_url: string
  }
}

export function SpotifyPlayer() {
  const [data, setData] = useState<LanyardSpotify | null>(null)
  const [isOpen, setIsOpen] = useState(true)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    let socket: WebSocket | null = null
    let heartbeatInterval: NodeJS.Timeout | null = null

    const connectWebSocket = () => {
      socket = new WebSocket("wss://api.lanyard.rest/socket")

      socket.onmessage = (event) => {
        const payload = JSON.parse(event.data)

        if (payload.op === 1) {
          const interval = payload.d.heartbeat_interval
          heartbeatInterval = setInterval(() => {
            if (socket && socket.readyState === WebSocket.OPEN) {
              socket.send(JSON.stringify({ op: 3 }))
            }
          }, interval)

          if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(
              JSON.stringify({
                op: 2,
                d: { subscribe_to_id: DISCORD_ID },
              })
            )
          }
        } else if (payload.op === 0) {
          if (payload.t === "INIT_STATE" || payload.t === "PRESENCE_UPDATE") {
            setData({
              listening_to_spotify: payload.d.listening_to_spotify,
              spotify: payload.d.spotify,
            })
          }
        }
      }

      socket.onclose = () => {
        if (heartbeatInterval) clearInterval(heartbeatInterval)
        setTimeout(connectWebSocket, 5000)
      }

      socket.onerror = () => {
        socket?.close()
      }
    }

    connectWebSocket()

    return () => {
      if (heartbeatInterval) clearInterval(heartbeatInterval)
      if (socket) socket.close()
    }
  }, [])

  if (!mounted || !isOpen || !data || !data.listening_to_spotify || !data.spotify) {
    return null
  }

  const { song, artist, album_art_url, track_id } = data.spotify

  return (
    <div className="fixed bottom-6 left-6 z-40 max-w-[320px] animate-slide-in-left print:hidden">
      <div className="relative group overflow-hidden rounded-xl border border-border/50 bg-card/70 glass p-3.5 pr-8 shadow-2xl transition-all duration-300 hover:border-primary/40 hover:bg-card/90">
        
        {/* Glow effect */}
        <div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        <div className="flex items-center gap-3">
          {/* Album Art with spin animation */}
          <div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden border border-border shadow-md bg-secondary">
            <img
              src={album_art_url}
              alt={song}
              className="h-full w-full object-cover animate-[spin_20s_linear_infinite]"
            />
            {/* Overlay icon */}
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
              <Music className="h-4 w-4 text-white/80 animate-pulse" />
            </div>
          </div>

          {/* Details */}
          <div className="min-w-0 flex-1 space-y-1">
            <div className="flex items-center gap-1.5">
              <span className="font-mono text-[9px] uppercase tracking-wider text-primary font-bold flex items-center gap-1">
                <span className="flex items-center gap-0.5 h-3">
                  <span className="w-0.5 bg-primary rounded-full animate-[pulse-glow_1s_infinite_100ms] h-2" />
                  <span className="w-0.5 bg-primary rounded-full animate-[pulse-glow_1.2s_infinite_300ms] h-3" />
                  <span className="w-0.5 bg-primary rounded-full animate-[pulse-glow_0.8s_infinite_500ms] h-1.5" />
                </span>
                Now Listening
              </span>
            </div>
            
            <a
              href={`https://open.spotify.com/track/${track_id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-xs font-bold text-foreground truncate hover:text-primary hover:underline transition-colors leading-none"
            >
              {song}
            </a>
            
            <p className="text-[10px] text-muted-foreground truncate leading-none">
              by {artist}
            </p>
          </div>
        </div>

        {/* Dismiss Button */}
        <button
          onClick={() => setIsOpen(false)}
          className="absolute top-2 right-2 flex h-5 w-5 items-center justify-center rounded-full border border-transparent text-muted-foreground/60 transition-all duration-200 hover:text-foreground hover:bg-secondary/80 hover:border-border/50 cursor-pointer"
          aria-label="Dismiss player"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    </div>
  )
}
