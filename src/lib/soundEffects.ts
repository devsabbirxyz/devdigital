/**
 * DevDigital Cyber & Tactile Sound FX Engine
 * Web Audio API synthesizer — zero-latency, zero-asset, Apple/Linear style tactile feedback.
 */

const STORAGE_KEY = "devdigital_sound_effects";

// Web Audio Context singleton (lazy initialized on user interaction)
let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function isSoundEnabled(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const val = localStorage.getItem(STORAGE_KEY);
    return val === "true";
  } catch {
    return false;
  }
}

export function setSoundEnabled(enabled: boolean): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? "true" : "false");
    window.dispatchEvent(
      new CustomEvent("devdigital-sound-toggle", { detail: { enabled } })
    );
  } catch {}
}

export function toggleSound(): boolean {
  const next = !isSoundEnabled();
  setSoundEnabled(next);
  if (next) {
    // Play warm welcome chime upon enabling
    playUiSound("chime", true);
  }
  return next;
}

export type SoundType = "click" | "soft-click" | "chime" | "cyber" | "success" | "toggle";

let lastClickTime = 0;

/**
 * Play synthesized UI sound
 * @param type Sound type
 * @param forcePlay If true, bypasses the isSoundEnabled check (e.g. when turning sound on)
 */
export function playUiSound(type: SoundType = "click", forcePlay = false): void {
  if (!forcePlay && !isSoundEnabled()) return;

  const now = Date.now();
  if (type === "click" && now - lastClickTime < 40) {
    return; // debounce rapid clicks
  }
  if (type === "click") {
    lastClickTime = now;
  }

  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const t = ctx.currentTime;

    switch (type) {
      case "click": {
        // Apple-style subtle tactile mechanical glass click
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(650, t);
        osc.frequency.exponentialRampToValueAtTime(140, t + 0.028);

        gain.gain.setValueAtTime(0.06, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.032);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.035);
        break;
      }

      case "soft-click": {
        // Ultra-soft haptic tap for hovers or secondary clicks
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(420, t);
        osc.frequency.exponentialRampToValueAtTime(180, t + 0.02);

        gain.gain.setValueAtTime(0.03, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.022);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.025);
        break;
      }

      case "toggle": {
        // High-low tactile toggle switch
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "triangle";
        osc.frequency.setValueAtTime(440, t);
        osc.frequency.exponentialRampToValueAtTime(720, t + 0.04);

        gain.gain.setValueAtTime(0.05, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.045);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.05);
        break;
      }

      case "chime": {
        // Smooth dual-tone futuristic glass chime (e.g. upon enabling sound or opening modals)
        const notes = [587.33, 880]; // D5 -> A5
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          const delay = idx * 0.045;
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, t + delay);

          gain.gain.setValueAtTime(0.05, t + delay);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.16);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t + delay);
          osc.stop(t + delay + 0.17);
        });
        break;
      }

      case "cyber": {
        // Cyber accent frequency blip
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(900, t);
        osc.frequency.exponentialRampToValueAtTime(350, t + 0.05);

        // Low-pass filter to make it velvet/subtle, not harsh
        const filter = ctx.createBiquadFilter();
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(1600, t);

        gain.gain.setValueAtTime(0.04, t);
        gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);

        osc.start(t);
        osc.stop(t + 0.065);
        break;
      }

      case "success": {
        // Uplifting harmonic triad chime (e.g. booking finalized or terminal completion)
        const triad = [523.25, 659.25, 783.99]; // C5, E5, G5
        triad.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();

          const delay = idx * 0.06;
          osc.type = "sine";
          osc.frequency.setValueAtTime(freq, t + delay);

          gain.gain.setValueAtTime(0.06, t + delay);
          gain.gain.exponentialRampToValueAtTime(0.0001, t + delay + 0.22);

          osc.connect(gain);
          gain.connect(ctx.destination);

          osc.start(t + delay);
          osc.stop(t + delay + 0.23);
        });
        break;
      }
    }
  } catch {
    // Ignore audio playback errors if audio context blocked by browser
  }
}

/**
 * Initializes global click audio listener for interactive elements
 */
if (typeof window !== "undefined") {
  window.addEventListener("click", (e) => {
    if (!isSoundEnabled()) return;
    const target = e.target as HTMLElement | null;
    if (!target) return;

    // Check if clicked element or parent is interactive
    const interactive = target.closest(
      "button, a, [role='button'], input[type='submit'], input[type='button'], .cursor-pointer"
    );
    if (interactive) {
      playUiSound("click");
    }
  }, { capture: true, passive: true });
}

