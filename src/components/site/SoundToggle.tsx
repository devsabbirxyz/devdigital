import React, { useEffect, useState } from "react";
import { Volume2, VolumeX } from "lucide-react";
import { isSoundEnabled, toggleSound } from "@/lib/soundEffects";

interface SoundToggleProps {
  className?: string;
  compact?: boolean;
}

export default function SoundToggle({ className = "", compact = false }: SoundToggleProps) {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(isSoundEnabled());

    const handleToggle = (e: Event) => {
      const custom = e as CustomEvent<{ enabled: boolean }>;
      if (typeof custom.detail?.enabled === "boolean") {
        setEnabled(custom.detail.enabled);
      } else {
        setEnabled(isSoundEnabled());
      }
    };

    window.addEventListener("devdigital-sound-toggle", handleToggle);
    return () => window.removeEventListener("devdigital-sound-toggle", handleToggle);
  }, []);

  const handleToggleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const next = toggleSound();
    setEnabled(next);
  };

  return (
    <button
      type="button"
      onClick={handleToggleClick}
      className={`relative group rounded-full transition-all duration-200 flex items-center justify-center cursor-pointer ${
        enabled
          ? "bg-cyan-500/15 border-cyan-400/40 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.35)]"
          : "bg-white/[0.08] hover:bg-white/[0.15] border-white/15 hover:border-white/30 text-slate-400 hover:text-slate-200"
      } border backdrop-blur-xl ${
        compact ? "w-8 h-8 md:w-9 md:h-9" : "px-2.5 py-1.5 md:px-3 text-xs gap-1.5"
      } ${className}`}
      title={enabled ? "Cyber Audio FX Enabled (Click to Mute)" : "Enable Cyber & Tactile Audio FX (Apple-style clicks)"}
      aria-label={enabled ? "Mute audio effects" : "Enable sound effects"}
    >
      {enabled ? (
        <>
          <Volume2 className="w-3.5 h-3.5 text-cyan-300 shrink-0 group-hover:scale-110 transition-transform" />
          {!compact && (
            <span className="hidden xl:inline text-[10px] font-mono font-medium tracking-wider text-cyan-300">
              AUDIO ON
            </span>
          )}
          <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
          </span>
        </>
      ) : (
        <>
          <VolumeX className="w-3.5 h-3.5 shrink-0 group-hover:scale-110 transition-transform" />
          {!compact && (
            <span className="hidden xl:inline text-[10px] font-mono tracking-wider text-slate-400">
              AUDIO OFF
            </span>
          )}
        </>
      )}
    </button>
  );
}
