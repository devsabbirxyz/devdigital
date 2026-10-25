import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  RotateCcw,
  Copy,
  Check,
  Terminal,
  Code2,
  Eye,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from "lucide-react";

type LanguageKey = "python" | "java" | "html";

interface LanguageConfig {
  id: LanguageKey;
  name: string;
  ext: string;
  label: string;
  dotColor: string;
  badgeBorder: string;
  command: string;
  rawCode: string;
  outputLines: { type: "command" | "info" | "stdout" | "success"; text: string }[];
  renderHighlighted: () => React.ReactNode;
}

const CYCLE: LanguageKey[] = ["python", "java", "html"];

const LANGUAGES: Record<LanguageKey, LanguageConfig> = {
  html: {
    id: "html",
    name: "HTML",
    ext: "sabbir.html",
    label: "HTML5 / Web Architecture",
    dotColor: "bg-orange-400",
    badgeBorder: "border-orange-500/30",
    command: "npx serve sabbir.html",
    rawCode: `<!-- sabbir.html — High-Converting Web Platform -->
<div class="specialist-card">
  <h1 class="name">Sabbir</h1>
  <p class="role">Digital Marketing, Web Architecture & AI Specialist</p>

  <div class="services">
    <span>Meta & Google Ads</span>
    <span>High-Converting Platforms</span>
    <span>Autonomous AI Agents</span>
  </div>

  <div class="status">🟢 Accepting Q2 2026 Client Projects</div>
  <blockquote class="philosophy">
    "High-converting ads, sub-second code & autonomous AI pipelines."
  </blockquote>
</div>`,
    outputLines: [
      { type: "command", text: "$ npx serve sabbir.html --port 3000" },
      { type: "info", text: "[🌐 HTML5 DOM Parser & Live Server mounted on http://localhost:3000]" },
      { type: "stdout", text: "<div> Mounted node <div class=\"specialist-card\"> (DOM ready)" },
      { type: "stdout", text: "├── <h1> Sabbir (Role: Digital Marketing, Web Architecture & AI Specialist)" },
      { type: "stdout", text: "├── <services> Meta & Google Ads | High-Converting Platforms | AI Agents" },
      { type: "stdout", text: "└── <status> 🟢 Accepting Q2 2026 Client Projects" },
      { type: "success", text: "✨ 200 OK — Rendered successfully in Browser DOM (View 'Preview')" },
    ],
    renderHighlighted: () => (
      <>
        <span className="text-slate-500 italic">&lt;!-- sabbir.html — High-Converting Web Platform --&gt;</span>
        {"\n"}
        <span className="text-slate-400">&lt;</span><span className="text-pink-400">div</span> <span className="text-sky-300">class</span>=<span className="text-emerald-300">"specialist-card"</span><span className="text-slate-400">&gt;</span>
        {"\n"}  <span className="text-slate-400">&lt;</span><span className="text-pink-400">h1</span> <span className="text-sky-300">class</span>=<span className="text-emerald-300">"name"</span><span className="text-slate-400">&gt;</span><span className="text-foreground font-semibold">Sabbir</span><span className="text-slate-400">&lt;/</span><span className="text-pink-400">h1</span><span className="text-slate-400">&gt;</span>
        {"\n"}  <span className="text-slate-400">&lt;</span><span className="text-pink-400">p</span> <span className="text-sky-300">class</span>=<span className="text-emerald-300">"role"</span><span className="text-slate-400">&gt;</span><span className="text-foreground">Digital Marketing, Web Architecture &amp; AI Specialist</span><span className="text-slate-400">&lt;/</span><span className="text-pink-400">p</span><span className="text-slate-400">&gt;</span>
        {"\n"}
        {"\n"}  <span className="text-slate-400">&lt;</span><span className="text-pink-400">div</span> <span className="text-sky-300">class</span>=<span className="text-emerald-300">"services"</span><span className="text-slate-400">&gt;</span>
        {"\n"}    <span className="text-slate-400">&lt;</span><span className="text-pink-400">span</span><span className="text-slate-400">&gt;</span><span className="text-yellow-200">Meta &amp; Google Ads</span><span className="text-slate-400">&lt;/</span><span className="text-pink-400">span</span><span className="text-slate-400">&gt;</span>
        {"\n"}    <span className="text-slate-400">&lt;</span><span className="text-pink-400">span</span><span className="text-slate-400">&gt;</span><span className="text-yellow-200">High-Converting Platforms</span><span className="text-slate-400">&lt;/</span><span className="text-pink-400">span</span><span className="text-slate-400">&gt;</span>
        {"\n"}    <span className="text-slate-400">&lt;</span><span className="text-pink-400">span</span><span className="text-slate-400">&gt;</span><span className="text-yellow-200">Autonomous AI Agents</span><span className="text-slate-400">&lt;/</span><span className="text-pink-400">span</span><span className="text-slate-400">&gt;</span>
        {"\n"}  <span className="text-slate-400">&lt;/</span><span className="text-pink-400">div</span><span className="text-slate-400">&gt;</span>
        {"\n"}
        {"\n"}  <span className="text-slate-400">&lt;</span><span className="text-pink-400">div</span> <span className="text-sky-300">class</span>=<span className="text-emerald-300">"status"</span><span className="text-slate-400">&gt;</span><span className="text-emerald-400">🟢 Accepting Q2 2026 Client Projects</span><span className="text-slate-400">&lt;/</span><span className="text-pink-400">div</span><span className="text-slate-400">&gt;</span>
        {"\n"}  <span className="text-slate-400">&lt;</span><span className="text-pink-400">blockquote</span> <span className="text-sky-300">class</span>=<span className="text-emerald-300">"philosophy"</span><span className="text-slate-400">&gt;</span>
        {"\n"}    <span className="text-muted-foreground">"High-converting ads, sub-second code &amp; autonomous AI pipelines."</span>
        {"\n"}  <span className="text-slate-400">&lt;/</span><span className="text-pink-400">blockquote</span><span className="text-slate-400">&gt;</span>
        {"\n"}<span className="text-slate-400">&lt;/</span><span className="text-pink-400">div</span><span className="text-slate-400">&gt;</span>
      </>
    ),
  },

  java: {
    id: "java",
    name: "Java",
    ext: "Sabbir.java",
    label: "Java 21 / Enterprise",
    dotColor: "bg-red-400",
    badgeBorder: "border-red-500/30",
    command: "javac Sabbir.java && java Sabbir",
    rawCode: `// Sabbir.java — Scalable Enterprise Architecture
public class Sabbir {
    public static void main(String[] args) {
        String role = "Digital Marketing, Web Architecture & AI Specialist";
        String[] services = {"Meta & Google Ads", "Web Platforms", "AI Agents"};
        String status = "🟢 Accepting Q2 2026 Client Projects";
        String philosophy = "High-converting ads, sub-second code & autonomous AI pipelines.";

        System.out.println("Role: " + role);
        System.out.println("Services: " + String.join(", ", services));
        System.out.println("Status: " + status);
        System.out.println("Philosophy: " + philosophy);
    }
}`,
    outputLines: [
      { type: "command", text: "$ javac Sabbir.java && java Sabbir" },
      { type: "info", text: "[☕ OpenJDK 21 Compiler | Compiling bytecode & initializing JVM...]" },
      { type: "stdout", text: "Role: Digital Marketing, Web Architecture & AI Specialist" },
      { type: "stdout", text: "Services: Meta & Google Ads, Web Platforms, AI Agents" },
      { type: "stdout", text: "Status: 🟢 Accepting Q2 2026 Client Projects" },
      { type: "stdout", text: "Philosophy: High-converting ads, sub-second code & autonomous AI pipelines." },
      { type: "success", text: ">> BUILD SUCCESSFUL [JVM Execution Complete | Total Time: 34ms]" },
    ],
    renderHighlighted: () => (
      <>
        <span className="text-slate-500 italic">// Sabbir.java — Scalable Enterprise Architecture</span>
        {"\n"}
        <span className="text-fuchsia-400 font-semibold">public class</span> <span className="text-yellow-300 font-bold">Sabbir</span> {"{"}
        {"\n"}    <span className="text-fuchsia-400 font-semibold">public static void</span> <span className="text-sky-300 font-bold">main</span>(<span className="text-yellow-300">String</span>[] <span className="text-orange-300">args</span>) {"{"}
        {"\n"}        <span className="text-yellow-300">String</span> <span className="text-sky-300">role</span> = <span className="text-emerald-300">"Digital Marketing, Web Architecture & AI Specialist"</span>;
        {"\n"}        <span className="text-yellow-300">String</span>[] <span className="text-sky-300">services</span> = {"{"}<span className="text-emerald-300">"Meta & Google Ads"</span>, <span className="text-emerald-300">"Web Platforms"</span>, <span className="text-emerald-300">"AI Agents"</span>{"}"};
        {"\n"}        <span className="text-yellow-300">String</span> <span className="text-sky-300">status</span> = <span className="text-emerald-300">"🟢 Accepting Q2 2026 Client Projects"</span>;
        {"\n"}        <span className="text-yellow-300">String</span> <span className="text-sky-300">philosophy</span> = <span className="text-emerald-300">"High-converting ads, sub-second code & autonomous AI pipelines."</span>;
        {"\n"}
        {"\n"}        <span className="text-sky-300">System</span>.<span className="text-sky-300">out</span>.<span className="text-yellow-300">println</span>(<span className="text-emerald-300">"Role: "</span> + <span className="text-sky-300">role</span>);
        {"\n"}        <span className="text-sky-300">System</span>.<span className="text-sky-300">out</span>.<span className="text-yellow-300">println</span>(<span className="text-emerald-300">"Services: "</span> + <span className="text-sky-300">String</span>.<span className="text-yellow-300">join</span>(<span className="text-emerald-300">", "</span>, <span className="text-sky-300">services</span>));
        {"\n"}        <span className="text-sky-300">System</span>.<span className="text-sky-300">out</span>.<span className="text-yellow-300">println</span>(<span className="text-emerald-300">"Status: "</span> + <span className="text-sky-300">status</span>);
        {"\n"}        <span className="text-sky-300">System</span>.<span className="text-sky-300">out</span>.<span className="text-yellow-300">println</span>(<span className="text-emerald-300">"Philosophy: "</span> + <span className="text-sky-300">philosophy</span>);
        {"\n"}    {"}"}
        {"\n"}{"}"}
      </>
    ),
  },

  python: {
    id: "python",
    name: "Python",
    ext: "sabbir.py",
    label: "Python 3.12 / AI Agent Engine",
    dotColor: "bg-amber-400",
    badgeBorder: "border-amber-500/30",
    command: "python3 sabbir.py",
    rawCode: `# sabbir.py — AI Automations & Full-Stack Engine
class Sabbir:
    role = "Digital Marketing, Web Architecture & AI Specialist"
    services = ["Meta & Google Ads", "Web Platforms", "Autonomous AI Agents"]
    status = "🟢 Accepting Q2 2026 Client Projects"
    philosophy = "High-converting ads, sub-second code & autonomous AI pipelines."

# Print Output
sabbir = Sabbir()
print(f"Role: {sabbir.role}")
print(f"Services: {', '.join(sabbir.services)}")
print(f"Status: {sabbir.status}")
print(f"Philosophy: {sabbir.philosophy}")`,
    outputLines: [
      { type: "command", text: "$ python3 sabbir.py" },
      { type: "info", text: "[⚡ Python 3.12.2 Runtime Active | Interpreting sabbir.py...]" },
      { type: "stdout", text: "Role        : Digital Marketing, Web Architecture & AI Specialist" },
      { type: "stdout", text: "Services    : Meta & Google Ads, Web Platforms, Autonomous AI Agents" },
      { type: "stdout", text: "Status      : 🟢 Accepting Q2 2026 Client Projects" },
      { type: "stdout", text: "Philosophy  : High-converting ads, sub-second code & autonomous AI pipelines." },
      { type: "success", text: "✨ Output printed successfully (Exit Code: 0, Elapsed: 18ms)" },
    ],
    renderHighlighted: () => (
      <>
        <span className="text-slate-500 italic"># sabbir.py — AI Automations & Full-Stack Engine</span>
        {"\n"}
        <span className="text-fuchsia-400 font-semibold">class</span> <span className="text-yellow-300 font-bold">Sabbir</span>:
        {"\n"}    <span className="text-sky-300">role</span> = <span className="text-emerald-300">"Digital Marketing, Web Architecture & AI Specialist"</span>
        {"\n"}    <span className="text-sky-300">services</span> = [<span className="text-emerald-300">"Meta & Google Ads"</span>, <span className="text-emerald-300">"Web Platforms"</span>, <span className="text-emerald-300">"Autonomous AI Agents"</span>]
        {"\n"}    <span className="text-sky-300">status</span> = <span className="text-emerald-300">"🟢 Accepting Q2 2026 Client Projects"</span>
        {"\n"}    <span className="text-sky-300">philosophy</span> = <span className="text-emerald-300">"High-converting ads, sub-second code & autonomous AI pipelines."</span>
        {"\n"}
        {"\n"}<span className="text-slate-500 italic"># Print Output</span>
        {"\n"}<span className="text-sky-300">sabbir</span> = <span className="text-yellow-300">Sabbir</span>()
        {"\n"}<span className="text-yellow-300">print</span>(<span className="text-emerald-300">f"Role: {"{"}</span><span className="text-sky-300">sabbir.role</span><span className="text-emerald-300">{"}"}"</span>)
        {"\n"}<span className="text-yellow-300">print</span>(<span className="text-emerald-300">f"Services: {"{"}</span><span className="text-emerald-300">', '.</span><span className="text-sky-300">join</span>(<span className="text-sky-300">sabbir.services</span>)<span className="text-emerald-300">{"}"}"</span>)
        {"\n"}<span className="text-yellow-300">print</span>(<span className="text-emerald-300">f"Status: {"{"}</span><span className="text-sky-300">sabbir.status</span><span className="text-emerald-300">{"}"}"</span>)
        {"\n"}<span className="text-yellow-300">print</span>(<span className="text-emerald-300">f"Philosophy: {"{"}</span><span className="text-sky-300">sabbir.philosophy</span><span className="text-emerald-300">{"}"}"</span>)
      </>
    ),
  },
};

export default function InteractiveTerminal() {
  const [selectedLang, setSelectedLang] = useState<LanguageKey>("python");
  const [viewMode, setViewMode] = useState<"code" | "output" | "preview">("code");
  const [typedLength, setTypedLength] = useState<number>(0);
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [isAutoLoop, setIsAutoLoop] = useState<boolean>(true);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [copiedCode, setCopiedCode] = useState<boolean>(false);

  const currentLang = LANGUAGES[selectedLang];
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const pauseTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-typing and continuous loop effect
  useEffect(() => {
    // Clear any active timers
    if (timerRef.current) clearInterval(timerRef.current);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);

    setTypedLength(0);
    setIsTyping(true);
    setViewMode("code");
    setIsRunning(false);

    const fullText = currentLang.rawCode;
    let charIndex = 0;

    // Steady, realistic typing speed ("aste typinger moto hube")
    // Types ~1 to 2 characters every 24ms for a steady human-like cadence
    timerRef.current = setInterval(() => {
      // Advance by 1 char, or 2 if current char is whitespace/indent for natural flow
      const step = fullText[charIndex] === " " ? 2 : 1;
      charIndex = Math.min(charIndex + step, fullText.length);
      setTypedLength(charIndex);

      // When current language is finished typing
      if (charIndex >= fullText.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsTyping(false);

        // If continuous auto-loop is enabled:
        // Hold the completed code with full syntax highlight for 3.2 seconds,
        // then cycle automatically to the next language!
        if (isAutoLoop) {
          pauseTimerRef.current = setTimeout(() => {
            const currentIdx = CYCLE.indexOf(selectedLang);
            const nextLang = CYCLE[(currentIdx + 1) % CYCLE.length];
            setSelectedLang(nextLang);
          }, 3200);
        }
      }
    }, 24);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    };
  }, [selectedLang, isAutoLoop]);

  // Handle manual tab switch
  const handleSelectLang = (lang: LanguageKey) => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    setSelectedLang(lang);
  };

  // Toggle Auto-loop pause / resume
  const toggleAutoLoop = () => {
    if (isAutoLoop) {
      if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
      setIsAutoLoop(false);
    } else {
      setIsAutoLoop(true);
      // If already done typing, trigger next language after short delay
      if (!isTyping) {
        const currentIdx = CYCLE.indexOf(selectedLang);
        const nextLang = CYCLE[(currentIdx + 1) % CYCLE.length];
        setSelectedLang(nextLang);
      }
    }
  };

  // Instant skip typing
  const skipTyping = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTypedLength(currentLang.rawCode.length);
    setIsTyping(false);
  };

  // Replay typing manually
  const replayTyping = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    setTypedLength(0);
    setIsTyping(true);
    setViewMode("code");

    const fullText = currentLang.rawCode;
    let charIndex = 0;

    timerRef.current = setInterval(() => {
      const step = fullText[charIndex] === " " ? 2 : 1;
      charIndex = Math.min(charIndex + step, fullText.length);
      setTypedLength(charIndex);

      if (charIndex >= fullText.length) {
        if (timerRef.current) clearInterval(timerRef.current);
        setIsTyping(false);
        if (isAutoLoop) {
          pauseTimerRef.current = setTimeout(() => {
            const currentIdx = CYCLE.indexOf(selectedLang);
            const nextLang = CYCLE[(currentIdx + 1) % CYCLE.length];
            setSelectedLang(nextLang);
          }, 3200);
        }
      }
    }, 24);
  };

  // Run / Print Output button
  const handleRunCode = () => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current);
    setIsRunning(true);
    setViewMode("output");

    setTimeout(() => {
      setIsRunning(false);
    }, 350);
  };

  // Copy code
  const handleCopyCode = () => {
    navigator.clipboard.writeText(currentLang.rawCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: 0.25 }}
      className="md:col-span-12 rounded-2xl sm:rounded-3xl glass-strong glow-border p-3 sm:p-6 relative overflow-hidden group hover:border-primary/50 transition-all duration-500 shadow-card-soft"
    >
      {/* Background ambient lighting */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-24 -right-24 w-80 h-80 rounded-full bg-primary/15 blur-3xl"
      />

      {/* ============================================================== */}
      {/* TERMINAL HEADER & TOOLBAR                                      */}
      {/* ============================================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-3 pb-2.5 sm:pb-3 mb-2.5 sm:mb-3 border-b border-white/10">
        {/* Left: OS Dots + 3 Language Tabs */}
        <div className="flex items-center gap-2 sm:gap-3 overflow-x-auto scrollbar-hide py-0.5">
          {/* OS Traffic Dots */}
          <div className="flex items-center gap-1.5 flex-shrink-0 mr-0.5 sm:mr-1">
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-red-500/80 inline-block hover:opacity-100 transition-opacity" />
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-yellow-500/80 inline-block hover:opacity-100 transition-opacity" />
            <span className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-green-500/80 inline-block hover:opacity-100 transition-opacity" />
          </div>

          {/* 3 Language Tabs in sequence: Python -> Java -> HTML */}
          <div className="flex items-center gap-1 sm:gap-1.5 p-0.5 sm:p-1 rounded-xl bg-white/5 border border-white/10 text-[11px] sm:text-xs">
            {CYCLE.map((langKey) => {
              const lang = LANGUAGES[langKey];
              const isActive = selectedLang === langKey;
              return (
                <button
                  key={langKey}
                  type="button"
                  onClick={() => handleSelectLang(langKey)}
                  className={`px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg font-mono font-medium transition-all inline-flex items-center gap-1 sm:gap-1.5 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? "bg-primary text-white shadow-sm ring-1 ring-white/20"
                      : "text-muted-foreground hover:text-foreground hover:bg-white/5"
                  }`}
                >
                  <span className={`w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full ${lang.dotColor}`} />
                  <span>{lang.ext}</span>
                </button>
              );
            })}
          </div>

          {/* Auto-loop animation status pill */}
          <button
            onClick={toggleAutoLoop}
            className={`hidden md:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[11px] font-mono border transition-all cursor-pointer ${
              isAutoLoop
                ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
                : "bg-white/5 text-muted-foreground border-white/10"
            }`}
            title={isAutoLoop ? "Click to pause auto-typing animation loop" : "Click to resume auto-loop"}
          >
            {isAutoLoop ? (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                <span>Auto-Loop: ON</span>
                <Pause className="w-3 h-3 ml-0.5 opacity-70" />
              </>
            ) : (
              <>
                <span className="w-1.5 h-1.5 rounded-full bg-slate-500" />
                <span>Auto-Loop: Paused</span>
                <Play className="w-3 h-3 ml-0.5 opacity-70 fill-current" />
              </>
            )}
          </button>
        </div>

        {/* Right: Actions (Run/Print, View Switcher, Copy, Skip) */}
        <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap sm:flex-nowrap justify-end">
          {/* Mode Switcher: Code / Output / Preview */}
          <div className="flex items-center p-0.5 rounded-lg bg-white/5 border border-white/10 text-[11px] sm:text-xs">
            <button
              onClick={() => setViewMode("code")}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-medium inline-flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === "code"
                  ? "bg-white/15 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="View Code Editor"
            >
              <Code2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span className="hidden sm:inline">Code</span>
            </button>

            <button
              onClick={() => setViewMode("output")}
              className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-medium inline-flex items-center gap-1 transition-all cursor-pointer ${
                viewMode === "output"
                  ? "bg-white/15 text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title="View Printed Output"
            >
              <Terminal className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">Output</span>
            </button>

            {selectedLang === "html" && (
              <button
                onClick={() => setViewMode("preview")}
                className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-md font-medium inline-flex items-center gap-1 transition-all cursor-pointer ${
                  viewMode === "preview"
                    ? "bg-white/15 text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                title="View Rendered HTML Preview"
              >
                <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-sky-400" />
                <span className="hidden sm:inline">Preview</span>
              </button>
            )}
          </div>

          {/* RUN / PRINT OUTPUT BUTTON */}
          <button
            onClick={handleRunCode}
            disabled={isRunning}
            className="bg-emerald-500 hover:bg-emerald-600 text-black font-semibold text-[11px] sm:text-xs px-2.5 py-1 sm:px-3.5 sm:py-1.5 rounded-lg shadow-sm hover:shadow-neon transition-all inline-flex items-center gap-1 sm:gap-1.5 active:scale-95 cursor-pointer"
            title="Execute & Print Output"
          >
            <Play className={`w-3 h-3 sm:w-3.5 sm:h-3.5 fill-black ${isRunning ? "animate-spin" : ""}`} />
            <span>Print / Run</span>
          </button>

          {/* Skip / Replay */}
          {isTyping ? (
            <button
              onClick={skipTyping}
              className="text-[11px] sm:text-xs font-mono px-2 py-1 sm:py-1.5 rounded-md glass hover:bg-white/10 text-cyan-300 hover:text-cyan-200 transition-colors border border-cyan-500/20 cursor-pointer"
              title="Fast Forward to Complete Code"
            >
              Skip
            </button>
          ) : (
            <button
              onClick={replayTyping}
              className="p-1 sm:p-1.5 rounded-md glass hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              title="Replay Typing Animation"
            >
              <RotateCcw className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            </button>
          )}

          {/* Copy Button */}
          <button
            onClick={handleCopyCode}
            className="text-[11px] sm:text-xs font-mono px-2 py-1 sm:px-2.5 sm:py-1.5 rounded-md glass hover:bg-white/10 text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1 border border-white/10 cursor-pointer"
            title="Copy Code"
          >
            {copiedCode ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3" />
                <span className="hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ============================================================== */}
      {/* TERMINAL CONTENT SCREEN                                        */}
      {/* ============================================================== */}
      <div className="relative min-h-[220px] sm:min-h-[320px] rounded-xl sm:rounded-2xl bg-black/60 border border-white/10 p-3 sm:p-5 overflow-hidden backdrop-blur-md">
        {/* Terminal Sub-header Bar */}
        <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-muted-foreground mb-2 sm:mb-3 pb-1.5 sm:pb-2 border-b border-white/5">
          <div className="flex items-center gap-1.5 sm:gap-2">
            <span className="text-muted-foreground">Path:</span>
            <span className="text-foreground font-semibold">~/portfolio/{currentLang.ext}</span>
            <span className="text-[10px] text-muted-foreground hidden sm:inline">
              ({CYCLE.indexOf(selectedLang) + 1} of 3 in loop)
            </span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-[10px] sm:text-xs">{currentLang.label}</span>
            {isAutoLoop && (
              <span className="text-[10px] text-emerald-400/90 hidden sm:inline">
                {isTyping ? "● Typing steady..." : "✓ Complete (Next language loading...)"}
              </span>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ---------------------------------------------------------- */}
          {/* VIEW 1: CODE EDITOR (STEADY TYPING & COLOR TRANSITION)     */}
          {/* ---------------------------------------------------------- */}
          {viewMode === "code" && (
            <motion.div
              key={`code-${selectedLang}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <pre className="font-mono text-[11px] sm:text-sm leading-relaxed overflow-x-auto scrollbar-hide py-0.5 sm:py-1">
                {isTyping ? (
                  /* WHILE TYPING: Single distinctive glowing cyan color + steady cursor */
                  <code className="text-cyan-400 font-medium tracking-wide drop-shadow-[0_0_8px_rgba(34,211,238,0.45)]">
                    {currentLang.rawCode.slice(0, typedLength)}
                    <span className="inline-block w-2.5 h-4 bg-cyan-300 ml-0.5 animate-pulse align-middle shadow-[0_0_8px_#38bdf8]" />
                  </code>
                ) : (
                  /* WHEN TYPING FINISHES: Switches to rich syntax highlighted colors! */
                  <code className="transition-all duration-500 animate-fadeIn">
                    {currentLang.renderHighlighted()}
                    <span className="inline-block w-2 h-4 bg-primary/70 animate-pulse align-middle ml-1" />
                  </code>
                )}
              </pre>

              {/* Status footer for code view */}
              <div className="mt-2.5 sm:mt-4 pt-2 sm:pt-3 border-t border-white/5 flex flex-wrap items-center justify-between text-[10px] sm:text-[11px] font-mono text-muted-foreground gap-1.5 sm:gap-2">
                <div className="flex items-center gap-2">
                  {isTyping ? (
                    <span className="text-cyan-400 inline-flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
                      Live Typing in progress...
                    </span>
                  ) : (
                    <span className="text-emerald-400 inline-flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                      Finished &amp; Highlighted {isAutoLoop && "• Cycling..."}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleRunCode}
                    className="text-primary hover:text-primary-foreground hover:bg-primary/20 px-2 py-0.5 rounded transition-all inline-flex items-center gap-1 cursor-pointer"
                  >
                    Click <span className="font-bold underline">Print / Run</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* ---------------------------------------------------------- */}
          {/* VIEW 2: EXECUTED OUTPUT / CONSOLE                          */}
          {/* ---------------------------------------------------------- */}
          {viewMode === "output" && (
            <motion.div
              key={`output-${selectedLang}`}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-2 py-1 font-mono text-xs sm:text-sm"
            >
              {isRunning ? (
                <div className="py-8 flex flex-col items-center justify-center gap-3 text-muted-foreground">
                  <div className="w-6 h-6 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin" />
                  <p className="text-xs text-emerald-400 font-mono">
                    Executing {currentLang.command}...
                  </p>
                </div>
              ) : (
                <>
                  {currentLang.outputLines.map((line, idx) => {
                    if (line.type === "command") {
                      return (
                        <div key={idx} className="text-emerald-400 font-semibold flex items-center gap-1.5">
                          <span>{line.text}</span>
                        </div>
                      );
                    }
                    if (line.type === "info") {
                      return (
                        <div key={idx} className="text-slate-400 text-xs italic py-0.5">
                          {line.text}
                        </div>
                      );
                    }
                    if (line.type === "stdout") {
                      return (
                        <div
                          key={idx}
                          className="text-foreground pl-3 border-l-2 border-primary/40 py-0.5 leading-relaxed"
                        >
                          {line.text}
                        </div>
                      );
                    }
                    if (line.type === "success") {
                      return (
                        <div
                          key={idx}
                          className="mt-4 pt-3 border-t border-white/10 text-emerald-400 text-xs font-semibold flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{line.text}</span>
                        </div>
                      );
                    }
                    return null;
                  })}

                  <div className="mt-3 sm:mt-5 pt-2 sm:pt-3 border-t border-white/5 flex items-center justify-between text-[11px] sm:text-xs">
                    <button
                      onClick={() => setViewMode("code")}
                      className="glass text-[11px] sm:text-xs px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg hover:bg-white/10 text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 transition-all cursor-pointer"
                    >
                      <Code2 className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Back to Editor
                    </button>

                    {selectedLang === "html" && (
                      <button
                        onClick={() => setViewMode("preview")}
                        className="bg-primary/20 text-primary hover:bg-primary/30 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-lg text-[11px] sm:text-xs font-medium inline-flex items-center gap-1.5 transition-all cursor-pointer"
                      >
                        <Eye className="w-3 h-3 sm:w-3.5 sm:h-3.5" /> Preview Card
                      </button>
                    )}
                  </div>
                </>
              )}
            </motion.div>
          )}

          {/* ---------------------------------------------------------- */}
          {/* VIEW 3: LIVE PREVIEW (HTML SPECIFIC)                       */}
          {/* ---------------------------------------------------------- */}
          {viewMode === "preview" && selectedLang === "html" && (
            <motion.div
              key="html-preview"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="py-1 sm:py-2"
            >
              <div className="rounded-xl sm:rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/15 p-3.5 sm:p-6 shadow-2xl relative overflow-hidden">
                <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-4">
                  <span className="px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full text-[10px] sm:text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-emerald-400 animate-ping" />
                    🟢 Accepting Q2 2026 Projects
                  </span>
                  <span className="text-[9px] sm:text-[11px] font-mono text-muted-foreground uppercase tracking-widest">
                    HTML5 DOM OUTPUT
                  </span>
                </div>

                <h3 className="font-display text-lg sm:text-3xl font-bold text-foreground mb-0.5 sm:mb-1">
                  Sabbir
                </h3>
                <p className="text-xs sm:text-sm font-medium text-gradient mb-2.5 sm:mb-4">
                  Digital Marketing, Web Architecture &amp; AI Specialist
                </p>

                <div className="flex flex-wrap gap-1.5 sm:gap-2 mb-2.5 sm:mb-4">
                  <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium bg-blue-500/15 text-blue-300 border border-blue-500/30">
                    Meta &amp; Google Ads
                  </span>
                  <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium bg-cyan-500/15 text-cyan-300 border border-cyan-500/30">
                    High-Converting Web Platforms
                  </span>
                  <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-lg text-[10px] sm:text-xs font-medium bg-purple-500/15 text-purple-300 border border-purple-500/30">
                    Autonomous AI Agents
                  </span>
                </div>

                <blockquote className="p-2 sm:p-3 rounded-lg sm:rounded-xl bg-black/40 border-l-2 sm:border-l-4 border-primary text-[11px] sm:text-sm text-muted-foreground italic">
                  "High-converting ads, sub-second code &amp; autonomous AI pipelines."
                </blockquote>

                <div className="mt-3 sm:mt-5 pt-2 sm:pt-3 border-t border-white/10 flex items-center justify-between text-[10px] sm:text-xs text-muted-foreground">
                  <span>Rendered via virtual DOM engine</span>
                  <button
                    onClick={() => setViewMode("code")}
                    className="text-primary hover:underline inline-flex items-center gap-1 cursor-pointer"
                  >
                    View HTML source <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
