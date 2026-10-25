import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Plus,
  ArrowUp,
  Sparkles,
  TrendingUp,
  Code2,
  Bot,
  Calculator,
  MessageCircle,
  ExternalLink,
  Trash2,
} from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { askGemini, ChatMessage } from "@/lib/gemini";

export function openAiTerminal(command?: string) {
  window.dispatchEvent(
    new CustomEvent("open-ai-terminal", { detail: { command } })
  );
}

type Message = {
  id: string;
  sender: "user" | "gemini" | "system";
  text: string;
  timestamp: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: any;
  };
};

const SUGGESTED_PROMPTS = [
  {
    cmd: "/audit-ads",
    label: "Audit Meta & Google Ads",
    icon: TrendingUp,
    query: "Can you audit my Meta and Google Ads performance and suggest how to improve ROAS?",
  },
  {
    cmd: "/estimate-web",
    label: "Web Specs & Stack",
    icon: Code2,
    query: "What is Sabbir's web development tech stack, timeline, and deliverables?",
  },
  {
    cmd: "/automate-ai",
    label: "AI Automations & Workflows",
    icon: Bot,
    query: "How can custom AI agents and n8n workflows automate my business operations?",
  },
  {
    cmd: "/calc-roi",
    label: "Calculate ROI & Pricing",
    icon: Calculator,
    query: "What are DevDigital's pricing packages and expected return on investment?",
  },
  {
    cmd: "/book-call",
    label: "Book Strategy Call",
    icon: MessageCircle,
    query: "How do I book a 1:1 strategy discovery session directly with Sabbir?",
  },
];

export default function AiTerminal() {
  const [isOpen, setIsOpen] = useState(false);
  const [showChips, setShowChips] = useState(false);
  const [inputVal, setInputVal] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "init",
      sender: "system",
      timestamp: "Ready",
      text: "👋 Hi! I'm Sabbir's official AI Copilot. Ask me anything about web development, paid ad scaling, AI automations, pricing, or booking a strategy meeting.",
    },
  ]);

  const { data: waData } = useSiteSettings("whatsapp", {
    enabled: true,
    phone_number: "8801941130981",
    default_message: "Hi Sabbir! I'm reaching out via your DevSabbir AI Copilot.",
  });

  const chatBottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const modalInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to latest output
  useEffect(() => {
    if (isOpen) {
      chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]);

  // Focus modal input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => modalInputRef.current?.focus(), 200);
    }
  }, [isOpen]);

  // Listen for custom trigger or keyboard shortcut Ctrl+J / Cmd+J
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "j") {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      } else if (e.key === "Escape") {
        if (showChips) {
          setShowChips(false);
        } else if (isOpen) {
          setIsOpen(false);
        }
      }
    };

    const handleCustomOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ command?: string }>;
      setIsOpen(true);
      if (customEvent.detail?.command) {
        handleSendMessage(customEvent.detail.command);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-ai-terminal", handleCustomOpen);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-ai-terminal", handleCustomOpen);
    };
  }, [isOpen, showChips]);

  const getNow = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleWhatsAppRedirect = (customMsg?: string) => {
    const rawPhone =
      waData.phone_number && !waData.phone_number.includes("1555")
        ? waData.phone_number
        : "8801941130981";
    let phone = rawPhone.replace(/\D/g, "");
    if (phone.startsWith("01")) {
      phone = "88" + phone;
    }
    const msg = customMsg || waData.default_message || "Hi Sabbir! Let's talk about my project.";
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const handleSendMessage = async (rawQuery?: string) => {
    const query = (rawQuery || inputVal).trim();
    if (!query || isProcessing) return;

    // Open chat window if not already open
    setIsOpen(true);
    setShowChips(false);
    setMobileExpanded(false);

    // Add user message
    const userMsg: Message = {
      id: Math.random().toString(),
      sender: "user",
      text: query,
      timestamp: getNow(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsProcessing(true);

    const lowerQuery = query.toLowerCase();

    // Quick instant commands
    if (lowerQuery === "/clear") {
      setMessages([
        {
          id: Math.random().toString(),
          sender: "system",
          timestamp: getNow(),
          text: "Chat history cleared. How can I assist you with your business goals?",
        },
      ]);
      setIsProcessing(false);
      return;
    }

    if (lowerQuery === "/book-call" || lowerQuery.includes("book meeting") || lowerQuery.includes("call")) {
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            sender: "gemini",
            timestamp: getNow(),
            text:
              "You can schedule a direct 1:1 strategy discovery session with Sabbir (Founder, DevDigital) or message him instantly on WhatsApp for immediate priority scheduling.",
            action: {
              label: "Chat Directly on WhatsApp",
              icon: MessageCircle,
              onClick: () =>
                handleWhatsAppRedirect("Hi Sabbir! I'd like to book a 1:1 strategy call with you."),
            },
          },
        ]);
        setIsProcessing(false);
      }, 400);
      return;
    }

    try {
      // Build history for Gemini
      const history: ChatMessage[] = messages
        .filter((m) => m.sender === "user" || m.sender === "gemini")
        .slice(-6)
        .map((m) => ({
          role: m.sender === "user" ? "user" : "model",
          text: m.text,
        }));

      // Call Google Gemini API
      const reply = await askGemini(query, history);

      const isContactRelated =
        reply.toLowerCase().includes("whatsapp") ||
        reply.toLowerCase().includes("book") ||
        reply.toLowerCase().includes("+880");

      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "gemini",
          timestamp: getNow(),
          text: reply,
          action: isContactRelated
            ? {
                label: "Connect with Sabbir on WhatsApp",
                icon: MessageCircle,
                onClick: () =>
                  handleWhatsAppRedirect(`Hi Sabbir! I asked your DevSabbir AI about: "${query}"`),
              }
            : undefined,
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          sender: "gemini",
          timestamp: getNow(),
          text:
            "Sabbir specializes in 3 core pillars:\n1. Meta & Google Ads Scaling (3x–5x ROAS + CAPI tracking)\n2. High-Performance Sub-Second Web Platforms (Next.js & Supabase)\n3. Custom AI Automation & Autonomous Pipelines\n\nWould you like to review pricing or chat directly with Sabbir?",
          action: {
            label: "Open WhatsApp Chat",
            icon: MessageCircle,
            onClick: () => handleWhatsAppRedirect(),
          },
        },
      ]);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage();
  };

  return (
    <>
      {/* ------------------------------------------------------------- */}
      {/* 1. EXPANDED CONVERSATION MODAL (MOBILE BOTTOM SHEET & DESKTOP) */}
      {/* ------------------------------------------------------------- */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center sm:justify-start p-0 sm:p-4 md:p-6 pointer-events-none">
            {/* Dark Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="absolute inset-0 bg-black/75 backdrop-blur-md pointer-events-auto"
            />

            {/* Conversation Window Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 30 }}
              transition={{ type: "spring", stiffness: 350, damping: 28 }}
              className="relative w-full sm:max-w-lg h-[90dvh] sm:h-[75vh] sm:max-h-[600px] mb-0 sm:mb-24 sm:ml-2 flex flex-col rounded-t-[26px] sm:rounded-3xl border-t sm:border border-white/15 bg-[#0A0D17]/98 shadow-[0_20px_70px_rgba(0,0,0,0.95)] backdrop-blur-2xl overflow-hidden pointer-events-auto z-10"
            >
              {/* Mobile Drag Indicator Handle */}
              <div className="w-10 h-1 bg-white/20 rounded-full mx-auto mt-2 mb-1 sm:hidden shrink-0" />

              {/* Header Bar */}
              <div className="flex items-center justify-between px-4 sm:px-5 py-3 border-b border-white/10 bg-white/[0.02] shrink-0">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                  <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-fuchsia-500 via-purple-500 to-blue-500 p-[1.5px] shadow-[0_0_15px_rgba(59,130,246,0.5)] shrink-0">
                    <div className="w-full h-full rounded-full bg-[#0A0D17] flex items-center justify-center text-blue-400">
                      <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 sm:gap-2">
                      <h3 className="text-xs sm:text-sm font-semibold text-white tracking-wide truncate">
                        DevSabbir AI Copilot
                      </h3>
                      <span className="text-[9px] sm:text-[10px] px-1.5 py-0.5 rounded-full font-mono bg-blue-500/15 text-blue-300 border border-blue-500/30 shrink-0">
                        Live
                      </span>
                    </div>
                    <p className="text-[10px] sm:text-[11px] text-muted-foreground truncate">
                      Powered by DevSabbir Knowledge Base & Gemini AI
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      setMessages([
                        {
                          id: Math.random().toString(),
                          sender: "system",
                          timestamp: getNow(),
                          text: "Buffer reset. What would you like to explore today?",
                        },
                      ]);
                    }}
                    className="p-1.5 rounded-xl text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                    title="Clear Chat History"
                    aria-label="Clear chat"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="p-1.5 rounded-xl text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                    title="Close"
                    aria-label="Close DevSabbir AI Assistant"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Chat Messages Body */}
              <div className="flex-1 overflow-y-auto p-3.5 sm:p-5 space-y-3 scrollbar-thin">
                {messages.map((m) => {
                  if (m.sender === "user") {
                    return (
                      <div key={m.id} className="flex flex-col items-end">
                        <div className="max-w-[85%] rounded-2xl rounded-tr-sm px-3.5 py-2 sm:px-4 sm:py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-xs sm:text-sm shadow-md">
                          {m.text}
                        </div>
                        <span className="text-[9px] sm:text-[10px] text-muted-foreground mt-1 px-1">
                          {m.timestamp}
                        </span>
                      </div>
                    );
                  }

                  if (m.sender === "system") {
                    return (
                      <div
                        key={m.id}
                        className="rounded-2xl p-3 sm:p-3.5 bg-white/[0.03] border border-white/10 text-slate-300 text-xs sm:text-sm leading-relaxed"
                      >
                        {m.text}
                      </div>
                    );
                  }

                  // Gemini output bubble
                  return (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex flex-col items-start"
                    >
                      <div className="max-w-[95%] sm:max-w-[92%] rounded-2xl rounded-tl-sm p-3.5 sm:p-4 bg-[#111422] border border-white/10 text-slate-100 text-xs sm:text-sm leading-relaxed shadow-lg">
                        <div className="flex items-center gap-1.5 text-[10px] text-blue-400 font-semibold mb-2">
                          <Sparkles className="w-3 h-3" />
                          <span>DEVSABBIR AI</span>
                          <span className="text-muted-foreground ml-auto">{m.timestamp}</span>
                        </div>

                        <div className="whitespace-pre-line text-slate-200">
                          {m.text}
                        </div>

                        {/* WhatsApp / Booking CTA if applicable */}
                        {m.action && (
                          <div className="mt-3 pt-3 border-t border-white/10 flex items-center">
                            <button
                              type="button"
                              onClick={m.action.onClick}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-primary text-white text-xs font-semibold shadow-neon hover:scale-[1.02] transition-transform"
                            >
                              {m.action.icon && <m.action.icon className="w-3.5 h-3.5" />}
                              <span>{m.action.label}</span>
                              <ExternalLink className="w-3 h-3 opacity-80" />
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}

                {isProcessing && (
                  <div className="flex items-center gap-2.5 px-3 py-2 text-xs text-blue-400 font-medium">
                    <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping" />
                    <span>DevSabbir AI is analyzing and replying...</span>
                  </div>
                )}

                <div ref={chatBottomRef} />
              </div>

              {/* In-Modal Suggested Chips Drawer */}
              <AnimatePresence>
                {showChips && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="px-3 py-2 border-t border-white/10 bg-[#080a13] flex flex-wrap gap-1.5 shrink-0 max-h-36 overflow-y-auto"
                  >
                    {SUGGESTED_PROMPTS.map((p) => {
                      const Icon = p.icon;
                      return (
                        <button
                          key={p.cmd}
                          type="button"
                          onClick={() => handleSendMessage(p.query)}
                          className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-blue-500/40 text-[11px] text-slate-200 transition-all flex items-center gap-1.5"
                        >
                          <Icon className="w-3 h-3 text-blue-400 shrink-0" />
                          <span>{p.label}</span>
                        </button>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Dedicated In-Modal Input Form Bar */}
              <form
                onSubmit={handleSubmit}
                className="p-2.5 sm:p-3 bg-black/80 border-t border-white/10 flex items-center gap-1.5 sm:gap-2 shrink-0 pb-safe"
              >
                <button
                  type="button"
                  onClick={() => setShowChips((prev) => !prev)}
                  className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-all shrink-0 ${
                    showChips ? "bg-white/15 text-white rotate-45" : "hover:bg-white/10"
                  }`}
                  title="Suggested Prompts"
                  aria-label="Toggle prompt templates"
                >
                  <Plus className="w-4 h-4" />
                </button>

                <input
                  ref={modalInputRef}
                  type="text"
                  value={inputVal}
                  onChange={(e) => setInputVal(e.target.value)}
                  placeholder="Ask DevSabbir AI..."
                  disabled={isProcessing}
                  className="flex-1 bg-white/[0.05] border border-white/10 focus:border-blue-500/50 rounded-full px-3.5 py-1.5 sm:py-2 text-xs sm:text-sm text-white placeholder:text-slate-400 outline-none"
                />

                <button
                  type="submit"
                  disabled={!inputVal.trim() || isProcessing}
                  className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#1A73E8] hover:bg-[#1557b0] text-white flex items-center justify-center shrink-0 shadow-md transition-all hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <Sparkles className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ------------------------------------------------------------- */}
      {/* 2. FLOATING TRIGGERS: MOBILE COMPACT "+" VS DESKTOP PILL BAR  */}
      {/* ------------------------------------------------------------- */}

      {/* A. MOBILE-ONLY: THE ORIGINAL SLEEK GLOWING "+" & EXPANDABLE PILL */}
      {!isOpen && (
        <div className="block sm:hidden fixed bottom-3.5 left-3.5 z-40">
          <AnimatePresence mode="wait">
            {!mobileExpanded ? (
              /* 1. Collapsed State: Just the sleek glowing "+" button */
              <motion.div
                key="mobile-collapsed-plus"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.2 }}
                className="relative flex items-center justify-center"
              >
                {/* Ambient Aura */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute w-16 h-16 rounded-full blur-[16px] opacity-80"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(236, 72, 153, 0.6) 0%, rgba(37, 99, 235, 0.6) 70%, transparent 100%)",
                  }}
                />

                <motion.button
                  type="button"
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    setMobileExpanded(true);
                    setTimeout(() => inputRef.current?.focus(), 150);
                  }}
                  className="relative w-12 h-12 rounded-full p-[1.5px] bg-gradient-to-tr from-fuchsia-500 via-purple-500 to-blue-500 shadow-[0_4px_22px_rgba(0,0,0,0.85)] z-10 flex items-center justify-center cursor-pointer"
                  title="Ask DevSabbir AI"
                  aria-label="Open DevSabbir AI Input"
                >
                  <div className="w-full h-full rounded-full bg-[#090b14]/95 backdrop-blur-2xl flex items-center justify-center text-white relative">
                    <Plus className="w-5 h-5 text-white" />
                    <span className="absolute top-2 right-2 flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-400" />
                    </span>
                  </div>
                </motion.button>
              </motion.div>
            ) : (
              /* 2. Expanded State: Expands right in place so user writes directly here! */
              <motion.div
                key="mobile-expanded-pill"
                initial={{ opacity: 0, width: 48, scale: 0.9 }}
                animate={{ opacity: 1, width: "calc(100vw - 84px)", scale: 1 }}
                exit={{ opacity: 0, width: 48, scale: 0.9 }}
                transition={{ type: "spring", stiffness: 350, damping: 27 }}
                className="relative max-w-[420px]"
              >
                {/* Halftone Glow Halo */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-[-10px] overflow-hidden rounded-full"
                >
                  <div
                    className="absolute left-[-10px] top-1/2 -translate-y-1/2 w-[140px] h-[80px] rounded-full blur-[22px] opacity-75"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(236, 72, 153, 0.55) 0%, rgba(168, 85, 247, 0.25) 50%, transparent 75%)",
                    }}
                  />
                  <div
                    className="absolute right-[-10px] top-1/2 -translate-y-1/2 w-[140px] h-[80px] rounded-full blur-[22px] opacity-75"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(37, 99, 235, 0.6) 0%, rgba(6, 182, 212, 0.3) 50%, transparent 75%)",
                    }}
                  />
                </div>

                {/* Form Capsule */}
                <form
                  onSubmit={handleSubmit}
                  className="relative w-full rounded-full p-[1.5px] bg-gradient-to-r from-fuchsia-500/70 via-purple-500/30 to-blue-500/80 shadow-[0_10px_35px_rgba(0,0,0,0.85)] z-10"
                >
                  <div className="w-full rounded-full bg-[#090b14]/95 backdrop-blur-2xl flex items-center px-2.5 py-1.5">
                    {/* Close / Collapse Toggle */}
                    <button
                      type="button"
                      onClick={() => setMobileExpanded(false)}
                      className="w-7 h-7 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-all shrink-0 hover:bg-white/10"
                      title="Collapse"
                      aria-label="Collapse input bar"
                    >
                      <X className="w-4 h-4" />
                    </button>

                    {/* Vertical Blue Cursor Line */}
                    <span
                      aria-hidden="true"
                      className="h-4 w-[1.5px] bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full animate-pulse mx-1.5 shrink-0"
                    />

                    {/* Input Field: Type directly here! */}
                    <input
                      ref={inputRef}
                      type="text"
                      value={inputVal}
                      onChange={(e) => setInputVal(e.target.value)}
                      placeholder="Ask DevSabbir AI"
                      disabled={isProcessing}
                      className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-slate-400 text-xs font-sans tracking-wide min-w-0"
                      aria-label="Ask DevSabbir AI input"
                    />

                    {/* Submit Blue Button */}
                    <button
                      type="submit"
                      disabled={isProcessing}
                      onClick={() => {
                        if (!inputVal.trim()) {
                          setIsOpen(true);
                        }
                      }}
                      className="w-7 h-7 rounded-full bg-[#1A73E8] hover:bg-[#1557b0] text-white flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(26,115,232,0.65)] ml-1.5 cursor-pointer"
                      title={inputVal.trim() ? "Send to DevSabbir AI" : "Open DevSabbir AI"}
                      aria-label="Submit prompt to DevSabbir AI"
                    >
                      {isProcessing ? (
                        <Sparkles className="w-3.5 h-3.5 animate-spin" />
                      ) : inputVal.trim() ? (
                        <ArrowUp className="w-3.5 h-3.5 stroke-[2.5]" />
                      ) : (
                        <div className="flex items-center justify-center gap-[1.5px] h-3">
                          <span className="w-[1.5px] h-1.5 rounded-full bg-white animate-pulse" />
                          <span className="w-[1.5px] h-3 rounded-full bg-white" />
                          <span className="w-[1.5px] h-2 rounded-full bg-white" />
                          <span className="w-[1.5px] h-1 rounded-full bg-white animate-pulse" />
                        </div>
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* B. DESKTOP & TABLET: THE FULL FLOATING GEMINI PILL BAR */}
      <div className="hidden sm:block fixed bottom-6 left-6 z-40 w-[400px] md:w-[440px] max-w-[460px]">
        {/* Quick Suggestion Chips Menu on Desktop (Toggled by Plus button) */}
        <AnimatePresence>
          {showChips && !isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="absolute bottom-full mb-3 left-0 w-full p-3 rounded-2xl bg-[#0c0e18]/95 border border-white/15 backdrop-blur-2xl shadow-[0_15px_40px_rgba(0,0,0,0.8)] z-50 flex flex-col gap-1.5"
            >
              <div className="flex items-center justify-between pb-1 mb-1 border-b border-white/10 text-xs text-muted-foreground px-1">
                <span className="font-medium flex items-center gap-1.5 text-white text-xs">
                  <Sparkles className="w-3.5 h-3.5 text-blue-400" /> Suggested Prompts
                </span>
                <button
                  type="button"
                  onClick={() => setShowChips(false)}
                  className="text-muted-foreground hover:text-white text-[11px]"
                >
                  Close
                </button>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {SUGGESTED_PROMPTS.map((p) => {
                  const Icon = p.icon;
                  return (
                    <button
                      key={p.cmd}
                      type="button"
                      onClick={() => handleSendMessage(p.query)}
                      className="text-left px-3 py-2 rounded-xl bg-white/[0.03] hover:bg-white/[0.08] border border-white/10 hover:border-blue-500/40 text-xs text-slate-200 transition-all flex items-center gap-2 group"
                    >
                      <Icon className="w-3.5 h-3.5 text-blue-400 shrink-0 group-hover:scale-110 transition-transform" />
                      <span className="truncate">{p.label}</span>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Ambient Halftone Dot Mesh & Neon Aura Behind the Pill Bar */}
        <div className="relative flex items-center justify-center">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-[-18px] overflow-hidden rounded-full"
          >
            {/* Left Pink/Magenta Aura Sphere & Dot Matrix */}
            <div
              className="absolute left-[10px] top-1/2 -translate-y-1/2 w-[200px] h-[110px] rounded-full blur-[32px] opacity-75"
              style={{
                background:
                  "radial-gradient(circle, rgba(236, 72, 153, 0.55) 0%, rgba(168, 85, 247, 0.25) 50%, transparent 75%)",
              }}
            />
            <div
              className="absolute left-[15px] top-1/2 -translate-y-1/2 w-[170px] h-[95px] opacity-45 [mask-image:radial-gradient(circle,black_40%,transparent_75%)]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #f472b6 1.5px, transparent 1.5px)",
                backgroundSize: "9px 9px",
              }}
            />

            {/* Right Electric Blue Aura Sphere & Dot Matrix */}
            <div
              className="absolute right-[10px] top-1/2 -translate-y-1/2 w-[200px] h-[110px] rounded-full blur-[32px] opacity-75"
              style={{
                background:
                  "radial-gradient(circle, rgba(37, 99, 235, 0.6) 0%, rgba(6, 182, 212, 0.3) 50%, transparent 75%)",
              }}
            />
            <div
              className="absolute right-[15px] top-1/2 -translate-y-1/2 w-[170px] h-[95px] opacity-45 [mask-image:radial-gradient(circle,black_40%,transparent_75%)]"
              style={{
                backgroundImage:
                  "radial-gradient(circle, #60a5fa 1.5px, transparent 1.5px)",
                backgroundSize: "9px 9px",
              }}
            />
          </div>

          {/* ----------------------------------------------------------- */}
          {/* THE PILL CAPSULE FORM (Matches exact screenshot layout)     */}
          {/* ----------------------------------------------------------- */}
          <form
            onSubmit={handleSubmit}
            className="relative w-full rounded-full p-[1.5px] bg-gradient-to-r from-fuchsia-500/70 via-purple-500/30 to-blue-500/80 shadow-[0_10px_35px_rgba(0,0,0,0.85)] z-10 transition-all focus-within:shadow-[0_0_25px_rgba(37,99,235,0.4)]"
          >
            <div className="w-full rounded-full bg-[#090b14]/95 backdrop-blur-2xl flex items-center px-4 py-2.5">
              {/* 1. Left Plus Button (+) */}
              <button
                type="button"
                onClick={() => setShowChips((prev) => !prev)}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-slate-300 hover:text-white transition-all shrink-0 ${
                  showChips ? "bg-white/15 text-white rotate-45" : "hover:bg-white/10"
                }`}
                title="Prompt Templates & Commands"
                aria-label="Toggle prompt templates"
              >
                <Plus className="w-5 h-5 transition-transform" />
              </button>

              {/* 2. Vertical Blue Cursor Line (|) */}
              <span
                aria-hidden="true"
                className="h-5 w-[1.5px] bg-gradient-to-b from-blue-400 to-cyan-400 rounded-full animate-pulse mx-2 shrink-0"
              />

              {/* 3. Text Input (Ask DevSabbir AI) */}
              <input
                ref={inputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                onFocus={() => {
                  if (messages.length > 1) {
                    setIsOpen(true);
                  }
                }}
                placeholder="Ask DevSabbir AI"
                disabled={isProcessing}
                className="flex-1 bg-transparent border-none outline-none text-white placeholder:text-slate-400 text-sm font-sans tracking-wide min-w-0"
                aria-label="Ask DevSabbir AI input"
              />

              {/* 4. NOTE: Per user request ("voice ta dio,na"), NO voice / microphone icon is included */}

              {/* 5. Right Vibrant Blue Circular Button */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-9 h-9 rounded-full bg-[#1A73E8] hover:bg-[#1557b0] text-white flex items-center justify-center shrink-0 shadow-[0_0_15px_rgba(26,115,232,0.65)] hover:shadow-[0_0_24px_rgba(26,115,232,0.9)] transition-all hover:scale-105 active:scale-95 ml-2 cursor-pointer"
                title={inputVal.trim() ? "Send to DevSabbir AI" : "Ask DevSabbir AI"}
                aria-label="Submit prompt to DevSabbir AI"
              >
                {isProcessing ? (
                  <Sparkles className="w-3.5 h-3.5 animate-spin" />
                ) : inputVal.trim() ? (
                  <ArrowUp className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  /* 4-bar Audio Waveform Icon (Matches Screenshot) */
                  <div className="flex items-center justify-center gap-[2px] h-3.5">
                    <span className="w-[2px] h-2 rounded-full bg-white animate-pulse" />
                    <span className="w-[2px] h-3.5 rounded-full bg-white" />
                    <span className="w-[2px] h-2.5 rounded-full bg-white" />
                    <span className="w-[2px] h-1.5 rounded-full bg-white animate-pulse" />
                  </div>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
