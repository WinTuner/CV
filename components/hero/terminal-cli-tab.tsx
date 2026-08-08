"use client";

import type { ChangeEvent, KeyboardEvent, SyntheticEvent, ReactNode } from "react";

interface CliTabProps {
	history: Array<{ command: string; output: ReactNode }>;
	input: string;
	commandHistory: string[];
	historyIndex: number;
	onInput: (e: ChangeEvent<HTMLInputElement>) => void;
	onKeyDown: (e: KeyboardEvent<HTMLInputElement>) => void;
	onSubmit: (e: SyntheticEvent<HTMLFormElement>) => void;
}

export function CliTab({
	history,
	input,
	commandHistory,
	historyIndex,
	onInput,
	onKeyDown,
	onSubmit,
}: CliTabProps) {
	const placeholder =
		commandHistory.length === 0 ? "type 'help'..." : "❯ 'help' for commands";

	return (
		<div className="flex flex-col flex-1 h-full select-text min-h-0">
			<div className="flex-1 overflow-y-auto space-y-1.5 scrollbar-hide min-h-0 mb-2 pr-0.5">
				{history.map((item, idx) => (
					<div key={idx} className="space-y-1">
						<div className="flex items-center gap-1 text-muted-foreground/50">
							<span className="text-sky-400">wintuner</span>@
							<span className="text-purple-400">archlinux</span>
							<span className="text-fuchsia-500 font-bold">❯</span>
							<span className="text-foreground font-semibold">
								{item.command}
							</span>
						</div>
						<div className="pl-3 text-slate-300 leading-normal">
							{item.output}
						</div>
					</div>
				))}
			</div>
			<form
				onSubmit={onSubmit}
				className="flex items-center gap-1.5 border-t border-zinc-950 pt-2.5 mt-auto bg-zinc-950/80"
			>
				<span className="text-sky-400 font-bold">wintuner</span>@
				<span className="text-purple-400 font-bold">archlinux</span>
				<span className="text-fuchsia-500 font-bold">❯</span>
				<input
					type="text"
					value={input}
					onChange={onInput}
					onKeyDown={onKeyDown}
					placeholder={placeholder}
					aria-label="Terminal command input"
					autoComplete="off"
					spellCheck={false}
					className="flex-1 bg-transparent border-none outline-none text-foreground p-0 m-0 font-mono text-[11px] focus:ring-0 focus:outline-none"
				/>
				{historyIndex >= 0 && (
					<span className="shrink-0 font-mono text-[9px] text-muted-foreground/60">
						{commandHistory.length - historyIndex}/{commandHistory.length}
					</span>
				)}
			</form>
		</div>
	);
}
