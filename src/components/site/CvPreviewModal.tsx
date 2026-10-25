import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Download,
  ExternalLink,
  FileText,
  Sparkles,
  MessageSquare,
  ShieldCheck,
  Maximize2,
} from "lucide-react";
import { scrollToSection } from "@/lib/scroll";

export function openCvModal(url?: string) {
  window.dispatchEvent(new CustomEvent("open-cv-modal", { detail: { url } }));
}

interface CvPreviewModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  resumeUrl?: string;
  candidateName?: string;
}

export default function CvPreviewModal({
  isOpen: controlledOpen,
  onClose: controlledClose,
  resumeUrl: initialUrl,
  candidateName = "Sabbir Hosen",
}: CvPreviewModalProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const [activeUrl, setActiveUrl] = useState(initialUrl || "");

  const isControlled = typeof controlledOpen === "boolean";
  const open = isControlled ? controlledOpen : internalOpen;

  useEffect(() => {
    if (initialUrl) setActiveUrl(initialUrl);
  }, [initialUrl]);

  useEffect(() => {
    const handleCustomOpen = (e: Event) => {
      const customEvent = e as CustomEvent<{ url?: string }>;
      if (customEvent.detail?.url) {
        setActiveUrl(customEvent.detail.url);
      }
      if (!isControlled) {
        setInternalOpen(true);
      }
    };

    window.addEventListener("open-cv-modal", handleCustomOpen);
    return () => window.removeEventListener("open-cv-modal", handleCustomOpen);
  }, [isControlled]);

  const handleClose = () => {
    if (isControlled && controlledClose) {
      controlledClose();
    } else {
      setInternalOpen(false);
    }
  };

  // Close on Escape key
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && open) {
        handleClose();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const fallbackPdf =
    activeUrl ||
    "https://xedwypkcwdebwaanfhpq.supabase.co/storage/v1/object/public/site-assets/about/1782368397851-hhxenp.pdf";

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-xl"
          onClick={handleClose}
        >
          {/* Modal Container */}
          <motion.div
            initial={{ scale: 0.94, opacity: 0, y: 15 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.94, opacity: 0, y: 15 }}
            transition={{ type: "spring", stiffness: 350, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl h-[92vh] max-h-[900px] flex flex-col rounded-2xl sm:rounded-3xl bg-[#0c0e14] border border-white/15 shadow-[0_20px_70px_rgba(0,0,0,0.85)] overflow-hidden"
          >
            {/* Header Bar */}
            <div className="flex items-center justify-between px-3.5 py-3 sm:px-6 sm:py-4 border-b border-white/10 bg-white/[0.02]">
              <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-primary/10 border border-primary/25 flex items-center justify-center text-primary shrink-0 shadow-[0_0_15px_rgba(118,185,0,0.2)]">
                  <FileText className="w-4 h-4 sm:w-5 sm:h-5" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xs sm:text-sm md:text-base font-semibold text-white tracking-wide truncate">
                      {candidateName} — Resume / CV
                    </h3>
                    <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/25">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      Live Verified
                    </span>
                  </div>
                  <p className="text-[10px] sm:text-xs text-muted-foreground truncate">
                    Marketer · Web Engineer · AI Automation Specialist
                  </p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
                <a
                  href={fallbackPdf}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hidden md:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/25 hover:bg-white/5 transition-all"
                  title="Open PDF in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open in Tab</span>
                </a>

                <a
                  href={fallbackPdf}
                  download="Sabbir_Hosen_CV.pdf"
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-primary/20 hover:bg-primary/30 border border-primary/40 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl transition-all shadow-[0_0_15px_rgba(118,185,0,0.15)] hover:scale-[1.02]"
                  title="Save PDF file to device"
                >
                  <Download className="w-3.5 h-3.5 text-primary" />
                  <span className="hidden sm:inline">Download</span>
                </a>

                <button
                  type="button"
                  onClick={handleClose}
                  className="p-1.5 sm:p-2 rounded-xl text-muted-foreground hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close modal"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </button>
              </div>
            </div>

            {/* Document Viewer Frame */}
            <div className="relative flex-1 w-full bg-[#08090D] overflow-hidden">
              <iframe
                src={`${fallbackPdf}#toolbar=1&navpanes=0&view=FitH`}
                title={`${candidateName} CV Document Preview`}
                className="w-full h-full border-0 bg-[#08090D]"
              />

              {/* Mobile / Fallback Helper Banner */}
              <div className="absolute bottom-2 left-2 right-2 sm:bottom-3 sm:left-4 sm:right-4 pointer-events-auto">
                <div className="bg-[#12151E]/95 border border-white/15 backdrop-blur-md px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl flex items-center justify-between gap-2 shadow-2xl">
                  <div className="flex items-center gap-2 text-[11px] sm:text-xs text-muted-foreground truncate">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">
                      Reading PDF on mobile or smaller screen?
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <a
                      href={fallbackPdf}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-medium text-primary hover:underline inline-flex items-center gap-1 px-2 py-1 rounded bg-primary/10 border border-primary/25"
                    >
                      <ExternalLink className="w-3 h-3" /> Full View
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Footer Actions */}
            <div className="px-4 py-3 sm:px-6 sm:py-3.5 border-t border-white/10 bg-white/[0.02] flex flex-wrap items-center justify-between gap-2">
              <div className="hidden sm:flex items-center gap-2 text-xs text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5 text-primary" />
                <span>Available for high-impact contracts & custom deployments</span>
              </div>
              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => {
                    handleClose();
                    scrollToSection("contact");
                  }}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-1.5 sm:px-5 sm:py-2 rounded-xl text-xs font-semibold bg-gradient-primary text-white neon-glow hover:scale-[1.02] transition-transform shadow-neon"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Let's Discuss a Project</span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
