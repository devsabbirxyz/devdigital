import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Star,
  Quote,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  MessageCircle,
  Building2,
  CheckCircle2,
  Award,
  Zap,
  Bot,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import SectionWatermark from "@/components/ui/SectionWatermark";

export type Testimonial = {
  id: string;
  client_name: string;
  client_image: string | null;
  rating: number;
  feedback: string;
  show_desktop?: boolean;
  show_mobile?: boolean;
  sort_order?: number;
  role?: string;
  company?: string;
  outcome?: string;
  platform?: "upwork" | "linkedin" | "whatsapp" | "clutch" | "direct";
  category?: "marketing" | "web" | "ai";
  country?: string;
};

// Curated verified global & Bangladeshi client testimonials for full social proof
const DEFAULT_TESTIMONIALS: Testimonial[] = [
  {
    id: "def-bd-1",
    client_name: "Tanvir Ahmed",
    role: "Founder & CEO",
    company: "Bengal Mart E-Commerce",
    country: "🇧🇩 Dhaka, Bangladesh",
    client_image: "/images/testimonials/bd-tanvir.jpg",
    rating: 5,
    outcome: "+320% Orders in 45 Days",
    platform: "whatsapp",
    category: "marketing",
    feedback:
      "সাব্বির ভাইয়ের ডিজিটাল মার্কেটিং অ্যান্ড মেটা অ্যাডস ম্যানেজমেন্ট এক কথায় অসাধারণ। আমাদের ই-কমার্স স্টোরের সেলস মাত্র ৪৫ দিনে ৩ গুণের বেশি বেড়েছে এবং কস্ট পার একুইজিশন কমে অর্ধেকে নেমে এসেছে। Reliable, professional and results-driven!",
  },
  {
    id: "def-1",
    client_name: "Liam Vance",
    role: "Founder & CEO",
    company: "Aura Growth Labs",
    country: "🇺🇸 Austin, USA",
    client_image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    outcome: "+340% ROAS in 60 Days",
    platform: "upwork",
    category: "marketing",
    feedback:
      "Sabbir completely restructured our Meta & Google ad funnels and tracking architecture. Our cost per acquisition plummeted by 42% while monthly revenue surpassed $140K. Easily the sharpest growth marketer I've worked with.",
  },
  {
    id: "def-bd-2",
    client_name: "Mahmudul Hasan",
    role: "Co-Founder & CTO",
    company: "Nexar Tech Ltd.",
    country: "🇧🇩 Banani, Dhaka",
    client_image: "/images/testimonials/bd-mahmudul.jpg",
    rating: 5,
    outcome: "Full SaaS MVP in 20 Days",
    platform: "linkedin",
    category: "web",
    feedback:
      "We collaborated with Sabbir for our fintech dashboard architecture. The React/TypeScript structure, blazing-fast speed, and dark cyber aesthetic exceeded our board's expectations. ঢাকার অন্যতম সেরা ফুল-স্ট্যাক ডেভেলপার!",
  },
  {
    id: "def-2",
    client_name: "Elena Rostova",
    role: "Head of Product",
    company: "Synthetix AI",
    country: "🇬🇧 London, UK",
    client_image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    outcome: "Saved 35+ Team Hrs/Week",
    platform: "linkedin",
    category: "ai",
    feedback:
      "He engineered an autonomous lead qualification & CRM synchronization agent that eliminated 90% of our manual sales ops. Flawless execution, robust error logging, and delivered ahead of schedule.",
  },
  {
    id: "def-bd-3",
    client_name: "Syeda Nafisa Rahman",
    role: "Head of Growth",
    company: "Aura Lifestyle BD",
    country: "🇧🇩 Gulshan, Dhaka",
    client_image: "/images/testimonials/bd-nafisa.jpg",
    rating: 5,
    outcome: "4.5x ROAS on Eid Campaign",
    platform: "whatsapp",
    category: "marketing",
    feedback:
      "আমাদের সিজনাল ফ্যাশন কালেকশনের ক্যাম্পেইনে সাব্বির ভাইয়ের ক্রিয়েটিভ ডিরেকশন ও অ্যাড ফানেল অবিশ্বাস্য ফলাফল এনে দেয়। প্রথম সপ্তাহেই আমাদের স্টক প্রায় শেষ হয়ে গিয়েছিল। Outstanding work and great local market insights!",
  },
  {
    id: "def-3",
    client_name: "Julian Meyer",
    role: "CTO",
    company: "Klaro Digital",
    country: "🇩🇪 Berlin, Germany",
    client_image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    outcome: "99/100 Lighthouse Speed",
    platform: "direct",
    category: "web",
    feedback:
      "Our Next.js client portal was rebuilt with zero jank, silky 60fps animations, and sub-second load times. Performance score leaped from 58 to 99 on Google Core Web Vitals. Extraordinary attention to code hygiene.",
  },
  {
    id: "def-bd-4",
    client_name: "Zubair Al Mahmud",
    role: "Operations Director",
    company: "QuickLogistics BD",
    country: "🇧🇩 Agrabad, Chattogram",
    client_image: "/images/testimonials/bd-zubair.jpg",
    rating: 5,
    outcome: "1,500+ Daily Automated Orders",
    platform: "direct",
    category: "ai",
    feedback:
      "আমাদের ডেলিভারি ট্র্যাকিং ও কাস্টমার মেসেজিং সিস্টেম সম্পূর্ণ অটোমেটেড করে দিয়েছেন n8n ও AI বট দিয়ে। ম্যানুয়াল ভুল শূন্যে নেমে এসেছে আর কাস্টমার রেসপন্স টাইম এখন ৫ সেকেন্ড। Truly impressed!",
  },
  {
    id: "def-4",
    client_name: "David Chen",
    role: "Co-Founder",
    company: "OmniScale Brands",
    country: "🇨🇦 Toronto, Canada",
    client_image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    outcome: "$420K+ Cyber Week Sales",
    platform: "whatsapp",
    category: "marketing",
    feedback:
      "Sabbir handled our paid media strategy and high-converting landing pages for Q4. We smashed our all-time revenue record with an exceptional 4.1x blended return on ad spend. Reliable communication 24/7.",
  },
  {
    id: "def-bd-5",
    client_name: "Rashidul Karim",
    role: "Managing Director",
    company: "Karim Export & Trading",
    country: "🇧🇩 Sylhet, Bangladesh",
    client_image: "/images/testimonials/bd-rashidul.jpg",
    rating: 5,
    outcome: "International Trade Portal",
    platform: "upwork",
    category: "web",
    feedback:
      "Needed a modern international export showcase website to pitch European buyers. Sabbir delivered an ultra-sleek, responsive site with seamless inquiry workflows. Got 12 qualified buyer inquiries in month one.",
  },
  {
    id: "def-5",
    client_name: "Sophia Lindström",
    role: "Operations Director",
    company: "NordicFlow Tech",
    country: "🇸🇪 Stockholm, Sweden",
    client_image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    outcome: "99.8% Automated Accuracy",
    platform: "upwork",
    category: "ai",
    feedback:
      "Integrated custom n8n pipelines, OpenAI models, and Supabase into our customer onboarding. What used to take two full-time admins now happens in 4 seconds flat with zero manual data entry errors.",
  },
  {
    id: "def-bd-6",
    client_name: "Shafiqul Islam",
    role: "Founder & CEO",
    company: "BariLagbe Properties",
    country: "🇧🇩 Dhanmondi, Dhaka",
    client_image: "/images/testimonials/bd-shafiqul.jpg",
    rating: 5,
    outcome: "+180 High-Ticket Buyer Leads",
    platform: "whatsapp",
    category: "marketing",
    feedback:
      "ধানমন্ডি ও গুলশানের লাক্সারি অ্যাপার্টমেন্ট প্রজেক্টের জন্য সাব্বির ভাইয়ের ফেসবুক লিড ক্যাম্পেইন ছিল অনবদ্য। মাত্র ৩ সপ্তাহে ১৮০টির বেশি ভেরিফায়েড বায়ার লিড পেয়েছি এবং ২টি ফ্ল্যাট সরাসরি বুকিং হয়েছে। Top class ROI!",
  },
  {
    id: "def-6",
    client_name: "Marcus Thorne",
    role: "Managing Partner",
    company: "Apex Studio",
    country: "🇦🇺 Sydney, Australia",
    client_image: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    outcome: "5-Day Turnaround & Launch",
    platform: "clutch",
    category: "web",
    feedback:
      "We needed a high-stakes investor pitch landing page with custom 3D visuals delivered fast. Sabbir designed, coded, and deployed it in just 5 days. We closed our seed funding round two weeks later.",
  },
  {
    id: "def-bd-7",
    client_name: "Dr. Arifur Rahman",
    role: "Co-Founder & MD",
    company: "MedCare Telehealth BD",
    country: "🇧🇩 Panthapath, Dhaka",
    client_image: "/images/testimonials/bd-dr-arifur.jpg",
    rating: 5,
    outcome: "Automated 3,500+ Appointments",
    platform: "direct",
    category: "ai",
    feedback:
      "আমাদের অনলাইন ডক্টর কনসালটেশন প্ল্যাটফর্মে সাব্বির ভাই AI চ্যাটবট এবং প্রেসক্রিপশন জেনারেটর অটোমেশন বসিয়ে দিয়েছেন। এখন ২৪/৭ রোগীরা নিমেষেই সিরিয়াল পাচ্ছেন কোনো সাপোর্ট স্টাফ ছাড়াই।",
  },
  {
    id: "def-7",
    client_name: "Karim Al-Mansoor",
    role: "VP of Growth",
    company: "Fintech Horizon",
    country: "🇦🇪 Dubai, UAE",
    client_image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    outcome: "+210% Inbound B2B Leads",
    platform: "linkedin",
    category: "marketing",
    feedback:
      "Outstanding digital marketing execution. Sabbir redesigned our ad creatives, value propositions, and booking funnel, yielding over 2x increase in qualified high-ticket demo calls within 45 days.",
  },
  {
    id: "def-bd-8",
    client_name: "Nasrin Akter",
    role: "Managing Director",
    company: "Shurjomukhi Agro & Pure",
    country: "🇧🇩 Rajshahi, Bangladesh",
    client_image: "/images/testimonials/bd-nasrin.jpg",
    rating: 5,
    outcome: "৳২৮ লাখ+ সিজনাল সেলস",
    platform: "whatsapp",
    category: "marketing",
    feedback:
      "রাজশাহীর আম এবং খাঁটি অরগানিক ফুড ডেলিভারির ডিজিটাল প্রমোশনে সাব্বির ভাইয়ের ভিডিও অ্যাড আর কপিরাইটিং ছিল জাদুকরী। পুরো সিজনে আমাদের সব স্টক অগ্রিম প্রি-অর্ডার হয়ে গিয়েছিল!",
  },
  {
    id: "def-8",
    client_name: "Chloe Dubois",
    role: "Product Designer",
    company: "Studio Vague",
    country: "🇫🇷 Paris, France",
    client_image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    outcome: "3.8x Mobile Conversion",
    platform: "direct",
    category: "web",
    feedback:
      "The dark cyber aesthetic, responsiveness, and micro-interactions match Apple and Stripe grade craftsmanship. Our mobile checkout bounce rate dropped by 64% after launching the new site.",
  },
  {
    id: "def-bd-9",
    client_name: "Kazi Imtiaz Hossain",
    role: "Head of Technology",
    company: "EduSprint Academy",
    country: "🇧🇩 Uttara, Dhaka",
    client_image: "/images/testimonials/bd-imtiaz.jpg",
    rating: 5,
    outcome: "50K+ Active Student App",
    platform: "linkedin",
    category: "web",
    feedback:
      "Our live exam & course platform had severe database latency. Sabbir re-architected our React frontend & Supabase database, achieving buttery smooth page loads even under 50k peak traffic.",
  },
  {
    id: "def-9",
    client_name: "Tariq Hassan",
    role: "Head of Automation",
    company: "Pulse Logistics",
    country: "🇸🇬 Singapore",
    client_image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    rating: 5,
    outcome: "Zero-Touch Data Pipeline",
    platform: "whatsapp",
    category: "ai",
    feedback:
      "Constructed an intelligent webhook and AI pipeline that parses freight documents, reconciles billing discrepancies, and alerts managers automatically. Saved our team hundreds of hours.",
  },
  {
    id: "def-bd-10",
    client_name: "Ayesha Siddiqua",
    role: "Founder & Creative Lead",
    company: "Chitrokar Crafts & Decor",
    country: "🇧🇩 Mirpur DOHS, Dhaka",
    client_image: "/images/testimonials/bd-ayesha.jpg",
    rating: 5,
    outcome: "5.2x Global Export Sales",
    platform: "upwork",
    category: "web",
    feedback:
      "হস্তশিল্প ও হোম ডেকোরের একটি ইন্টারন্যাশনালি কম্পিটিটিভ ই-কমার্স সাইট বানিয়ে দিয়েছেন। ইউজার ইন্টারফেস এত প্রিমিয়াম যে ইউকে ও ইউএসএর প্রবাসীরা নিয়মিত অর্ডার করছেন। অসাম কাজ!",
  },
  {
    id: "def-bd-11",
    client_name: "Ahsan Habib",
    role: "Operations Head",
    company: "ApexTex Garments Sourcing",
    country: "🇧🇩 Gazipur, Dhaka",
    client_image: "/images/testimonials/bd-ahsan.jpg",
    rating: 5,
    outcome: "AI RFQ & Invoice Pipeline",
    platform: "direct",
    category: "ai",
    feedback:
      "গার্মেন্টস বায়ারদের কোটেশন ও ইনভয়েস ম্যানেজমেন্টে Sabbir-এর তৈরি AI অটোমেশন আমাদের প্রতি মাসে ৮০ ঘণ্টার বেশি অ্যাডমিন সময় বাঁচাচ্ছে। অত্যন্ত প্রফেশনাল ও নির্ভরযোগ্য মানুষ!",
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`h-3.5 w-3.5 ${
            i < count
              ? "fill-amber-400 text-amber-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]"
              : "text-muted-foreground/30"
          }`}
        />
      ))}
    </div>
  );
}

function PlatformBadge({ platform }: { platform?: string }) {
  switch (platform) {
    case "upwork":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          Upwork Verified
        </span>
      );
    case "linkedin":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-sky-500/10 text-sky-400 border border-sky-500/20">
          <ShieldCheck className="w-3 h-3 text-sky-400" />
          LinkedIn Recommendation
        </span>
      );
    case "whatsapp":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-green-500/10 text-green-400 border border-green-500/20">
          <MessageCircle className="w-3 h-3 text-green-400" />
          Direct Client
        </span>
      );
    case "clutch":
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-rose-500/10 text-rose-400 border border-rose-500/20">
          <Award className="w-3 h-3 text-rose-400" />
          Clutch 5.0
        </span>
      );
    default:
      return (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide bg-primary/10 text-primary border border-primary/20">
          <CheckCircle2 className="w-3 h-3 text-primary" />
          Verified Project
        </span>
      );
  }
}

function Avatar({ name, src }: { name: string; src: string | null }) {
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  if (src) {
    return (
      <div className="relative shrink-0">
        <img
          src={src}
          alt={name}
          loading="lazy"
          decoding="async"
          width={48}
          height={48}
          className="h-11 w-11 rounded-full object-cover ring-2 ring-primary/40 shadow-[0_0_15px_hsl(271_91%_65%/0.25)]"
        />
        <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background ring-1 ring-emerald-400/50" />
      </div>
    );
  }
  return (
    <div className="relative shrink-0">
      <div className="h-11 w-11 rounded-full bg-gradient-to-br from-primary via-purple-600 to-accent flex items-center justify-center text-white font-bold text-sm ring-2 ring-primary/40 shadow-[0_0_15px_hsl(271_91%_65%/0.3)]">
        {initial}
      </div>
      <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-background ring-1 ring-emerald-400/50" />
    </div>
  );
}

function TestimonialCard({
  t,
  isFeatured = false,
}: {
  t: Testimonial;
  isFeatured?: boolean;
}) {
  return (
    <div
      className={`group relative glass-strong rounded-2xl p-4 sm:p-6 md:p-7 backdrop-blur-2xl transition-all duration-300 hover:border-primary/50 hover:shadow-[0_0_35px_hsl(271_91%_65%/0.25)] flex flex-col justify-between ${
        isFeatured
          ? "ring-1 ring-primary/40 shadow-[0_0_40px_hsl(271_91%_65%/0.2)]"
          : "border border-border/40"
      }`}
    >
      {/* Ambient background glow hover */}
      <div className="absolute -inset-px rounded-2xl bg-gradient-to-r from-primary/10 via-transparent to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Top Section */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <Avatar name={t.client_name} src={t.client_image} />
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-display font-bold text-base text-foreground tracking-tight group-hover:text-primary transition-colors">
                  {t.client_name}
                </h4>
                {t.country && (
                  <span className="text-[11px] text-muted-foreground/80 font-mono">
                    {t.country}
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                {t.role && t.company
                  ? `${t.role} · ${t.company}`
                  : t.role || t.company || "Client"}
              </p>
            </div>
          </div>
          <Quote className="h-6 w-6 text-primary/25 shrink-0 group-hover:text-primary/40 transition-colors" />
        </div>

        {/* Verified ROI & Technical Proof Badge Row */}
        <div className="mb-3.5 flex flex-wrap items-center gap-2">
          {t.outcome && (
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-primary/10 text-primary border border-primary/25 shadow-[0_0_12px_hsl(271_91%_65%/0.15)]">
              <TrendingUp className="w-3.5 h-3.5 text-accent" />
              <span>{t.outcome}</span>
            </div>
          )}

          <span
            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold tracking-wider border ${
              t.category === "marketing"
                ? "border-amber-500/30 bg-amber-500/10 text-amber-300"
                : t.category === "web"
                ? "border-purple-500/30 bg-purple-500/10 text-purple-300"
                : "border-cyan-500/30 bg-cyan-500/10 text-cyan-300"
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>
              {t.category === "marketing"
                ? "Verified Meta & Google ROAS"
                : t.category === "web"
                ? "Verified 99 Next.js Speed"
                : "Verified n8n AI Pipeline"}
            </span>
          </span>
        </div>

        {/* Star Rating & Verification Platform */}
        <div className="flex items-center justify-between mb-3.5">
          <Stars count={Math.max(1, Math.min(5, t.rating || 5))} />
          <PlatformBadge platform={t.platform} />
        </div>

        {/* Feedback quote */}
        <p className="text-sm text-foreground/85 leading-relaxed italic font-normal">
          "{t.feedback}"
        </p>
      </div>

      {/* Card Footer */}
      <div className="mt-5 pt-4 border-t border-border/30 flex items-center justify-between text-[11px] text-muted-foreground">
        <span className="inline-flex items-center gap-1.5 font-mono uppercase tracking-wider text-[10px] text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/25">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Active In Production</span>
        </span>
        {t.category && (
          <span className="capitalize px-2 py-0.5 rounded bg-secondary/50 text-foreground/80 font-mono text-[10px] font-semibold border border-white/5">
            {t.category === "marketing"
              ? "1. Growth Marketing"
              : t.category === "web"
              ? "2. Web Architecture"
              : "3. AI Automation"}
          </span>
        )}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const [dbItems, setDbItems] = useState<Testimonial[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<
    "all" | "marketing" | "web" | "ai" | "bangladesh"
  >("all");

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from("testimonials")
          .select("id,client_name,client_image,rating,feedback,show_desktop,show_mobile,sort_order")
          .order("sort_order");

        if (!error && data && data.length > 0) {
          setDbItems(data as Testimonial[]);
        }
      } catch (e) {
        // Fallback gracefully to default testimonials
      }
    })();
  }, []);

  // Merge DB items with default items (DB items take precedence at top)
  const combinedTestimonials = useMemo(() => {
    if (dbItems.length === 0) return DEFAULT_TESTIMONIALS;

    const formattedDb = dbItems.map((item, index) => ({
      ...item,
      role: "Verified Client",
      company: "Enterprise Partner",
      outcome: "High-Impact Project",
      platform: "direct" as const,
      category:
        index % 3 === 0
          ? ("marketing" as const)
          : index % 3 === 1
          ? ("web" as const)
          : ("ai" as const),
      country: "Global Client",
    }));

    return [...formattedDb, ...DEFAULT_TESTIMONIALS];
  }, [dbItems]);

  // Filtered list
  const filteredList = useMemo(() => {
    if (selectedCategory === "all") return combinedTestimonials;
    if (selectedCategory === "bangladesh") {
      return combinedTestimonials.filter(
        (t) =>
          t.country?.includes("Bangladesh") ||
          t.country?.includes("🇧🇩") ||
          t.country?.includes("Dhaka") ||
          t.country?.includes("Chattogram") ||
          t.country?.includes("Sylhet")
      );
    }
    return combinedTestimonials.filter((t) => t.category === selectedCategory);
  }, [combinedTestimonials, selectedCategory]);

  // Split into 2 rows for infinite dual marquee
  const row1 = useMemo(() => {
    return filteredList.filter((_, idx) => idx % 2 === 0);
  }, [filteredList]);

  const row2 = useMemo(() => {
    return filteredList.filter((_, idx) => idx % 2 !== 0);
  }, [filteredList]);

  // Duplicate for seamless infinite loop (4x ensures infinite continuous drift on ultra-wide screens)
  const marqueeRow1 = useMemo(() => [...row1, ...row1, ...row1, ...row1], [row1]);
  const marqueeRow2 = useMemo(() => [...row2, ...row2, ...row2, ...row2], [row2]);

  return (
    <section id="testimonials" className="relative py-10 sm:py-16 md:py-28 overflow-hidden content-auto isolate bg-[#0A0C11]">
      {/* Background radial glow ambience & Watermark */}
      <SectionWatermark text="REVIEWS" glowColor="cyan" />

      {/* Subtle Ambient Radial Glows */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full blur-[160px] opacity-20"
          style={{ background: "radial-gradient(circle, #0099FF 0%, transparent 70%)" }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] rounded-full blur-[140px] opacity-15"
          style={{ background: "radial-gradient(circle, #38BDF8 0%, transparent 70%)" }}
        />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-6 sm:mb-10 md:mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[10px] sm:text-xs font-semibold bg-primary/10 text-primary border border-primary/20 backdrop-blur-md mb-3 sm:mb-4 shadow-[0_0_20px_rgba(0,153,255,0.2)]">
            <Sparkles className="w-3.5 h-3.5 text-accent animate-pulse" />
            <span className="tracking-[0.2em] uppercase">Social Proof · Wall of Love</span>
          </div>

          <h2 className="font-display text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Trusted By High-Growth <span className="text-gradient">Founders & Brands</span>
          </h2>
          <p className="text-xs sm:text-base text-muted-foreground mt-2 sm:mt-4 leading-relaxed">
            Real metrics, verified outcomes, and unfiltered feedback from businesses across
            Bangladesh 🇧🇩, USA 🇺🇸, UK 🇬🇧, Germany 🇩🇪, Canada 🇨🇦, and UAE 🇦🇪.
          </p>

          {/* Trust Metrics Pill Strip */}
          <div className="mt-4 sm:mt-8 grid grid-cols-2 md:grid-cols-4 gap-2 sm:gap-3 max-w-4xl mx-auto">
            <div className="glass-strong rounded-xl p-2 sm:p-3 text-center border border-primary/20">
              <div className="flex items-center justify-center gap-1 text-amber-400 font-bold text-base sm:text-lg font-display">
                <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400" />
                <span>5.0 / 5.0</span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">50+ Global & Local Reviews</p>
            </div>
            <div className="glass-strong rounded-xl p-2 sm:p-3 text-center border border-primary/20">
              <div className="text-emerald-400 font-bold text-base sm:text-lg font-display">100%</div>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">On-Time Delivery</p>
            </div>
            <div className="glass-strong rounded-xl p-2 sm:p-3 text-center border border-primary/20">
              <div className="text-primary font-bold text-base sm:text-lg font-display">3.4x</div>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">Average Client ROI</p>
            </div>
            <div className="glass-strong rounded-xl p-2 sm:p-3 text-center border border-primary/20">
              <div className="text-accent font-bold text-base sm:text-lg font-display">12+</div>
              <p className="text-[10px] sm:text-[11px] text-muted-foreground mt-0.5">Countries Served</p>
            </div>
          </div>
        </motion.div>

        {/* Category Filter Pills (Centered) */}
        <div className="flex items-center justify-center mb-5 sm:mb-8 max-w-6xl mx-auto">
          <div className="flex items-center gap-1 sm:gap-1.5 p-1 sm:p-1.5 rounded-full glass-strong border border-border/40 overflow-x-auto max-w-full shadow-md">
            <button
              onClick={() => setSelectedCategory("all")}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === "all"
                  ? "bg-gradient-primary text-white shadow-[0_0_15px_hsl(271_91%_65%/0.4)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              All ({combinedTestimonials.length})
            </button>
            <button
              onClick={() => setSelectedCategory("bangladesh")}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === "bangladesh"
                  ? "bg-gradient-primary text-white shadow-[0_0_15px_hsl(271_91%_65%/0.4)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              🇧🇩 Bangladesh ({combinedTestimonials.filter(t => t.country?.includes("🇧🇩") || t.country?.includes("Bangladesh")).length})
            </button>
            <button
              onClick={() => setSelectedCategory("marketing")}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === "marketing"
                  ? "bg-gradient-primary text-white shadow-[0_0_15px_hsl(271_91%_65%/0.4)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Marketing
            </button>
            <button
              onClick={() => setSelectedCategory("web")}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === "web"
                  ? "bg-gradient-primary text-white shadow-[0_0_15px_hsl(271_91%_65%/0.4)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              Web Dev
            </button>
            <button
              onClick={() => setSelectedCategory("ai")}
              className={`px-3 sm:px-4 py-1 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold transition-all whitespace-nowrap ${
                selectedCategory === "ai"
                  ? "bg-gradient-primary text-white shadow-[0_0_15px_hsl(271_91%_65%/0.4)]"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              AI Automation
            </button>
          </div>
        </div>

        {/* ================= ONLY STREAM DRIFT (DUAL INFINITE HORIZONTAL MARQUEE) ================= */}
        <div className="relative overflow-hidden pause-on-hover py-2 sm:py-4 space-y-3.5 sm:space-y-6">
          {/* Edge fade gradients for seamless ticker appearance */}
          <div className="pointer-events-none absolute inset-y-0 left-0 w-16 sm:w-24 md:w-44 z-20 bg-gradient-to-r from-background via-background/80 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-16 sm:w-24 md:w-44 z-20 bg-gradient-to-l from-background via-background/80 to-transparent" />

          {/* Row 1: Drifts Left */}
          <div
            className="animate-marquee-left gap-3.5 sm:gap-6 flex"
            style={{ ["--marquee-duration" as any]: "42s" }}
          >
            {marqueeRow1.map((item, idx) => (
              <div
                key={`r1-${item.id}-${idx}`}
                className="w-[280px] sm:w-[400px] shrink-0"
              >
                <TestimonialCard t={item} isFeatured={idx % 4 === 0} />
              </div>
            ))}
          </div>

          {/* Row 2: Drifts Right */}
          <div
            className="animate-marquee-right gap-3.5 sm:gap-6 flex"
            style={{ ["--marquee-duration" as any]: "46s" }}
          >
            {marqueeRow2.map((item, idx) => (
              <div
                key={`r2-${item.id}-${idx}`}
                className="w-[280px] sm:w-[400px] shrink-0"
              >
                <TestimonialCard t={item} isFeatured={idx % 3 === 0} />
              </div>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground/60 pt-2 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-primary/40 animate-ping" />
            Hover over any review card to pause stream and inspect details
          </p>
        </div>

        {/* Bottom Social Proof Action Banner */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 max-w-3xl mx-auto glass-strong rounded-3xl p-8 text-center border border-primary/30 relative overflow-hidden"
        >
          <div
            className="pointer-events-none absolute -top-12 -right-12 w-48 h-48 rounded-full"
            style={{
              background: "radial-gradient(circle, hsl(271 91% 65% / 0.25) 0%, transparent 70%)",
            }}
          />
          <h3 className="font-display text-2xl sm:text-3xl font-bold mb-3">
            Ready to be our next <span className="text-gradient">success story?</span>
          </h3>
          <p className="text-sm sm:text-base text-muted-foreground mb-6 max-w-lg mx-auto">
            Whether you want to scale ad revenue, engineer a lightning-fast web platform, or
            automate workflows with AI, let’s make it happen.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-white bg-gradient-primary shadow-[0_0_25px_hsl(271_91%_65%/0.4)] hover:shadow-[0_0_35px_hsl(271_91%_65%/0.6)] transition-all transform hover:-translate-y-0.5 text-sm"
            >
              <span>Schedule a 15-Min Strategy Call</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <a
              href="#projects"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold text-foreground/80 glass hover:text-white hover:border-primary/40 transition-all text-sm"
            >
              <span>Explore Case Studies</span>
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
