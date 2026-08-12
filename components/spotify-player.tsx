"use client";

import Image from "next/image";
import { useState } from "react";
import { useIsMounted } from "@/lib/use-is-mounted";
import { Music, X } from "lucide-react";
import { useLanyardPresence } from "@/lib/lanyard-presence";

export function SpotifyPlayer() {
	const { presence } = useLanyardPresence();
	const [isOpen, setIsOpen] = useState(true);
	const mounted = useIsMounted();

	if (
		!mounted ||
		!isOpen ||
		!presence ||
		!presence.listening_to_spotify ||
		!presence.spotify
	) {
		return null;
	}

	const { song, artist, album_art_url, track_id } = presence.spotify;

	return (
		<div className="fixed bottom-6 left-6 z-40 max-w-[320px] animate-slide-in-left print:hidden">
			<div className="relative group overflow-hidden rounded-xl border border-border/50 bg-card/70 glass p-3.5 pr-8 shadow-2xl transition-all duration-300 hover:border-primary/40 hover:bg-card/90">
				{/* Glow effect */}
				<div className="absolute inset-0 -z-10 bg-gradient-to-tr from-primary/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

				<div className="flex items-center gap-3">
					{/* Album Art with spin animation */}
					<div className="relative h-12 w-12 shrink-0 rounded-lg overflow-hidden border border-border shadow-md bg-secondary">
						<Image
							src={album_art_url}
							alt={song}
							fill
							sizes="48px"
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
	);
}
