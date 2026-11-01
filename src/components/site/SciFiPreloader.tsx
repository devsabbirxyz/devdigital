import React, { useEffect, useState, useRef, useMemo } from "react";
import h1 from "@/assets/hero-1.jpg";
import h2 from "@/assets/hero-2.jpg";
import h3 from "@/assets/hero-3.jpg";
import h4 from "@/assets/hero-4.jpg";

interface SciFiPreloaderProps {
  onComplete?: () => void;
}

export default function SciFiPreloader({ onComplete }: SciFiPreloaderProps) {
  const [progress, setProgress] = useState(1);
  const [isGlitching, setIsGlitching] = useState(false);
  const [glitchX, setGlitchX] = useState(0);
  const [isClimax, setIsClimax] = useState(false);
  const [isExit, setIsExit] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const audioCtxRef = useRef<AudioContext | null>(null);
  const oscRef = useRef<OscillatorNode | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const preloadUrls = useMemo(() => [h1, h2, h3, h4], []);

  // 1. Body scroll lock
  useEffect(() => {
    const orig = document.body.style.overflow;
    const origHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = orig;
      document.documentElement.style.overflow = origHtml;
    };
  }, []);

  // 2. Web Audio synth
  useEffect(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioCtx) {
        const ctx = new AudioCtx();
        audioCtxRef.current = ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();
        osc.type = "sawtooth";
        osc.frequency.setValueAtTime(55, ctx.currentTime);
        gain.gain.setValueAtTime(0.001, ctx.currentTime);
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(220, ctx.currentTime);
        osc.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        oscRef.current = osc;
        gainRef.current = gain;
        gain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.4);
      }
    } catch {}
    return () => {
      try {
        oscRef.current?.stop();
        oscRef.current?.disconnect();
        audioCtxRef.current?.close();
      } catch {}
    };
  }, []);

  // Pitch escalation
  useEffect(() => {
    if (!audioCtxRef.current || !oscRef.current || !gainRef.current) return;
    const ctx = audioCtxRef.current;
    if (ctx.state === "suspended") ctx.resume().catch(() => {});
    const freq = 55 + (progress / 100) * 145;
    oscRef.current.frequency.setTargetAtTime(freq, ctx.currentTime, 0.08);
    if (progress > 85)
      gainRef.current.gain.setTargetAtTime(0.08, ctx.currentTime, 0.05);
  }, [progress]);

  // 3. Asset preload + progress timeline
  useEffect(() => {
    let isMounted = true;
    let realAssetsLoaded = false;

    Promise.all([
      ...preloadUrls.map(
        (url) =>
          new Promise((resolve) => {
            const img = new Image();
            img.src = url;
            img.onload = () => resolve(true);
            img.onerror = () => resolve(true);
          })
      ),
      (document as any).fonts ? (document as any).fonts.ready : Promise.resolve(),
      new Promise((resolve) => {
        if (document.readyState === "complete") resolve(true);
        else window.addEventListener("load", () => resolve(true), { once: true });
      }),
    ]).then(() => { realAssetsLoaded = true; });

    const startTime = performance.now();
    const minDuration = 3400;

    const updateLoop = (now: number) => {
      if (!isMounted) return;
      const t = Math.min((now - startTime) / minDuration, 1);

      let calc: number;
      if (t < 0.55) calc = (t / 0.55) * 55;
      else if (t < 0.82) calc = 55 + ((t - 0.55) / 0.27) * 30;
      else calc = 85 + ((t - 0.82) / 0.18) * 15;

      if (calc >= 99 && !realAssetsLoaded) calc = 99;
      const next = Math.min(Math.round(calc), 100);
      setProgress((prev) => Math.max(prev, next));

      if (next < 100) {
        requestAnimationFrame(updateLoop);
      } else {
        setIsClimax(true);
        if (audioCtxRef.current && oscRef.current && gainRef.current) {
          try {
            const ctx = audioCtxRef.current;
            oscRef.current.frequency.setValueAtTime(440, ctx.currentTime);
            oscRef.current.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.2);
            gainRef.current.gain.setValueAtTime(0.12, ctx.currentTime);
            gainRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
          } catch {}
        }
        setTimeout(() => {
          if (!isMounted) return;
          setIsExit(true);
          setTimeout(() => {
            if (!isMounted) return;
            setIsComplete(true);
            document.body.style.overflow = "";
            document.documentElement.style.overflow = "";
            onComplete?.();
          }, 700);
        }, 220);
      }
    };

    requestAnimationFrame(updateLoop);
    return () => { isMounted = false; };
  }, [preloadUrls, onComplete]);

  // 4. Glitch intervals
  useEffect(() => {
    if (isClimax || isExit) return;
    const intervalTime = progress > 85 ? 230 : progress > 50 ? 420 : 670;
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setGlitchX((Math.random() - 0.5) * (progress > 85 ? 12 : progress > 50 ? 6 : 3));
      setTimeout(() => {
        setIsGlitching(false);
        setGlitchX(0);
      }, progress > 85 ? 130 : 80);
    }, intervalTime);
    return () => clearInterval(glitchInterval);
  }, [progress, isClimax, isExit]);

  if (isComplete) return null;

  // Shake magnitude
  const shakeMag =
    progress < 50
      ? 0.5 + (progress / 50) * 1.0
      : progress < 85
      ? 1.5 + ((progress - 50) / 35) * 2.0
      : 3.5 + ((progress - 85) / 15) * 3.0;

  const shakeClass =
    progress > 85
      ? "animate-scifi-shake-intense"
      : progress > 50
      ? "animate-scifi-shake-medium"
      : "animate-scifi-shake-idle";

  // Vertical bar glow
  const barGlow =
    isClimax
      ? "0 0 20px #ffffff, 0 0 50px #00ffff, 0 0 100px rgba(0,255,255,0.9)"
      : progress > 85
      ? "0 0 16px #00ffff, 0 0 40px #00ffff, 0 0 80px rgba(0,255,255,0.7)"
      : progress > 50
      ? "0 0 12px #00ffff, 0 0 28px #00ffff, 0 0 55px rgba(0,255,255,0.5)"
      : "0 0 8px #00ffff, 0 0 18px #00ffff, 0 0 35px rgba(0,255,255,0.35)";

  return (
    <div
      id="scifi-preloader-root"
      className="fixed inset-0 w-screen h-screen z-[99999] pointer-events-auto select-none overflow-hidden font-mono"
      style={{ backgroundColor: "#000000" }}
      role="progressbar"
      aria-valuenow={progress}
      aria-valuemin={1}
      aria-valuemax={100}
    >
      {/* ── Cinematic LEFT / RIGHT shutter doors on exit ── */}
      <div
        className="absolute inset-y-0 left-0 w-1/2 bg-[#000000] z-20 transition-transform duration-700"
        style={{
          transform: isExit ? "translateX(-100%)" : "translateX(0%)",
          transitionTimingFunction: "cubic-bezier(0.77,0,0.175,1)",
          boxShadow: isExit ? "12px 0 50px rgba(0,255,255,0.9)" : "none",
        }}
      />
      <div
        className="absolute inset-y-0 right-0 w-1/2 bg-[#000000] z-20 transition-transform duration-700"
        style={{
          transform: isExit ? "translateX(100%)" : "translateX(0%)",
          transitionTimingFunction: "cubic-bezier(0.77,0,0.175,1)",
          boxShadow: isExit ? "-12px 0 50px rgba(0,255,255,0.9)" : "none",
        }}
      />

      {/* ── Vertical laser flash on exit ── */}
      {isExit && (
        <div
          className="absolute inset-y-0 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          style={{
            width: "3px",
            background: "#ffffff",
            boxShadow: "0 0 30px #00ffff, 0 0 80px #00ffff, 0 0 140px #ffffff",
          }}
        />
      )}

      {/* ── MAIN CORE: kinetic shake + glitch wrapper ── */}
      <div
        className={`relative z-10 w-full h-full flex items-center justify-center transition-opacity duration-300 ${
          isExit ? "opacity-0" : "opacity-100"
        } ${shakeClass}`}
        style={{
          filter: isGlitching
            ? `drop-shadow(${glitchX}px 0 0 #ff0055) drop-shadow(${-glitchX}px 0 0 #00ffff)`
            : isClimax
            ? "drop-shadow(0 0 40px #00ffff)"
            : "none",
          transform: isGlitching
            ? `skewX(${(Math.random() - 0.5) * 3}deg)`
            : undefined,
          transition: "filter 0.07s ease",
          "--shake-mag": `${shakeMag}px`,
        } as React.CSSProperties}
      >
        {/* Ambient radial glow behind the bar */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute rounded-full blur-[130px]"
          style={{
            width: "300px",
            height: "70vh",
            background: isClimax
              ? "radial-gradient(ellipse, #ffffff 0%, #00ffff 40%, transparent 80%)"
              : "radial-gradient(ellipse, rgba(0,255,255,0.3) 0%, rgba(0,255,255,0.1) 50%, transparent 80%)",
            opacity: 0.65,
            transition: "background 0.3s ease",
          }}
        />

        {/* ════════════════════════════════════════════
            VERTICAL SCANNER BAR: উপর থেকে নিচে
            ════════════════════════════════════════════ */}
        <div
          style={{
            position: "relative",
            display: "flex",
            alignItems: "flex-start",
            gap: "20px",
          }}
        >
          {/* Left: percentage counter (vertically centered at fill tip) */}
          <div
            style={{
              position: "relative",
              height: "70vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              alignItems: "flex-end",
              paddingBottom: `${100 - progress}%`,
              transition: "padding-bottom 0.07s linear",
            }}
          >
            {/* Horizontal tick lines along the left side */}
            {[0, 25, 50, 75, 100].map((tick) => (
              <div
                key={tick}
                style={{
                  position: "absolute",
                  top: `${tick}%`,
                  right: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <span
                  style={{
                    color:
                      progress >= tick
                        ? "#00ffff"
                        : "rgba(0,255,255,0.2)",
                    fontSize: "9px",
                    fontFamily: "monospace",
                    transition: "color 0.3s ease",
                    textShadow:
                      progress >= tick ? "0 0 8px #00ffff" : "none",
                  }}
                >
                  {tick}%
                </span>
                <div
                  style={{
                    width: "8px",
                    height: "1px",
                    backgroundColor:
                      progress >= tick
                        ? "#00ffff"
                        : "rgba(0,255,255,0.2)",
                    transition: "background-color 0.3s ease",
                  }}
                />
              </div>
            ))}
          </div>

          {/* Center: Vertical track + fill bar */}
          <div style={{ position: "relative" }}>
            {/* Track (full height, very thin dark rail) */}
            <div
              style={{
                width: "4px",
                height: "70vh",
                backgroundColor: "#0a1818",
                borderRadius: "999px",
                position: "relative",
                boxShadow: "0 0 2px rgba(0,255,255,0.1)",
                overflow: "visible",
              }}
            >
              {/* Neon cyan fill — grows from TOP to BOTTOM */}
              <div
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: `${progress}%`,
                  backgroundColor: isClimax ? "#e0ffff" : "#00ffff",
                  borderRadius: "999px",
                  boxShadow: barGlow,
                  transition: "height 0.07s linear, box-shadow 0.3s ease",
                }}
              />

              {/* ── Leading node at the BOTTOM TIP of fill ── */}
              <div
                style={{
                  position: "absolute",
                  top: `${progress}%`,
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                  transition: "top 0.07s linear",
                }}
              >
                {/* Right-pointing triangle (to the right of circle) */}
                <div
                  style={{
                    position: "absolute",
                    left: "calc(100% + 6px)",
                    top: "50%",
                    transform: "translateY(-50%)",
                    filter: isClimax
                      ? "drop-shadow(0 0 10px #ffffff)"
                      : "drop-shadow(0 0 8px #00ffff)",
                  }}
                >
                  <svg width="8" height="12" viewBox="0 0 8 12" fill="none">
                    <polygon
                      points="0,0 0,12 8,6"
                      fill={isClimax ? "#ffffff" : "#00ffff"}
                    />
                  </svg>
                </div>

                {/* Glowing circle */}
                <div
                  style={{
                    width: "20px",
                    height: "20px",
                    borderRadius: "50%",
                    backgroundColor: isClimax ? "#ffffff" : "#00ffff",
                    border: "2px solid #000",
                    boxShadow: isClimax
                      ? "0 0 20px #ffffff, 0 0 50px #00ffff, 0 0 90px #00ffff"
                      : "0 0 14px #00ffff, 0 0 32px #00ffff, 0 0 60px rgba(0,255,255,0.7)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    transition: "box-shadow 0.15s ease",
                  }}
                >
                  <div
                    style={{
                      width: "6px",
                      height: "6px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(0,0,0,0.7)",
                    }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right: LOADING.... text + live % — vertical layout */}
          <div
            style={{
              position: "relative",
              height: "70vh",
              display: "flex",
              flexDirection: "column",
              justifyContent: "flex-end",
              paddingBottom: `${100 - progress}%`,
              transition: "padding-bottom 0.07s linear",
            }}
          >
            {/* Tick marks on the right */}
            {[0, 25, 50, 75, 100].map((tick) => (
              <div
                key={tick}
                style={{
                  position: "absolute",
                  top: `${tick}%`,
                  left: 0,
                  display: "flex",
                  alignItems: "center",
                  gap: "4px",
                }}
              >
                <div
                  style={{
                    width: "8px",
                    height: "1px",
                    backgroundColor:
                      progress >= tick
                        ? "#00ffff"
                        : "rgba(0,255,255,0.2)",
                    transition: "background-color 0.3s ease",
                  }}
                />
                <span
                  style={{
                    color:
                      progress >= tick
                        ? "#00ffff"
                        : "rgba(0,255,255,0.2)",
                    fontSize: "9px",
                    fontFamily: "monospace",
                    transition: "color 0.3s ease",
                    textShadow:
                      progress >= tick ? "0 0 8px #00ffff" : "none",
                  }}
                >
                  {tick === 0 ? "START" : tick === 100 ? "END" : `SYS.${tick}`}
                </span>
              </div>
            ))}

            {/* Live counter pinned at fill tip */}
            <div style={{ position: "absolute", bottom: `${100 - progress}%`, left: "16px", transition: "bottom 0.07s linear" }}>
              <div
                style={{
                  color: isClimax ? "#ffffff" : "#00ffff",
                  fontSize: "20px",
                  fontWeight: 900,
                  fontFamily: "monospace",
                  textShadow: isClimax
                    ? "0 0 20px #ffffff, 0 0 40px #00ffff"
                    : "0 0 14px #00ffff, 0 0 28px rgba(0,255,255,0.6)",
                  transition: "color 0.2s ease",
                  lineHeight: 1,
                }}
              >
                {progress}%
              </div>
            </div>
          </div>
        </div>

        {/* ── Bottom: LOADING.... label ── */}
        <div
          className="absolute bottom-10 left-0 right-0 flex flex-col items-center gap-3"
        >
          <div
            style={{
              color: "#00ffff",
              textShadow: "0 0 10px #00ffff, 0 0 22px rgba(0,255,255,0.5)",
              fontSize: "11px",
              letterSpacing: "4px",
              fontFamily: "monospace",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
            }}
          >
            <span>LOADING</span>
            <span
              style={{
                display: "inline-flex",
                marginLeft: "4px",
                gap: "1px",
                fontSize: "14px",
                lineHeight: 1,
              }}
            >
              <span className="animate-scifi-dot-1">.</span>
              <span className="animate-scifi-dot-2">.</span>
              <span className="animate-scifi-dot-3">.</span>
              <span className="animate-scifi-dot-4">.</span>
            </span>
          </div>

          {/* Telemetry ping */}
          <div
            className="flex items-center gap-2 text-[9px] uppercase tracking-[2px] font-mono"
            style={{ color: "rgba(0,255,255,0.4)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping"
              style={{ boxShadow: "0 0 6px #00ffff" }}
            />
            <span>DEVDIGITAL CORE // INITIALIZING</span>
          </div>
        </div>
      </div>
    </div>
  );
}
