"use client"

interface NeofetchTabProps {
	mounted: boolean;
	cpuLoad: number;
	ramUsed: number;
	localTime: string;
}

export function NeofetchTab({ mounted, cpuLoad, ramUsed, localTime }: NeofetchTabProps) {
	return (
		<div className="flex flex-col sm:flex-row gap-5 animate-fade-in text-[10px] sm:text-[10.5px]">
			{/* Arch Logo in ASCII */}
			<pre className="text-cyan-400 leading-none select-none font-bold font-mono">
				{`      /\\
     /  \\
    /\\   \\
   /  __  \\
  /  (  )  \\
 /  .-'\`'-. \\
/___(____)___\\`}
			</pre>

			{/* Spec list */}
			<div className="space-y-0.5 text-slate-300 flex-1">
				<div>
					<span className="text-[#a78bfa] font-bold">wintuner</span>@
					<span className="text-cyan-400 font-bold">cachyos</span>
				</div>
				<div className="text-zinc-700 font-sans leading-none pb-1">
					---------------------
				</div>
				<div>
					<span className="text-sky-400">OS</span>: CachyOS Linux (Arch-based)
					x86_64
				</div>
				<div>
					<span className="text-sky-400">Host</span>: Next.js Vercel Edge Server
				</div>
				<div>
					<span className="text-sky-400">Kernel</span>: Linux 6.10-cachyos
				</div>
				<div>
					<span className="text-sky-400">Uptime</span>: 99.9% (Continuous
					Caching)
				</div>
				<div>
					<span className="text-sky-400">Shell</span>: zsh 5.9
				</div>
				<div>
					<span className="text-sky-400">WM</span>: Hyprland (Wayland)
				</div>
				<div>
					<span className="text-sky-400">CPU</span>: AMD Ryzen 7 7840HS (8C
					16T) @ 5.1GHz{" "}
					<span className="text-emerald-400 font-mono text-[9px] ml-2 animate-pulse bg-emerald-500/10 border border-emerald-500/30 px-1 py-0.5 rounded">
						{mounted ? `${cpuLoad}% load` : "Calculating..."}
					</span>
				</div>
				<div>
					<span className="text-sky-400">Memory</span>:{" "}
					{mounted ? `${ramUsed}GB / 32GB` : "16GB / 32GB"}{" "}
					<span className="text-muted-foreground/60 text-[9px] ml-1">
						{mounted ? `(${Math.round((ramUsed / 32) * 100)}%)` : "(50%)"}
					</span>
				</div>
				<div>
					<span className="text-sky-400">Time (CMU/TH)</span>:{" "}
					<span className="text-yellow-400 font-mono font-semibold">
						{mounted ? localTime : "Loading... (ICT)"}
					</span>
				</div>

				{/* Color blocks */}
				<div className="flex gap-1 pt-2">
					<span className="inline-block w-3.5 h-3 bg-black border border-zinc-800" />
					<span className="inline-block w-3.5 h-3 bg-red-500" />
					<span className="inline-block w-3.5 h-3 bg-green-500" />
					<span className="inline-block w-3.5 h-3 bg-yellow-500" />
					<span className="inline-block w-3.5 h-3 bg-blue-500" />
					<span className="inline-block w-3.5 h-3 bg-fuchsia-500" />
					<span className="inline-block w-3.5 h-3 bg-cyan-500" />
					<span className="inline-block w-3.5 h-3 bg-white" />
				</div>
			</div>
		</div>
	);
}
