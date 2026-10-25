import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence, animate } from "framer-motion";
import {
  Megaphone,
  Code2,
  Bot,
  Sparkles,
  TrendingUp,
  ArrowRight,
  Check,
  ChevronDown,
  TrendingDown,
  CheckCircle2,
} from "lucide-react";
import SectionWatermark from "@/components/ui/SectionWatermark";
import { useSiteSettings } from "@/hooks/useSiteSettings";
import { DEFAULT_ROI_SETTINGS, type RoiSettings } from "@/pages/admin/RoiAdmin";

// ============================================================================
// CONSTANTS & CONFIGURATION
// ============================================================================
const USD_TO_BDT = 120; // 1 USD = 120 BDT

export type ServiceTab = "marketing" | "web" | "ai";
export type Currency = "BDT" | "USD";
export type TimePeriod = 3 | 6 | 12;
export type Scenario = "conservative" | "realistic" | "optimistic";

interface ScenarioConfig {
  id: Scenario;
  label: string;
  multiplier: number;
  tag: string;
}

const SCENARIOS: ScenarioConfig[] = [
  { id: "conservative", label: "Conservative", multiplier: 0.7, tag: "0.7x" },
  { id: "realistic", label: "Realistic", multiplier: 1.0, tag: "1.0x" },
  { id: "optimistic", label: "Optimistic", multiplier: 1.3, tag: "1.3x" },
];

const SERVICE_TABS = [
  {
    id: "marketing" as ServiceTab,
    label: "Digital Marketing",
    sub: "Paid Ads & CRO",
    icon: Megaphone,
  },
  {
    id: "web" as ServiceTab,
    label: "Web Development",
    sub: "Funnels & Platforms",
    icon: Code2,
  },
  {
    id: "ai" as ServiceTab,
    label: "AI Automation",
    sub: "Workflows & Agents",
    icon: Bot,
  },
];

const METRIC_NAMES: Record<ServiceTab, string[]> = {
  marketing: [
    "Monthly Ad Spend",
    "Agency / Freelancer Fee",
    "Average CPC",
    "Website Conversion Rate",
    "Avg Revenue Per Sale",
    "Profit Margin",
  ],
  web: [
    "Development Fee",
    "Monthly Visitors",
    "Current Conversion Rate",
    "Expected Conversion Rate",
    "Avg Revenue Per Customer",
    "Profit Margin",
    "Hosting & Maintenance",
  ],
  ai: [
    "Setup & Bot Architecture",
    "Monthly Tool & API Cost",
    "Hours Saved Per Week",
    "Staff Cost Per Hour",
    "Extra Leads Qualified",
    "Lead Close Rate",
    "Avg Revenue Per Lead",
  ],
};

// Helper to format currency/numbers with commas
function formatNumber(num: number, decimals = 0): string {
  if (!Number.isFinite(num)) return "0";
  return num.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

// ============================================================================
// SMOOTH COUNT-UP NUMBER COMPONENT
// ============================================================================
function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
  decimals = 0,
  className = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  className?: string;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValueRef = useRef(value);

  useEffect(() => {
    const controls = animate(prevValueRef.current, value, {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (latest) => {
        setDisplayValue(latest);
      },
    });
    prevValueRef.current = value;
    return () => controls.stop();
  }, [value]);

  return (
    <span className={className}>
      {prefix}
      {formatNumber(displayValue, decimals)}
      {suffix}
    </span>
  );
}

// ============================================================================
// SYNCHRONIZED COMPACT SLIDER INPUT COMPONENT
// ============================================================================
interface RoiSliderInputProps {
  label: string;
  value: number;
  onChange: (val: number) => void;
  min: number;
  max: number;
  step: number;
  prefix?: string;
  suffix?: string;
  decimals?: number;
  hint?: string;
}

function RoiSliderInput({
  label,
  value,
  onChange,
  min,
  max,
  step,
  prefix = "",
  suffix = "",
  decimals = 0,
  hint,
}: RoiSliderInputProps) {
  const [textInput, setTextInput] = useState(() =>
    decimals > 0 ? value.toFixed(decimals) : String(Math.round(value))
  );
  const [isFocused, setIsFocused] = useState(false);

  useEffect(() => {
    if (!isFocused) {
      setTextInput(decimals > 0 ? value.toFixed(decimals) : String(Math.round(value)));
    }
  }, [value, isFocused, decimals]);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = parseFloat(e.target.value);
    if (Number.isFinite(num)) {
      onChange(num);
    }
  };

  const handleTextInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setTextInput(raw);
    const parsed = parseFloat(raw.replace(/,/g, ""));
    if (Number.isFinite(parsed)) {
      onChange(Math.min(Math.max(parsed, min), max * 2));
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    const parsed = parseFloat(textInput.replace(/,/g, ""));
    if (!Number.isFinite(parsed) || parsed < min) {
      onChange(min);
      setTextInput(decimals > 0 ? min.toFixed(decimals) : String(Math.round(min)));
    } else if (parsed > max) {
      onChange(max);
      setTextInput(decimals > 0 ? max.toFixed(decimals) : String(Math.round(max)));
    } else {
      onChange(parsed);
      setTextInput(decimals > 0 ? parsed.toFixed(decimals) : String(Math.round(parsed)));
    }
  };

  const clampedVal = Math.min(Math.max(value, min), max);
  const progressPercent = max > min ? ((clampedVal - min) / (max - min)) * 100 : 0;

  return (
    <div className="roi-input-card group rounded-xl bg-[#0F121F]/85 border border-white/[0.08] hover:border-[#9D6BFF]/45 px-3 py-2 sm:px-3.5 sm:py-2.5 transition-all duration-200">
      {/* Label & Synchronized Field */}
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <div className="min-w-0 flex-1">
          <label className="text-xs sm:text-[13px] font-semibold text-slate-200 block truncate leading-tight">
            {label}
          </label>
          {hint && (
            <span className="text-[10px] text-slate-400 font-normal block truncate leading-tight mt-0.5">
              {hint}
            </span>
          )}
        </div>

        <div
          className={`flex items-center gap-1 px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-lg bg-[#161B2E] border shrink-0 transition-all duration-200 shadow-inner ${
            isFocused
              ? "border-[#9D6BFF] ring-1 ring-[#9D6BFF]/30 shadow-[0_0_10px_rgba(157,107,255,0.25)]"
              : "border-white/10 group-hover:border-white/20"
          }`}
        >
          {prefix && (
            <span className="text-[11px] sm:text-xs font-mono font-bold text-[#9D6BFF]">
              {prefix}
            </span>
          )}
          <input
            type="text"
            inputMode="decimal"
            value={isFocused ? textInput : formatNumber(value, decimals)}
            onFocus={() => setIsFocused(true)}
            onBlur={handleBlur}
            onChange={handleTextInputChange}
            className="w-16 sm:w-20 bg-transparent text-right font-mono text-xs sm:text-[13px] font-bold text-white focus:outline-none"
          />
          {suffix && (
            <span className="text-[10px] sm:text-[11px] font-mono text-slate-400 font-medium">
              {suffix}
            </span>
          )}
        </div>
      </div>

      {/* Ultra-slim Slider */}
      <div className="relative pt-0.5 pb-0.5">
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={clampedVal}
          onChange={handleSliderChange}
          className="roi-slider w-full touch-pan-y"
          style={{
            background: `linear-gradient(to right, #9D6BFF 0%, #9D6BFF ${progressPercent}%, #1F2438 ${progressPercent}%, #1F2438 100%)`,
          }}
        />
      </div>

      {/* Min & Max Indicators (Slim & Fine-grained) */}
      <div className="flex justify-between text-[8.5px] sm:text-[9px] font-mono text-slate-400 mt-0.5 select-none leading-none">
        <span>
          {prefix}
          {formatNumber(min, decimals)}
          {suffix}
        </span>
        <span>
          {prefix}
          {formatNumber(max, decimals)}
          {suffix}
        </span>
      </div>
    </div>
  );
}

// ============================================================================
// COMPACT MINI COMPARISON CHART
// ============================================================================
function InvestmentVsProfitBar({
  investment,
  profit,
  currencySymbol,
}: {
  investment: number;
  profit: number;
  currencySymbol: string;
}) {
  const safeInvestment = Math.max(0, investment);
  const safeProfit = Math.max(0, profit);
  const maxVal = Math.max(safeInvestment, safeProfit, 1);

  const investWidth = safeInvestment > 0 ? Math.min(100, Math.max(6, (safeInvestment / maxVal) * 100)) : 0;
  const profitWidth = safeProfit > 0 ? Math.min(100, Math.max(6, (safeProfit / maxVal) * 100)) : 0;

  return (
    <div className="rounded-xl bg-[#0D0B1C]/90 border border-white/[0.08] p-3 space-y-2">
      <div className="flex items-center justify-between text-[11px] font-mono">
        <span className="text-slate-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
          Total Investment
        </span>
        <span className="font-bold text-slate-200">
          {currencySymbol}
          {formatNumber(safeInvestment)}
        </span>
      </div>

      <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
        <motion.div
          initial={false}
          animate={{ width: `${investWidth}%` }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-purple-600 to-[#8B5CF6] shadow-[0_0_8px_rgba(139,92,246,0.5)]"
        />
      </div>

      <div className="flex items-center justify-between text-[11px] font-mono pt-0.5">
        <span className="text-slate-400 flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-400" />
          Projected Gross Benefit
        </span>
        <span className="font-bold text-emerald-400">
          {currencySymbol}
          {formatNumber(safeProfit)}
        </span>
      </div>

      <div className="w-full h-1.5 rounded-full bg-slate-800/80 overflow-hidden">
        <motion.div
          initial={false}
          animate={{ width: `${profitWidth}%` }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.5)]"
        />
      </div>
    </div>
  );
}

// ============================================================================
// MAIN ROI CALCULATOR COMPONENT
// ============================================================================
export default function RoiCalculator() {
  const { data: roiConfig } = useSiteSettings<RoiSettings>(
    "roi_calculator_settings",
    DEFAULT_ROI_SETTINGS
  );

  // Global Controls State
  const [currency, setCurrency] = useState<Currency>("BDT");
  const [months, setMonths] = useState<TimePeriod>(6);
  const [activeTab, setActiveTab] = useState<ServiceTab>("marketing");
  const [scenario, setScenario] = useState<Scenario>("realistic");

  // Dropdown Open State & Click-outside ref with mobile-safe touch handling
  const [isServiceDropdownOpen, setIsServiceDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isServiceDropdownOpen) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsServiceDropdownOpen(false);
      }
    };

    // Defer listener registration by 100ms so mobile touch doesn't immediately dismiss the open dropdown
    const timer = window.setTimeout(() => {
      document.addEventListener("click", handleOutsideClick);
      document.addEventListener("touchend", handleOutsideClick);
    }, 100);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("click", handleOutsideClick);
      document.removeEventListener("touchend", handleOutsideClick);
    };
  }, [isServiceDropdownOpen]);

  const scenariosList = useMemo(() => [
    { id: "conservative" as Scenario, label: "Conservative", multiplier: roiConfig?.conservative_mult ?? 0.7, tag: `${roiConfig?.conservative_mult ?? 0.7}x` },
    { id: "realistic" as Scenario, label: "Realistic", multiplier: roiConfig?.realistic_mult ?? 1.0, tag: `${roiConfig?.realistic_mult ?? 1.0}x` },
    { id: "optimistic" as Scenario, label: "Optimistic", multiplier: roiConfig?.optimistic_mult ?? 1.3, tag: `${roiConfig?.optimistic_mult ?? 1.3}x` },
  ], [roiConfig]);

  const currencySymbol = currency === "BDT" ? "৳" : "$";
  const scenarioMultiplier =
    scenariosList.find((s) => s.id === scenario)?.multiplier ?? 1.0;

  // Linear / Apple style Floating Glass Neon Scrollbar State
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollPercent, setScrollPercent] = useState(0);

  const totalMetrics = (METRIC_NAMES[activeTab] || []).length;

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    const { scrollTop, scrollHeight, clientHeight } = el;
    const maxScroll = scrollHeight - clientHeight;
    const pct = maxScroll > 0 ? (scrollTop / maxScroll) * 100 : 0;
    setScrollPercent(Math.min(100, Math.max(0, pct)));
  };

  // Reset scroll on activeTab change
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
      setScrollPercent(0);
    }
  }, [activeTab]);

  // 1. Digital Marketing State (Base values kept in BDT, default to 0 as requested)
  const [mAdSpend, setMAdSpend] = useState<number>(0);
  const [mFreelancerFee, setMFreelancerFee] = useState<number>(0);
  const [mCpc, setMCpc] = useState<number>(0);
  const [mConvRate, setMConvRate] = useState<number>(0); // %
  const [mAvgRevenue, setMAvgRevenue] = useState<number>(0);
  const [mMargin, setMMargin] = useState<number>(0); // %

  // 2. Web Development State (Base values kept in BDT, default to 0 as requested)
  const [wWebsiteCost, setWWebsiteCost] = useState<number>(0);
  const [wVisitors, setWVisitors] = useState<number>(0);
  const [wCurrentConv, setWCurrentConv] = useState<number>(0); // %
  const [wNewConv, setWNewConv] = useState<number>(0); // %
  const [wAvgRevenue, setWAvgRevenue] = useState<number>(0);
  const [wMargin, setWMargin] = useState<number>(0); // %
  const [wMaintenance, setWMaintenance] = useState<number>(0);

  // 3. AI Automation State (Base values kept in BDT, default to 0 as requested)
  const [aSetupCost, setASetupCost] = useState<number>(0);
  const [aMonthlyCost, setAMonthlyCost] = useState<number>(0);
  const [aHoursSavedPerWeek, setAHoursSavedPerWeek] = useState<number>(0);
  const [aStaffCostPerHour, setAStaffCostPerHour] = useState<number>(0);
  const [aExtraLeads, setAExtraLeads] = useState<number>(0);
  const [aLeadRate, setALeadRate] = useState<number>(0); // %
  const [aAvgRevenue, setAAvgRevenue] = useState<number>(0);

  // Calculations Engine
  const { totalInvestment, totalProfit, netProfit, roiPercent, paybackPeriodText } =
    useMemo(() => {
      let rawBenefit = 0;
      let rawInvestment = 0;

      const rate = currency === "USD" ? (roiConfig?.usd_to_bdt || USD_TO_BDT) : 1;

      if (activeTab === "marketing") {
        const adSpend = mAdSpend / rate;
        const freelancerFee = mFreelancerFee / rate;
        const cpc = mCpc > 0 ? mCpc / rate : 0;
        const avgRev = mAvgRevenue / rate;

        const clicks = cpc > 0 ? adSpend / cpc : 0;
        const sales = clicks * (mConvRate / 100);
        const grossRevenue = sales * avgRev * months;
        const rawGrossProfit = grossRevenue * (mMargin / 100);

        rawBenefit = rawGrossProfit;
        rawInvestment = (adSpend + freelancerFee) * months;
      } else if (activeTab === "web") {
        const websiteCost = wWebsiteCost / rate;
        const maintenance = wMaintenance / rate;
        const avgRev = wAvgRevenue / rate;

        const convLift = Math.max(0, wNewConv - wCurrentConv);
        const extraCustomers = wVisitors * (convLift / 100);
        const grossRevenue = extraCustomers * avgRev * months;
        const rawGrossProfit = grossRevenue * (wMargin / 100);

        rawBenefit = rawGrossProfit;
        rawInvestment = websiteCost + maintenance * months;
      } else if (activeTab === "ai") {
        const setupCost = aSetupCost / rate;
        const monthlyCost = aMonthlyCost / rate;
        const staffCost = aStaffCostPerHour / rate;
        const avgRev = aAvgRevenue / rate;

        const timeSavings = aHoursSavedPerWeek * 4.33 * months * staffCost;
        const extraRevenue = aExtraLeads * (aLeadRate / 100) * avgRev * months;
        const rawTotalProfit = timeSavings + extraRevenue;

        rawBenefit = rawTotalProfit;
        rawInvestment = setupCost + monthlyCost * months;
      }

      // Scenario Multiplier applies ONLY to profit, not investment
      const scaledBenefit = rawBenefit * scenarioMultiplier;
      const calculatedNetProfit = scaledBenefit - rawInvestment;

      const calculatedRoi =
        rawInvestment > 0 ? (calculatedNetProfit / rawInvestment) * 100 : 0;

      let calculatedPaybackText = "—";
      if (rawInvestment === 0 && scaledBenefit === 0) {
        calculatedPaybackText = "Enter values to calculate";
      } else if (scaledBenefit > 0 && calculatedNetProfit >= 0) {
        const monthlyProfitRate = scaledBenefit / months;
        if (monthlyProfitRate > 0) {
          const paybackMonths = rawInvestment / monthlyProfitRate;
          calculatedPaybackText =
            paybackMonths <= months
              ? `${paybackMonths.toFixed(1)} Months`
              : "Not reached in this period";
        }
      } else {
        calculatedPaybackText = "Not reached in this period";
      }

      return {
        totalInvestment: Math.round(rawInvestment),
        totalProfit: Math.round(scaledBenefit),
        netProfit: Math.round(calculatedNetProfit),
        roiPercent: calculatedRoi,
        paybackPeriodText: calculatedPaybackText,
      };
    }, [
      activeTab,
      currency,
      months,
      scenarioMultiplier,
      mAdSpend,
      mFreelancerFee,
      mCpc,
      mConvRate,
      mAvgRevenue,
      mMargin,
      wWebsiteCost,
      wVisitors,
      wCurrentConv,
      wNewConv,
      wAvgRevenue,
      wMargin,
      wMaintenance,
      aSetupCost,
      aMonthlyCost,
      aHoursSavedPerWeek,
      aStaffCostPerHour,
      aExtraLeads,
      aLeadRate,
      aAvgRevenue,
      roiConfig?.usd_to_bdt,
    ]);

  const hasInputData = totalInvestment > 0 || totalProfit > 0;
  const isProfitable = netProfit >= 0;
  const activeService = SERVICE_TABS.find((t) => t.id === activeTab) || SERVICE_TABS[0];
  const ActiveServiceIcon = activeService.icon;

  return (
    <section
      id="roi-calculator"
      className="relative py-10 sm:py-14 md:py-20 overflow-hidden bg-[#08070C]"
    >
      {/* Background Watermark */}
      <SectionWatermark text="ROI" glowColor="purple" />

      {/* Cosmic Radial Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[650px] h-[380px] rounded-full blur-[150px] opacity-20"
          style={{
            background:
              "radial-gradient(circle, #9D6BFF 0%, #7C3AED 40%, transparent 75%)",
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full blur-[130px] opacity-15"
          style={{
            background: "radial-gradient(circle, #8B5CF6 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="container relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ================= COMPACT SECTION HEADER ================= */}
        <div className="text-center max-w-3xl mx-auto mb-5 sm:mb-7">
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[11px] font-semibold tracking-wider text-[#E0C3FC] uppercase bg-[#17122B]/90 border border-[#9D6BFF]/35 shadow-[0_0_15px_rgba(157,107,255,0.2)] mb-2"
          >
            <Sparkles className="w-3 h-3 text-[#B57BFF]" />
            <span>INTERACTIVE ROI ESTIMATOR</span>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-white font-sans leading-tight"
          >
            {roiConfig?.section_title ? (
              roiConfig.section_title
            ) : (
              <>
                Calculate Your{" "}
                <span className="bg-gradient-to-r from-[#E0C3FC] via-[#B57BFF] to-[#9B5DE5] bg-clip-text text-transparent">
                  ROI
                </span>
              </>
            )}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="text-slate-400 mt-1.5 text-xs sm:text-sm leading-relaxed max-w-2xl mx-auto font-normal"
          >
            {roiConfig?.section_subtitle ||
              "See how much you can earn from investing in digital marketing, web development or AI automation."}
          </motion.p>
        </div>

        {/* ================= CONTROLS BAR WITH SERVICE DROPDOWN ================= */}
        <div className="relative z-40 max-w-7xl mx-auto mb-5 sm:mb-6 flex flex-col sm:flex-row items-center justify-between gap-3 p-2.5 sm:p-3 rounded-2xl bg-[#0E111F]/90 border border-white/[0.08] backdrop-blur-xl">
          {/* Service Dropdown Selector (Replaced big tabs) */}
          <div ref={dropdownRef} className="relative z-50 w-full sm:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-300 font-medium hidden md:inline">
                Configuring metrics for:
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsServiceDropdownOpen((prev) => !prev);
                }}
                className={`w-full sm:w-auto inline-flex items-center justify-between sm:justify-start gap-2.5 px-3.5 py-2.5 sm:py-2 rounded-xl text-white text-xs sm:text-sm font-bold transition-all duration-200 cursor-pointer touch-manipulation select-none active:scale-[0.98] ${
                  isServiceDropdownOpen
                    ? "bg-[#1E2442] border-2 border-[#B57BFF] shadow-[0_0_22px_rgba(157,107,255,0.45)] ring-2 ring-[#9D6BFF]/40"
                    : "bg-[#161B30] hover:bg-[#1E2442] border border-[#9D6BFF]/50 hover:border-[#B57BFF] shadow-[0_0_15px_rgba(157,107,255,0.2)]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[#B57BFF] animate-pulse" />
                  <ActiveServiceIcon className="w-4 h-4 text-[#C8A2FF]" />
                  <span className="text-white font-extrabold tracking-wide">
                    {activeService.label}
                  </span>
                </div>
                <ChevronDown
                  className={`w-4 h-4 text-[#C8A2FF] transition-transform duration-200 ${
                    isServiceDropdownOpen ? "rotate-180 text-white" : ""
                  }`}
                />
              </button>
            </div>

            {/* Dropdown Menu Modal with luminous backlight & 100% opaque high-contrast background */}
            <AnimatePresence>
              {isServiceDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.96 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute left-0 right-0 sm:right-auto top-full mt-2 w-full sm:w-80 rounded-2xl bg-[#090C16] border-2 border-[#9D6BFF] shadow-[0_25px_60px_rgba(0,0,0,0.95),0_0_35px_rgba(157,107,255,0.5)] p-2 space-y-1.5 z-[100]"
                >
                  {/* Glowing Backlight Aura behind the dropdown */}
                  <div
                    aria-hidden="true"
                    className="pointer-events-none absolute -inset-3 rounded-3xl blur-2xl opacity-80 -z-10"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 50%, rgba(157, 107, 255, 0.7) 0%, rgba(124, 58, 237, 0.45) 45%, rgba(0, 153, 255, 0.2) 80%, transparent 100%)",
                    }}
                  />

                  {/* Header */}
                  <div className="px-2.5 py-1.5 text-[11px] font-mono uppercase tracking-wider text-[#E0C3FC] font-extrabold border-b border-white/15 flex items-center justify-between mb-1">
                    <span>Select Target Service</span>
                    <span className="text-[10px] text-slate-400 font-normal">3 Pillars</span>
                  </div>

                  {SERVICE_TABS.map((tab) => {
                    const Icon = tab.icon;
                    const isSelected = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setActiveTab(tab.id);
                          setIsServiceDropdownOpen(false);
                        }}
                        className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all duration-150 cursor-pointer touch-manipulation select-none active:scale-[0.98] ${
                          isSelected
                            ? "bg-gradient-to-r from-[#9D6BFF]/40 to-[#7C3AED]/30 border-2 border-[#B57BFF] text-white shadow-[0_0_18px_rgba(157,107,255,0.35)]"
                            : "bg-[#12162A] hover:bg-[#1A203C] border border-white/10 hover:border-[#9D6BFF]/60 text-white"
                        }`}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                              isSelected
                                ? "bg-[#9D6BFF] text-white shadow-[0_0_12px_rgba(157,107,255,0.8)]"
                                : "bg-[#1E2548] text-[#C8A2FF] border border-white/10"
                            }`}
                          >
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <div className="text-white text-xs sm:text-[13px] font-bold leading-tight truncate">
                              {tab.label}
                            </div>
                            <div
                              className={`text-[11px] font-medium mt-0.5 truncate ${
                                isSelected ? "text-[#E0C3FC]" : "text-slate-300"
                              }`}
                            >
                              {tab.sub}
                            </div>
                          </div>
                        </div>

                        {isSelected && (
                          <div className="w-5 h-5 rounded-full bg-[#9D6BFF] flex items-center justify-center text-white shrink-0 shadow-[0_0_10px_rgba(157,107,255,0.9)] ml-2">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Timeframe & Currency Controls */}
          <div className="flex items-center justify-between sm:justify-end gap-2 w-full sm:w-auto pt-1.5 sm:pt-0 border-t sm:border-t-0 border-white/5">
            {/* Timeframe Selector */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[#16192A] border border-white/5 flex-1 sm:flex-none justify-around sm:justify-start">
              {[3, 6, 12].map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setMonths(p as TimePeriod)}
                  className={`flex-1 sm:flex-none px-2 sm:px-2.5 py-1.5 sm:py-1 rounded-md text-[11px] font-semibold font-mono text-center transition-all duration-200 cursor-pointer touch-manipulation ${
                    months === p
                      ? "bg-[#9D6BFF] text-white shadow-[0_0_12px_rgba(157,107,255,0.4)]"
                      : "text-slate-400 hover:text-white"
                  }`}
                >
                  {p} Mo
                </button>
              ))}
            </div>

            {/* Currency Toggle */}
            <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-[#16192A] border border-white/5 shrink-0">
              <button
                type="button"
                onClick={() => setCurrency("BDT")}
                className={`px-2.5 py-1.5 sm:py-1 rounded-md text-[11px] font-bold font-mono transition-all duration-200 cursor-pointer touch-manipulation flex items-center gap-1 ${
                  currency === "BDT"
                    ? "bg-[#9D6BFF] text-white shadow-[0_0_12px_rgba(157,107,255,0.4)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>৳ BDT</span>
              </button>

              <button
                type="button"
                onClick={() => setCurrency("USD")}
                className={`px-2.5 py-1.5 sm:py-1 rounded-md text-[11px] font-bold font-mono transition-all duration-200 cursor-pointer touch-manipulation flex items-center gap-1 ${
                  currency === "USD"
                    ? "bg-[#9D6BFF] text-white shadow-[0_0_12px_rgba(157,107,255,0.4)]"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                <span>$ USD</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= 2-COLUMN MAIN CALCULATOR GRID ================= */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-6 items-start">
          {/* ================= LEFT COLUMN: INPUTS & SLIDERS (INTERNAL SCROLL CONTAINER) ================= */}
          <div className="lg:col-span-7">
            {/* Scroll Indicator Header */}
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 px-1 mb-2">
              <span className="flex items-center gap-1.5 text-slate-300 font-semibold">
                <span className="w-2 h-2 rounded-full bg-[#B57BFF] animate-pulse" />
                Parameters ({totalMetrics} Metrics)
              </span>
              <span className="inline-flex items-center gap-1.5 text-[10px] text-[#E0C3FC] bg-[#16122B] border border-[#9D6BFF]/35 px-2.5 py-0.5 rounded-full shadow-sm">
                <span>Scroll inside</span>
                <span className="text-[#B57BFF] font-bold">↕</span>
              </span>
            </div>

            {/* Scrollable Box Wrapper with Linear/Apple style Glass Neon Rail */}
            <div className="relative rounded-2xl bg-[#090C17]/80 border border-white/[0.08] p-1.5 sm:p-2 shadow-2xl overflow-hidden">
              {/* Top subtle fade gradient */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-3 bg-gradient-to-b from-[#090C17] to-transparent z-10 rounded-t-xl"
              />

              {/* Linear/Apple style Floating Glass Neon Scroll Capsule */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-1 sm:right-1.5 top-3 bottom-3 w-[3.5px] rounded-full bg-white/[0.05] z-20"
              >
                <div
                  className="w-[3.5px] rounded-full bg-gradient-to-b from-[#C084FC] via-[#9D6BFF] to-[#38BDF8] shadow-[0_0_10px_rgba(157,107,255,0.9),0_0_20px_rgba(56,189,248,0.5)] transition-transform duration-75 ease-out"
                  style={{
                    height: "32%",
                    transform: `translateY(${scrollPercent * 2.12}%)`,
                  }}
                />
              </div>

              {/* Internal Scroll Area (Displays ~3 slim cards at a time on mobile, rest scroll inside!) */}
              <div
                ref={scrollRef}
                onScroll={handleScroll}
                className="roi-scroll-area max-h-[250px] sm:max-h-[285px] lg:max-h-[460px] pr-2.5 sm:pr-3 space-y-2 py-1 overflow-y-auto"
              >
                <AnimatePresence mode="wait">
              {/* TAB 1: Digital Marketing */}
              {activeTab === "marketing" && (
                <motion.div
                  key="marketing"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  <RoiSliderInput
                    label="Monthly Ad Spend"
                    hint="Budget invested directly in Meta, Google, or YouTube ads"
                    value={
                      currency === "USD"
                        ? Math.round(mAdSpend / USD_TO_BDT)
                        : mAdSpend
                    }
                    onChange={(val) =>
                      setMAdSpend(currency === "USD" ? val * USD_TO_BDT : val)
                    }
                    min={0}
                    max={currency === "USD" ? 4000 : 500000}
                    step={currency === "USD" ? 25 : 2500}
                    prefix={currencySymbol}
                  />

                  <RoiSliderInput
                    label="Amount paid to freelancer / agency"
                    hint="Monthly retainer paid to your marketing specialist or agency"
                    value={
                      currency === "USD"
                        ? Math.round(mFreelancerFee / USD_TO_BDT)
                        : mFreelancerFee
                    }
                    onChange={(val) =>
                      setMFreelancerFee(
                        currency === "USD" ? val * USD_TO_BDT : val
                      )
                    }
                    min={0}
                    max={currency === "USD" ? 2000 : 250000}
                    step={currency === "USD" ? 25 : 1000}
                    prefix={currencySymbol}
                  />

                  <RoiSliderInput
                    label="Average Cost Per Click (CPC)"
                    hint="Estimated ad cost per website visitor"
                    value={
                      currency === "USD"
                        ? Number((mCpc / USD_TO_BDT).toFixed(2))
                        : mCpc
                    }
                    onChange={(val) =>
                      setMCpc(currency === "USD" ? val * USD_TO_BDT : val)
                    }
                    min={0}
                    max={currency === "USD" ? 2.5 : 200}
                    step={currency === "USD" ? 0.01 : 1}
                    decimals={currency === "USD" ? 2 : 0}
                    prefix={currencySymbol}
                  />

                  <RoiSliderInput
                    label="Website Conversion Rate"
                    hint="Percentage of ad visitors that complete a purchase or inquiry"
                    value={mConvRate}
                    onChange={(val) => setMConvRate(val)}
                    min={0}
                    max={10.0}
                    step={0.1}
                    decimals={1}
                    suffix="%"
                  />

                  <RoiSliderInput
                    label="Average Revenue Per Sale"
                    hint="Typical transaction value or order basket size"
                    value={
                      currency === "USD"
                        ? Math.round(mAvgRevenue / USD_TO_BDT)
                        : mAvgRevenue
                    }
                    onChange={(val) =>
                      setMAvgRevenue(currency === "USD" ? val * USD_TO_BDT : val)
                    }
                    min={0}
                    max={currency === "USD" ? 500 : 60000}
                    step={currency === "USD" ? 5 : 250}
                    prefix={currencySymbol}
                  />

                  <RoiSliderInput
                    label="Product / Service Profit Margin"
                    hint="Gross margin after subtracting product COGS or direct fulfillment"
                    value={mMargin}
                    onChange={(val) => setMMargin(val)}
                    min={0}
                    max={95}
                    step={1}
                    suffix="%"
                  />
                </motion.div>
              )}

              {/* TAB 2: Web Development */}
              {activeTab === "web" && (
                <motion.div
                  key="web"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  <RoiSliderInput
                    label="Amount paid to freelancer / agency"
                    hint="One-time development fee paid to developer or agency"
                    value={
                      currency === "USD"
                        ? Math.round(wWebsiteCost / USD_TO_BDT)
                        : wWebsiteCost
                    }
                    onChange={(val) =>
                      setWWebsiteCost(currency === "USD" ? val * USD_TO_BDT : val)
                    }
                    min={0}
                    max={currency === "USD" ? 5000 : 600000}
                    step={currency === "USD" ? 50 : 2500}
                    prefix={currencySymbol}
                  />

                  <RoiSliderInput
                    label="Monthly Website Visitors"
                    hint="Current total organic, referral, and direct monthly visitors"
                    value={wVisitors}
                    onChange={(val) => setWVisitors(val)}
                    min={0}
                    max={100000}
                    step={250}
                    suffix=" visitors"
                  />

                  <RoiSliderInput
                    label="Current Conversion Rate"
                    hint="Your website's baseline conversion rate before redesign"
                    value={wCurrentConv}
                    onChange={(val) => setWCurrentConv(val)}
                    min={0}
                    max={8.0}
                    step={0.1}
                    decimals={1}
                    suffix="%"
                  />

                  <RoiSliderInput
                    label="Expected New Conversion Rate"
                    hint="Target conversion rate achieved with high-CRO funnel design"
                    value={wNewConv}
                    onChange={(val) => setWNewConv(val)}
                    min={0}
                    max={15.0}
                    step={0.1}
                    decimals={1}
                    suffix="%"
                  />

                  <RoiSliderInput
                    label="Average Revenue Per Customer"
                    hint="Average lifetime or immediate revenue per converted customer"
                    value={
                      currency === "USD"
                        ? Math.round(wAvgRevenue / USD_TO_BDT)
                        : wAvgRevenue
                    }
                    onChange={(val) =>
                      setWAvgRevenue(currency === "USD" ? val * USD_TO_BDT : val)
                    }
                    min={0}
                    max={currency === "USD" ? 600 : 70000}
                    step={currency === "USD" ? 5 : 250}
                    prefix={currencySymbol}
                  />

                  <RoiSliderInput
                    label="Profit Margin"
                    hint="Your business gross profit margin percentage"
                    value={wMargin}
                    onChange={(val) => setWMargin(val)}
                    min={0}
                    max={95}
                    step={1}
                    suffix="%"
                  />

                  <RoiSliderInput
                    label="Monthly Hosting & Maintenance Cost"
                    hint="Ongoing monthly hosting, domain, or maintenance fee"
                    value={
                      currency === "USD"
                        ? Math.round(wMaintenance / USD_TO_BDT)
                        : wMaintenance
                    }
                    onChange={(val) =>
                      setWMaintenance(currency === "USD" ? val * USD_TO_BDT : val)
                    }
                    min={0}
                    max={currency === "USD" ? 300 : 35000}
                    step={currency === "USD" ? 5 : 500}
                    prefix={currencySymbol}
                  />
                </motion.div>
              )}

              {/* TAB 3: AI Automation */}
              {activeTab === "ai" && (
                <motion.div
                  key="ai"
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-2"
                >
                  <RoiSliderInput
                    label="Amount paid to freelancer / agency"
                    hint="One-time pipeline architecture and AI bot integration fee"
                    value={
                      currency === "USD"
                        ? Math.round(aSetupCost / USD_TO_BDT)
                        : aSetupCost
                    }
                    onChange={(val) =>
                      setASetupCost(currency === "USD" ? val * USD_TO_BDT : val)
                    }
                    min={0}
                    max={currency === "USD" ? 4000 : 500000}
                    step={currency === "USD" ? 25 : 2500}
                    prefix={currencySymbol}
                  />

                  <RoiSliderInput
                    label="Monthly Tool & API Maintenance Cost"
                    hint="OpenAI API tokens, Make.com/n8n hosting, and CRM subscriptions"
                    value={
                      currency === "USD"
                        ? Math.round(aMonthlyCost / USD_TO_BDT)
                        : aMonthlyCost
                    }
                    onChange={(val) =>
                      setAMonthlyCost(currency === "USD" ? val * USD_TO_BDT : val)
                    }
                    min={0}
                    max={currency === "USD" ? 500 : 60000}
                    step={currency === "USD" ? 5 : 500}
                    prefix={currencySymbol}
                  />

                  <RoiSliderInput
                    label="Hours Saved Per Week"
                    hint="Weekly manual staff hours reclaimed via autonomous bots"
                    value={aHoursSavedPerWeek}
                    onChange={(val) => setAHoursSavedPerWeek(val)}
                    min={0}
                    max={80}
                    step={1}
                    suffix=" hrs/week"
                  />

                  <RoiSliderInput
                    label="Staff Cost Per Hour"
                    hint="Hourly salary or labor cost for employees handling manual tasks"
                    value={
                      currency === "USD"
                        ? Math.round(aStaffCostPerHour / USD_TO_BDT)
                        : aStaffCostPerHour
                    }
                    onChange={(val) =>
                      setAStaffCostPerHour(
                        currency === "USD" ? val * USD_TO_BDT : val
                      )
                    }
                    min={0}
                    max={currency === "USD" ? 60 : 7000}
                    step={currency === "USD" ? 1 : 25}
                    prefix={currencySymbol}
                    suffix="/hr"
                  />

                  <RoiSliderInput
                    label="Extra Leads Handled Per Month"
                    hint="New inquiries qualified thanks to instant 24/7 AI chat replies"
                    value={aExtraLeads}
                    onChange={(val) => setAExtraLeads(val)}
                    min={0}
                    max={1000}
                    step={5}
                    suffix=" leads"
                  />

                  <RoiSliderInput
                    label="Lead-to-Customer Conversion Rate"
                    hint="Percentage of qualified inquiries that turn into paying clients"
                    value={aLeadRate}
                    onChange={(val) => setALeadRate(val)}
                    min={0}
                    max={50}
                    step={1}
                    suffix="%"
                  />

                  <RoiSliderInput
                    label="Average Revenue Per Customer"
                    hint="Customer order value or service ticket size"
                    value={
                      currency === "USD"
                        ? Math.round(aAvgRevenue / USD_TO_BDT)
                        : aAvgRevenue
                    }
                    onChange={(val) =>
                      setAAvgRevenue(currency === "USD" ? val * USD_TO_BDT : val)
                    }
                    min={0}
                    max={currency === "USD" ? 600 : 70000}
                    step={currency === "USD" ? 5 : 250}
                    prefix={currencySymbol}
                  />
                </motion.div>
              )}
            </AnimatePresence>
              </div>

              {/* Bottom subtle fade gradient */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 bottom-0 h-4 bg-gradient-to-t from-[#090C17] to-transparent z-10 rounded-b-xl"
              />
            </div>
          </div>

          {/* ================= RIGHT COLUMN: FROSTED GLASS RESULT CARD ================= */}
          <div className="lg:col-span-5 static lg:sticky lg:top-20">
            <div
              className="relative rounded-2xl p-4 sm:p-6 backdrop-blur-2xl border transition-all duration-300 shadow-[0_0_50px_rgba(157,107,255,0.18)]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(20, 16, 40, 0.95) 0%, rgba(14, 12, 30, 0.95) 50%, rgba(9, 8, 20, 0.98) 100%)",
                borderColor: "rgba(157, 107, 255, 0.35)",
              }}
            >
              {/* Outer Glow Halo behind card */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-b from-[#9D6BFF]/20 via-transparent to-[#7C3AED]/15 blur-xl -z-10"
              />

              {/* 1. SCENARIO SELECTOR */}
              <div className="mb-4 pb-3.5 border-b border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-mono font-bold tracking-wider text-slate-300 uppercase flex items-center gap-1">
                    <TrendingUp className="w-3 h-3 text-[#B57BFF]" />
                    Forecast Scenario
                  </span>
                  <span className="text-[10px] text-[#C8A2FF] font-mono">
                    Multiplier:{" "}
                    <strong>
                      {scenariosList.find((s) => s.id === scenario)?.tag}
                    </strong>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-1 p-0.5 rounded-lg bg-[#0B0917] border border-white/10">
                  {scenariosList.map((sc) => {
                    const isSelected = scenario === sc.id;
                    return (
                      <button
                        key={sc.id}
                        type="button"
                        onClick={() => setScenario(sc.id)}
                        className={`py-1.5 px-1 min-h-[34px] rounded-md text-[11px] font-semibold text-center transition-all duration-200 cursor-pointer touch-manipulation flex items-center justify-center ${
                          isSelected
                            ? "bg-gradient-to-r from-[#9D6BFF] to-[#8B5CF6] text-white shadow-[0_0_12px_rgba(157,107,255,0.5)] font-bold"
                            : "text-slate-400 hover:text-white hover:bg-white/5"
                        }`}
                      >
                        {sc.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. CENTERPIECE METRIC: ESTIMATED ROI % */}
              <div className="text-center py-1 mb-4">
                <span className="text-[10px] font-mono font-semibold tracking-widest text-slate-400 uppercase block mb-0.5 select-none">
                  PROJECTED RETURN ON INVESTMENT
                </span>

                <div className="flex items-baseline justify-center gap-1">
                  {hasInputData ? (
                    <AnimatedNumber
                      value={roiPercent}
                      prefix={roiPercent > 0 ? "+" : ""}
                      suffix="%"
                      decimals={0}
                      className={`font-sans font-black text-4xl sm:text-5xl tracking-tight ${
                        isProfitable
                          ? "text-emerald-400 drop-shadow-[0_0_20px_rgba(52,211,153,0.45)]"
                          : "text-rose-400 drop-shadow-[0_0_20px_rgba(244,63,94,0.45)]"
                      }`}
                    />
                  ) : (
                    <span className="font-sans font-black text-4xl sm:text-5xl tracking-tight text-slate-400">
                      0%
                    </span>
                  )}
                </div>

                <div className="mt-1.5 flex items-center justify-center gap-1 select-none">
                  {!hasInputData ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold bg-[#9D6BFF]/15 text-[#E0C3FC] border border-[#9D6BFF]/35">
                      <Sparkles className="w-2.5 h-2.5 text-[#C8A2FF]" />
                      Ready to Calculate — Enter Numbers
                    </span>
                  ) : (
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full font-bold ${
                        isProfitable
                          ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/30"
                          : "bg-rose-500/15 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {isProfitable ? (
                        <>
                          <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                          Profitable Investment
                        </>
                      ) : (
                        <>
                          <TrendingDown className="w-2.5 h-2.5 text-rose-400" />
                          Under Breakeven
                        </>
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* 3. FINANCIAL SUMMARY GRID */}
              <div className="grid grid-cols-2 gap-2 mb-3.5 text-xs">
                {/* Total Investment */}
                <div className="p-2 sm:p-2.5 rounded-xl bg-[#0D0B1C]/90 border border-white/5 overflow-hidden">
                  <span className="text-[9px] text-slate-400 block font-mono uppercase truncate">
                    Total Investment
                  </span>
                  <div className="text-xs xs:text-sm sm:text-base font-mono font-bold text-white mt-0.5 truncate">
                    <AnimatedNumber
                      value={totalInvestment}
                      prefix={currencySymbol}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-0.5 truncate">
                    Over {months} months
                  </span>
                </div>

                {/* Total Profit / Gross Benefit */}
                <div className="p-2 sm:p-2.5 rounded-xl bg-[#0D0B1C]/90 border border-white/5 overflow-hidden">
                  <span className="text-[9px] text-slate-400 block font-mono uppercase truncate">
                    Total Gross Benefit
                  </span>
                  <div className="text-xs xs:text-sm sm:text-base font-mono font-bold text-white mt-0.5 truncate">
                    <AnimatedNumber
                      value={totalProfit}
                      prefix={currencySymbol}
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-0.5 truncate">
                    {scenariosList.find((s) => s.id === scenario)?.label} forecast
                  </span>
                </div>

                {/* Net Profit */}
                <div className="p-2 sm:p-2.5 rounded-xl bg-[#0D0B1C]/90 border border-white/5 overflow-hidden">
                  <span className="text-[9px] text-slate-400 block font-mono uppercase truncate">
                    Net Profit
                  </span>
                  <div
                    className={`text-xs xs:text-sm sm:text-base font-mono font-bold mt-0.5 truncate ${
                      isProfitable ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    <AnimatedNumber
                      value={netProfit}
                      prefix={
                        netProfit > 0
                          ? `+${currencySymbol}`
                          : netProfit < 0
                          ? `-${currencySymbol}`
                          : currencySymbol
                      }
                    />
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-0.5 truncate">
                    Profit minus investment
                  </span>
                </div>

                {/* Payback Period */}
                <div className="p-2 sm:p-2.5 rounded-xl bg-[#0D0B1C]/90 border border-white/5 overflow-hidden">
                  <span className="text-[9px] text-slate-400 block font-mono uppercase truncate">
                    Payback Period
                  </span>
                  <div className="text-xs sm:text-[13px] font-mono font-bold text-[#C8A2FF] mt-0.5 truncate">
                    {paybackPeriodText}
                  </div>
                  <span className="text-[9px] text-slate-400 block mt-0.5 truncate">
                    Estimated break-even
                  </span>
                </div>
              </div>

              {/* 4. COMPACT MINI COMPARISON CHART */}
              <div className="mb-4">
                <InvestmentVsProfitBar
                  investment={totalInvestment}
                  profit={totalProfit}
                  currencySymbol={currencySymbol}
                />
              </div>

              {/* 5. GLOWING PURPLE CTA BUTTON */}
              <div className="space-y-2">
                <a
                  href={`https://wa.me/${roiConfig?.whatsapp_number || "8801941130981"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative group w-full py-3 px-5 rounded-xl text-white font-extrabold text-xs sm:text-sm tracking-wide border border-white/35 hover:border-white/60 backdrop-blur-xl transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] shadow-[inset_0_1px_1px_rgba(255,255,255,0.5),0_0_25px_rgba(157,107,255,0.45)] hover:shadow-[inset_0_1px_2px_rgba(255,255,255,0.7),0_0_35px_rgba(192,132,252,0.7)] overflow-hidden flex items-center justify-center gap-2 cursor-pointer touch-manipulation"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.22) 0%, rgba(157, 107, 255, 0.55) 50%, rgba(124, 58, 237, 0.40) 100%)",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                  }}
                >
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-white/80 to-transparent pointer-events-none"
                  />
                  <span className="absolute inset-0 w-1/2 h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-[300%] transition-transform duration-1000 ease-in-out pointer-events-none" />

                  <span className="relative z-10 flex items-center justify-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.6)]">
                    <Sparkles className="w-3.5 h-3.5 text-[#E0C3FC] group-hover:rotate-12 transition-transform" />
                    <span>Get Started</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-1 transition-transform" />
                  </span>
                </a>

                {/* Disclaimer Footnote */}
                <p className="text-[10px] text-slate-400 text-center leading-relaxed font-normal">
                  {roiConfig?.disclaimer ||
                    "*Estimates only. Actual results depend on your business and market."}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
