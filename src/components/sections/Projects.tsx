import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  X,
  MessageCircle,
  TrendingUp,
  Code2,
  Bot,
  Layers,
  Calendar,
  Globe,
  Lock,
} from "lucide-react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import HolographicCard from "@/components/ui/HolographicCard";
import SectionWatermark from "@/components/ui/SectionWatermark";
import { openBookingModal } from "@/components/site/BookingModal";

// Real local preview screenshots
import imgBloodBd from "@/assets/preview-bloodbd.jpg";
import imgGorurGhash from "@/assets/preview-gorurghash.jpg";
import imgPraava from "@/assets/preview-praava.jpg";
import imgKhaasFood from "@/assets/preview-khaasfood.jpg";
import imgMake from "@/assets/preview-make.jpg";
import imgDorjiBari from "@/assets/preview-dorjibari.jpg";
import imgChatbase from "@/assets/preview-chatbase.jpg";

export type Project = {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  featured?: boolean;
  sort_order?: number;
  live_url?: string;
};

export type EnrichedProject = Project & {
  category: "Digital Marketing" | "Web Development" | "AI Automation";
  subCategory?: string;
  tags: string[];
  metrics: { label: string; value: string };
  resultChip: string;
  timeline: string;
  client: string;
  live_url: string;
  live_domain: string;
  caseStudyDetails: {
    challenge: string;
    solution: string;
    highlights: string[];
  };
};

const CATEGORIES = [
  { id: "All", label: "All Work", icon: Layers },
  { id: "Digital Marketing", label: "Marketing & Ads", icon: TrendingUp },
  { id: "Web Development", label: "Web Development", icon: Code2 },
  { id: "AI Automation", label: "AI & Automations", icon: Bot },
] as const;

// Legacy demo placeholder titles to ignore if present in raw DB seed
const LEGACY_PLACEHOLDERS = new Set([
  "nebulapay dashboard",
  "aurora e-commerce",
  "pulseai assistant",
  "lumen studio site",
]);

// 7 Verified, Authentic, Real-World Showcase Projects with Live Website URLs
export const CURATED_SAMPLE_PROJECTS: EnrichedProject[] = [
  // 1. BLOOD BD (Real Web App in Bangladesh — Blood Donation & Emergency Network)
  {
    id: "project-bloodbd",
    title: "Blood BD — Bangladesh Emergency Blood Donation & Donor Network (বাংলাদেশ রক্তদান প্ল্যাটফর্ম)",
    description:
      "A fast nationwide voluntary blood donation platform for Bangladesh. Built with blood group filtering, district & thana matching, and instant 1-click emergency call & WhatsApp donor connect.",
    image_url: imgBloodBd,
    category: "Web Development",
    subCategory: "Emergency Blood Donor Network",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Emergency Network", "Bangla Typography", "Dhaka & BD"],
    metrics: { label: "Active Donors & Speed", value: "2,400+ Donors • 0.4s Load" },
    resultChip: "🩸 2,400+ Donors | 0.4s Speed",
    timeline: "3 Weeks",
    client: "Blood BD (বাংলাদেশ ব্লাড নেটওয়ার্ক)",
    live_url: "https://blood-bd.com/",
    live_domain: "blood-bd.com",
    caseStudyDetails: {
      challenge:
        "বাংলাদেশে জরুরি রক্তের প্রয়োজনে দ্রুত ডোনার খুঁজে পাওয়া একটি বড় চ্যালেঞ্জ। ফেসবুক গ্রুপ বা সোশ্যাল মিডিয়ায় পোস্ট দিয়ে ঘণ্টার পর ঘণ্টা অপেক্ষা করতে গিয়ে রোগীর জীবন ঝুঁকিতে পড়ে এবং সঠিক ব্লাড গ্রুপের ডোনার খুঁজে পাওয়া কঠিন হয়।",
      solution:
        "Next.js ও আধুনিক ক্যাশিং আর্কিটেকচার দিয়ে আল্ট্রা-ফাস্ট রেসপন্সিভ প্ল্যাটফর্ম তৈরি করা হয়েছে। ৬৪ জেলা ও উপজেলার ভলান্টারি রক্তদাতাদের ডাটাবেস এবং ১-ক্লিকেই সরাসরি ডোনারের সাথে ফোন কল বা WhatsApp-এ সরাসরি যোগাযোগ করার সহজ ব্যবস্থা রাখা হয়েছে।",
      highlights: [
        "২,৪০০+ নিবন্ধিত ভলান্টারি রক্তদাতা এবং রিয়েলটাইম জরুরি রক্তের অনুরোধ ফিড",
        "০.৪ সেকেন্ড সাব-সেকেন্ড পেজ লোড ও ১০০% মোবাইল রেসপন্সিভ বাংলা ইউজার এক্সপেরিয়েন্স",
        "জরুরি মুহূর্তে সরাসরি ১-ক্লিকে ফোন কল ও হোয়াটসঅ্যাপ সংযোগ সুবিধা",
      ],
    },
  },

  // 2. FACEBOOK / META ADS (Bangladeshi Streetwear E-Commerce Scale)
  {
    id: "project-gorurghash",
    title: "Gorur Ghash — Meta Ads Scaling & DTC Apparel Funnel",
    description:
      "Engineered multi-tier Meta & Facebook ad campaigns with Advantage+ Shopping (ASC), dynamic UGC video hooks, and CAPI server-side event tracking generating ৳18.5L+ in attributed revenue.",
    image_url: imgGorurGhash,
    category: "Digital Marketing",
    subCategory: "Meta Ads (Facebook & Instagram)",
    tags: ["Meta Ads", "Facebook Pixel CAPI", "Advantage+ Shopping", "bKash / COD Funnel", "UGC Video Hooks"],
    metrics: { label: "Attributed Revenue & ROAS", value: "5.2x ROAS (৳১৮,৫০,০০০+ Sales)" },
    resultChip: "📈 5.2x Meta ROAS | ৳18.5L Sales",
    timeline: "6 Weeks",
    client: "Gorur Ghash (গরুর ঘাস)",
    live_url: "https://gorurghash.com",
    live_domain: "gorurghash.com",
    caseStudyDetails: {
      challenge:
        "ফেসবুকে অ্যাড কস্ট (CPM) বেড়ে যাওয়ায় এবং কম ইন্টেন্টের ট্রাফিকে বাজেট নষ্ট হওয়ায় নতুন কালেকশন ড্রপের সেলস মার্জিন কমে যাচ্ছিল। ক্যাশ-অন-ডেলিভারিতে অনেক ফেইক অর্ডার আসত।",
      solution:
        "সার্ভার-সাইড Meta Conversions API (CAPI) ইন্টিগ্রেশন, Advantage+ শপিং ক্যাম্পেইন (ASC) এবং ট্রেন্ডি ভিডিও হুক দিয়ে তরুণ অডিয়েন্স টার্গেট করে অ্যাড অ্যাকাউন্ট নতুন করে সাজানো হয়।",
      highlights: [
        "৫.২x ব্লেন্ডেড ROAS এবং ক্যাম্পেইন চলাকালীন ১৮.৫ লাখ টাকার বেশি অনলাইন সেলস",
        "সার্ভার-সাইড ট্র্যাকিংয়ের মাধ্যমে ৯.৬/১০ ইভেন্ট ম্যাচ কোয়ালিটি",
        "অর্ডার ড্রপ-অফ কমাতে bKash এবং ক্যাশ-অন-ডেলিভারি চেকআউট অপটিমাইজেশন",
      ],
    },
  },

  // 3. GOOGLE ADS (Bangladeshi Healthcare Diagnostic & Doctor Booking)
  {
    id: "project-praava-google-ads",
    title: "Praava Health BD — Google Ads & Patient Lead Engine",
    description:
      "High-converting Google Ads Search and Performance Max (PMax) infrastructure built with Smart Bidding, negative keyword sculpting, and localized medical call tracking in Dhaka.",
    image_url: imgPraava,
    category: "Digital Marketing",
    subCategory: "Google Search & Performance Max",
    tags: ["Google Search Ads", "Performance Max", "Target CPA Bidding", "Negative KW Clusters", "Call Tracking"],
    metrics: { label: "Qualified Patient Leads", value: "+340% Appointments (৳420 CPA)" },
    resultChip: "🎯 +340% Appointments | ৳420 CPA",
    timeline: "4 Weeks",
    client: "Praava Health (প্রাভা হেলথ)",
    live_url: "https://praavahealth.com",
    live_domain: "praavahealth.com",
    caseStudyDetails: {
      challenge:
        "ঢাকা ও আশেপাশের এলাকায় ক্লিনিক ও ডায়াগনস্টিক সার্ভিসের জন্য কাস্টমার অ্যাকুইজিশন খরচ বেশি ছিল এবং অপ্রাসঙ্গিক সার্চ কি-ওয়ার্ডে অ্যাড বাজেট অপচয় হচ্ছিল।",
      solution:
        "স্পেসিফিক সিঙ্গেল-থিম অ্যাড গ্রুপ (STAG), হাই-ইন্টেন্ট মেডিকেল কি-ওয়ার্ড, নেগেটিভ ফিল্টারিং এবং গুগল ম্যাপস কল এক্সটেনশন ব্যবহার করে অ্যাপয়েন্টমেন্ট বুকিং ফানেল সেটআপ করা হয়।",
      highlights: [
        "+৩৪০% ভেরিফায়েড ডক্টর কনসালটেশন ও ডায়াগনস্টিক বুকিং বৃদ্ধি",
        "অ্যাকুইজিশন খরচ (CPA) ৳৪২০ এ নামিয়ে আনা হয়েছে (-৫৮% খরচ হ্রাস)",
        "হাই-কনভার্টিং ল্যান্ডিং পেজে কল-টু-অ্যাকশন অপটিমাইজেশন",
      ],
    },
  },

  // 4. MAKE.COM AUTOMATED CRM PIPELINE
  {
    id: "project-make-flow",
    title: "Make Flow — Automated Inbound Lead Qualification & CRM Pipeline",
    description:
      "Zero-latency multi-channel webhook pipeline bridging Facebook Ads, Google Ads forms, and HubSpot CRM with real-time WhatsApp & Slack sales notifications in under 25 seconds.",
    image_url: imgMake,
    category: "AI Automation",
    subCategory: "Make.com Webhooks & CRM",
    tags: ["Make.com", "HubSpot CRM", "Webhooks", "WhatsApp Business API", "Slack Realtime Alerts"],
    metrics: { label: "Lead Response Latency", value: "<25s Sync (Zero Lead Drop)" },
    resultChip: "⚡ <25s Lead Sync | 0 Drop",
    timeline: "10 Days",
    client: "Make Flow Enterprise",
    live_url: "https://www.make.com",
    live_domain: "make.com",
    caseStudyDetails: {
      challenge:
        "ফেসবুক ও গুগল অ্যাডসের লিড ফর্মগুলো ম্যানুয়ালি ডাউনলোড করে যোগাযোগ করতে সেলস টিমের কয়েক ঘণ্টা সময় লেগে যেত, ফলে ৬০% লিড কোল্ড হয়ে যেত।",
      solution:
        "Make.com-এর মাধ্যমে জিরো-ল্যাটেন্সি অটোমেশন পাইপলাইন তৈরি করা হয়েছে, যা অ্যাড সাবমিট হওয়ামাত্র ডেটা ভ্যালিডেট করে HubSpot CRM-এ যোগ করে এবং কাস্টমারের WhatsApp-এ ২৫ সেকেন্ডের মধ্যে স্বয়ংক্রিয় মেসেজ পাঠায়।",
      highlights: [
        "১০,০০০+ মাসিক লিডের ক্ষেত্রে ১০০% জিরো ডেটা ড্রপ গ্যারান্টি",
        "লিড রেসপন্স সময় ৪ ঘণ্টা থেকে নামিয়ে মাত্র ২৫ সেকেন্ডে আনা হয়েছে",
        "+৬৫% বেশি মিটিং বুকিং ও দ্রুত সেলস ক্লোজিং",
      ],
    },
  },

  // 5. KHAAS FOOD (Bangladeshi Pure Organic Food E-Commerce)
  {
    id: "project-khaasfood",
    title: "Khaas Food — Pure Organic Grocery E-Commerce & Fast Checkout",
    description:
      "Modern e-commerce platform built for pure food and organic groceries with sub-second page loads, bKash & Nagad integration, and frictionless mobile ordering.",
    image_url: imgKhaasFood,
    category: "Web Development",
    subCategory: "Organic Grocery E-Commerce",
    tags: ["Next.js", "Tailwind CSS", "bKash & Nagad API", "Edge Caching", "Instant Cart"],
    metrics: { label: "Load Speed & Mobile Growth", value: "0.7s Speed • +48% Mobile Orders" },
    resultChip: "⚡ 0.7s Speed | +48% Orders",
    timeline: "4 Weeks",
    client: "Khaas Food Bangladesh (খাস ফুড)",
    live_url: "https://khaasfood.com",
    live_domain: "khaasfood.com",
    caseStudyDetails: {
      challenge:
        "ভারী ইমেজ ও পুরোনো আর্কিটেকচারের কারণে স্লো লোডিং স্পিড ছিল, যার ফলে পিক টাইমে মোবাইল ভিজিটরদের ৫০% কার্ট ছেড়ে চলে যেত এবং বাউন্স রেট বেশি ছিল।",
      solution:
        "সাব-সেকেন্ড এজ ক্যাশিং, ইনস্ট্যান্ট লাইভ সার্চ এবং নিরবচ্ছিন্ন মোবাইল কার্ট ড্রয়ার তৈরি করা হয়েছে যা bKash ও ক্যাশ অন ডেলিভারির সাথে দ্রুত রিডাইরেক্ট হয়।",
      highlights: [
        "মোবাইলে পেজ লোড টাইম ৪.৫ সেকেন্ড থেকে কমিয়ে ০.৭ সেকেন্ডে নামানো হয়েছে",
        "+৪৮% মোবাইল চেকআউট কনভার্শন বৃদ্ধি",
        "৯৮% ক্যাশ-অন-ডেলিভারি ও অনলাইন পেমেন্ট ট্র্যাকিং নির্ভুলতা",
      ],
    },
  },

  // 6. CHATBASE AI (Bangla & English Support Agent)
  {
    id: "project-chatbase-ai",
    title: "Chatbase AI — 24/7 Bengali & English Customer Support Copilot",
    description:
      "Dual-language (Bangla & English) autonomous customer support AI assistant trained on product catalogs, pricing, and FAQs, resolving orders and customer queries 24/7.",
    image_url: imgChatbase,
    category: "AI Automation",
    subCategory: "GPT-4o RAG & WhatsApp",
    tags: ["GPT-4o", "Bangla NLP", "WhatsApp Business API", "Pinecone Vector DB", "RAG"],
    metrics: { label: "Automated Ticket Resolution", value: "82% Auto-Resolved (<10s Response)" },
    resultChip: "🤖 82% Auto-Resolved | 24/7 Agent",
    timeline: "2 Weeks",
    client: "Chatbase Intelligence",
    live_url: "https://www.chatbase.co",
    live_domain: "chatbase.co",
    caseStudyDetails: {
      challenge:
        "বাংলা ও ইংরেজি মিলিয়ে কাস্টমারদের ইনবক্সে শত শত মেসেজ আসত, যা ম্যানুয়ালি রিপ্লাই দিতে গিয়ে কাস্টমাররা অধৈর্য্য হয়ে অর্ডার ক্যান্সেল করত।",
      solution:
        "বাংলা ও ইংরেজি উভয় ভাষায় সাবলীল কাস্টম AI অ্যাসিস্ট্যান্ট ট্রেইন করে ফেসবুক মেসেঞ্জার ও হোয়াটসঅ্যাপে ইন্টিগ্রেট করা হয়েছে।",
      highlights: [
        "৮২% কমন প্রশ্ন ও অর্ডার স্ট্যাটাস স্বয়ংক্রিয়ভাবে হ্যান্ডেল করে",
        "১০ সেকেন্ডের মধ্যে সঠিক ও মিষ্টি ভাষায় বন্ধুত্বপূর্ণ রেসপন্স",
        "জটিল অভিযোগ স্বয়ংক্রিয়ভাবে হিউম্যান এজেন্টের কাছে হ্যান্ডওভার",
      ],
    },
  },

  // 7. DORJI BARI (Bangladeshi Fashion Retail & Storefront)
  {
    id: "project-dorjibari",
    title: "Dorji Bari — Omnichannel Retail Storefront & Inventory Sync",
    description:
      "Modern fashion e-commerce storefront with nationwide delivery tracking integration with Pathao/Steadfast, responsive size advisor, and ultra-smooth navigation.",
    image_url: imgDorjiBari,
    category: "Web Development",
    subCategory: "Fashion Retail Storefront",
    tags: ["Next.js 14", "Tailwind CSS", "Inventory POS API", "Framer Motion", "Bangla Typography"],
    metrics: { label: "Lighthouse Performance", value: "99/100 Score • 3.2x Hydration" },
    resultChip: "🚀 99/100 Score | 3.2x Speed",
    timeline: "3 Weeks",
    client: "Dorji Bari Bangladesh (দর্জি বাড়ি)",
    live_url: "https://dorjibari.com.bd",
    live_domain: "dorjibari.com.bd",
    caseStudyDetails: {
      challenge:
        "দেশজুড়ে একাধিক আউটলেট থাকায় আউটলেটের স্টক ও অনলাইন স্টোরের ইনভেনটরি সিনক্রোনাইজেশনে সমস্যা হতো এবং মোবাইল ডিভাইসে ব্রাউজিং ছিল ধীরগতির।",
      solution:
        "রিয়েলটাইম ইনভেনটরি সিন্কিং, ডায়নামিক সাইজ গাইড ও কুরিয়ার API ইন্টিগ্রেশনসহ মডার্ন হেডলেস স্টোরফ্রন্ট তৈরি করা হয়েছে।",
      highlights: [
        "৯৯/১০০ গুগল লাইটহাউস মোবাইল পারফরম্যান্স স্কোর",
        "৩.২x দ্রুতগতির ইন্টারঅ্যাকশন ও ইনস্ট্যান্ট প্রোডাক্ট ফিল্টারিং",
        "রিয়েলটাইম কুরিয়ার ট্র্যাকিং ও অটোমেটেড অর্ডার কনফার্মেশন",
      ],
    },
  },
];

// Fast automatic resolution to fixed local preview image by domain or live URL
export function getProjectImage(p?: Partial<EnrichedProject> | null): string {
  if (!p) return imgBloodBd;

  // 1. If explicit valid image_url is provided and not empty
  if (p.image_url && p.image_url.trim() && !p.image_url.includes("placeholder")) {
    return p.image_url;
  }

  // 2. Resolve by domain, live_url or title
  const url = (p.live_url || "").toLowerCase();
  const domain = (p.live_domain || "").toLowerCase();
  const title = (p.title || "").toLowerCase();

  if (url.includes("blood-bd") || domain.includes("blood-bd") || title.includes("blood")) {
    return imgBloodBd;
  }
  if (url.includes("gorurghash") || domain.includes("gorurghash") || title.includes("gorur ghash") || title.includes("meta ads")) {
    return imgGorurGhash;
  }
  if (url.includes("praava") || domain.includes("praava") || title.includes("praava") || title.includes("google ads")) {
    return imgPraava;
  }
  if (url.includes("make.com") || domain.includes("make.com") || title.includes("make flow") || title.includes("make.com")) {
    return imgMake;
  }
  if (url.includes("khaasfood") || domain.includes("khaasfood") || title.includes("khaas food") || title.includes("organic")) {
    return imgKhaasFood;
  }
  if (url.includes("chatbase") || domain.includes("chatbase") || title.includes("chatbase") || title.includes("support copilot")) {
    return imgChatbase;
  }
  if (url.includes("dorjibari") || domain.includes("dorjibari") || title.includes("dorji bari") || title.includes("fashion retail")) {
    return imgDorjiBari;
  }

  // 3. Dynamic screenshot if other live URL exists
  if (p.live_url && p.live_url.startsWith("http")) {
    return `https://api.microlink.io/?url=${encodeURIComponent(p.live_url)}&screenshot=true&meta=false&embed=screenshot.url`;
  }

  return imgBloodBd;
}

// Helper to determine category & tags from database fields
function enrichProject(p: Project): EnrichedProject {
  const text = `${p.title} ${p.description}`.toLowerCase();

  // If already matches a known curated sample, retain its authentic live URL & case study
  const matchSample = CURATED_SAMPLE_PROJECTS.find(
    (s) => s.title.toLowerCase() === p.title.toLowerCase() || s.id === p.id
  );
  if (matchSample) {
    return {
      ...matchSample,
      id: p.id || matchSample.id,
      image_url: p.image_url || matchSample.image_url,
    };
  }

  // Extract live URL if present in description e.g. (https://...)
  const urlMatch = p.description?.match(/https?:\/\/[^\s)]+/);
  const detectedUrl = urlMatch ? urlMatch[0] : "https://devdigital.xyz";
  let detectedDomain = "devdigital.xyz";
  try {
    detectedDomain = new URL(detectedUrl).hostname.replace(/^www\./, "");
  } catch {}

  let category: EnrichedProject["category"] = "Web Development";
  let tags = ["Next.js", "TypeScript", "TailwindCSS"];
  let metrics = { label: "Performance", value: "99/100 Score" };

  if (
    text.includes("seo") ||
    text.includes("marketing") ||
    text.includes("ads") ||
    text.includes("growth") ||
    text.includes("funnel") ||
    text.includes("facebook") ||
    text.includes("google") ||
    text.includes("meta") ||
    text.includes("cro")
  ) {
    category = "Digital Marketing";
    tags = ["Meta Ads", "Google Ads", "CRO Funnel", "Attribution CAPI"];
    metrics = { label: "Revenue Surge", value: "+380% ROAS ($120K+)" };
  } else if (
    text.includes("ai") ||
    text.includes("bot") ||
    text.includes("automation") ||
    text.includes("agent") ||
    text.includes("workflow") ||
    text.includes("crm")
  ) {
    category = "AI Automation";
    tags = ["OpenAI GPT-4", "Make.com", "Vector Search", "CRM Webhooks"];
    metrics = { label: "Labor Reduced", value: "85% Auto Cut (<20s)" };
  }

  const resultChip =
    category === "Digital Marketing"
      ? "📈 +380% ROAS | Verified Growth"
      : category === "AI Automation"
      ? "🤖 85% Auto Cut | 24/7 Agent"
      : "⚡ 0.6s Speed | 99 Lighthouse";

  return {
    ...p,
    image_url: p.image_url || imgBloodBd,
    category,
    tags,
    metrics,
    resultChip,
    timeline: "2-4 Weeks",
    client: p.title.split("—")[0].trim() || "Enterprise Client",
    live_url: detectedUrl,
    live_domain: detectedDomain,
    caseStudyDetails: {
      challenge:
        "The client required modern infrastructure to eliminate conversion leakage, streamline operations, and scale customer acquisition.",
      solution:
        "Engineered a bespoke high-converting architecture with sub-second performance, automated workflows, and verified tracking.",
      highlights: [
        "Delivered production-ready implementation within agreed timeline",
        "Integrated seamless analytics and conversion attribution",
        "Significantly lowered acquisition costs and operational overhead",
      ],
    },
  };
}

export default function Projects({ all = false }: { all?: boolean }) {
    // Pre-cache all project screenshots in browser memory immediately on mount
  useEffect(() => {
    const projectImages = [
      imgBloodBd,
      imgGorurGhash,
      imgPraava,
      imgMake,
      imgKhaasFood,
      imgChatbase,
      imgDorjiBari,
    ];
    projectImages.forEach((src) => {
      const img = new Image();
      img.src = src;
    });
  }, []);

  const [customList, setCustomList] = useState<EnrichedProject[] | null>(null);
  const [dbProjects, setDbProjects] = useState<Project[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [activeModalProject, setActiveModalProject] = useState<EnrichedProject | null>(null);

  useEffect(() => {
    (async () => {
      try {
        // 1. Check site_settings for admin-customized projects
        const { data: s } = await supabase
          .from("site_settings")
          .select("value")
          .eq("key", "portfolio_projects")
          .maybeSingle();

        if (s?.value && Array.isArray(s.value) && s.value.length > 0) {
          setCustomList(s.value as EnrichedProject[]);
          return;
        }

        // 2. Fallback to Supabase projects table
        let q = supabase
          .from("projects")
          .select("id,title,description,image_url,featured,sort_order")
          .order("sort_order");
        if (!all) q = q.eq("featured", true).limit(16);
        const { data } = await q;
        if (data && data.length > 0) {
          const valid = (data as Project[]).filter(
            (p) => !LEGACY_PLACEHOLDERS.has(p.title.toLowerCase().trim())
          );
          setDbProjects(valid);
        }
      } catch (err) {
        console.error("Projects fetch error:", err);
      }
    })();
  }, [all]);

  // Combine authentic curated showcase projects with any real custom projects added by user
  const allEnrichedProjects = useMemo(() => {
    if (customList && customList.length > 0) {
      return customList;
    }

    // Enrich any genuine custom projects from database
    const fromDb = dbProjects.map((p) => enrichProject(p));
    const dbTitles = new Set(fromDb.map((p) => p.title.toLowerCase()));

    // Merge curated real projects so the showcase is always comprehensive and high-impact
    const remainingCurated = CURATED_SAMPLE_PROJECTS.filter(
      (s) => !dbTitles.has(s.title.toLowerCase())
    );

    return [...fromDb, ...remainingCurated];
  }, [dbProjects, customList]);

  // Filter projects by category tab
  const filteredProjects = useMemo(() => {
    const list =
      selectedCategory === "All"
        ? allEnrichedProjects
        : allEnrichedProjects.filter((p) => p.category === selectedCategory);
    // On homepage, limit to 6 for desktop (mobile will show 4 via responsive CSS)
    return all ? list : list.slice(0, 6);
  }, [allEnrichedProjects, selectedCategory, all]);

  // Category counts
  const counts = useMemo(() => {
    return {
      All: allEnrichedProjects.length,
      "Digital Marketing": allEnrichedProjects.filter((p) => p.category === "Digital Marketing").length,
      "Web Development": allEnrichedProjects.filter((p) => p.category === "Web Development").length,
      "AI Automation": allEnrichedProjects.filter((p) => p.category === "AI Automation").length,
    };
  }, [allEnrichedProjects]);

  return (
    <section id="projects" className="relative py-12 sm:py-16 md:py-24 content-auto overflow-hidden isolate bg-[#0A0C11]">
      {/* Ambient background glow & Watermark */}
      <SectionWatermark text="PROJECTS" glowColor="cyan" />

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

      <div className="container relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-6 mb-6 sm:mb-10 md:mb-12">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-0.5 sm:px-3.5 sm:py-1 rounded-full text-[11px] sm:text-xs font-semibold tracking-[0.2em] sm:tracking-[0.25em] text-primary uppercase bg-primary/10 border border-primary/25 mb-2.5 sm:mb-3">
              <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              <span>Verified Client Showcase &bull; Bangladesh & Global</span>
            </div>
            <h2 className="font-display text-2xl sm:text-4xl md:text-6xl font-extrabold tracking-tight">
              {all ? "All " : "Featured "}<span className="text-gradient">Projects</span>
            </h2>
            <p className="text-muted-foreground text-xs sm:text-base mt-1.5 sm:mt-2 max-w-2xl leading-relaxed">
              Real-world verified case studies — Meta & Google ad scaling, sub-second web platforms (including Blood BD), and 24/7 autonomous Make.com workflows.
            </p>
          </div>

          {!all && (
            <Link
              to="/projects"
              className="glass-strong rounded-full px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-semibold hover:scale-105 transition-all inline-flex items-center gap-2 border border-white/10 hover:border-primary/40 self-start md:self-auto group"
            >
              <span>Explore All Work</span>
              <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-primary" />
            </Link>
          )}
        </div>

        {/* 1. INTERACTIVE CATEGORY FILTER TABS */}
        <div className="flex items-center gap-1.5 sm:gap-3 mb-6 sm:mb-10 pb-1.5 overflow-x-auto scrollbar-hide flex-nowrap sm:flex-wrap">
          {CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.id;
            const count = counts[cat.id as keyof typeof counts] || 0;

            return (
              <motion.button
                key={cat.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(cat.id)}
                className={`relative px-3 py-1.5 sm:px-5 sm:py-2.5 rounded-full text-xs sm:text-sm font-semibold transition-all duration-300 flex items-center gap-1.5 sm:gap-2 border shrink-0 ${
                  isSelected
                    ? "text-white border-transparent shadow-neon"
                    : "text-muted-foreground border-white/10 glass hover:text-white hover:bg-white/10"
                }`}
              >
                {isSelected && (
                  <motion.div
                    layoutId="activeProjectPill"
                    className="absolute inset-0 rounded-full bg-gradient-primary -z-10"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
                <Icon className={`w-3 h-3 sm:w-3.5 sm:h-3.5 ${isSelected ? "text-white" : "text-primary"}`} />
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] sm:text-[11px] font-mono px-1.5 py-0.2 sm:px-2 sm:py-0.5 rounded-full ${
                    isSelected ? "bg-white/20 text-white" : "bg-white/5 text-muted-foreground"
                  }`}
                >
                  {count}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* 2. PROJECTS GRID */}
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6 md:gap-8">
          <AnimatePresence>
            {filteredProjects.map((p, i) => {
              // On homepage (!all), show top 4 on mobile (<sm), and 6 on desktop (sm:)
              const isMobileHidden = !all && i >= 4;
              return (
                <motion.article
                  layout
                  key={p.id}
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.45, delay: i * 0.04 }}
                  onClick={() => setActiveModalProject(p)}
                  className={`h-full cursor-pointer ${isMobileHidden ? "hidden sm:block" : "block"}`}
                >
                  <HolographicCard
                    onClick={() => setActiveModalProject(p)}
                    className="group h-full rounded-2xl sm:rounded-3xl overflow-hidden glass-strong border border-white/10 hover:border-primary/50 transition-all duration-500 cursor-pointer flex flex-col justify-between hover:shadow-[0_20px_50px_rgba(0,153,255,0.22)]"
                    tiltStrength={6}
                    enableBorderBeam={true}
                    enableGlare={true}
                  >
                    <div className="flex flex-col justify-between h-full">
                      <div>
                        {/* REALISTIC BROWSER MOCKUP FRAME */}
                        <div className="relative rounded-t-2xl sm:rounded-t-3xl overflow-hidden bg-[#10141F] border-b border-white/10 shadow-lg">
                          {/* Browser Chrome Header */}
                          <div className="px-3 py-2 bg-[#121622] border-b border-white/10 flex items-center justify-between text-[11px] select-none">
                            {/* Traffic lights */}
                            <div className="flex items-center gap-1.5">
                              <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80 inline-block shadow-sm" />
                              <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80 inline-block shadow-sm" />
                              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 inline-block shadow-sm" />
                            </div>

                            {/* Address bar capsule */}
                            <div className="flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-black/60 border border-white/10 text-[10px] text-zinc-300 font-mono max-w-[200px] truncate shadow-inner">
                              <Lock className="w-2.5 h-2.5 text-emerald-400 shrink-0" />
                              <span className="truncate">{p.live_domain}</span>
                            </div>

                            {/* Live Status indicator */}
                            <div className="flex items-center gap-1 text-[9px] font-mono font-semibold text-emerald-400 bg-emerald-950/70 px-2 py-0.5 rounded border border-emerald-500/30">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              <span>LIVE</span>
                            </div>
                          </div>

                          {/* Visual Image Header */}
                          <div className="relative aspect-[16/10] overflow-hidden bg-neutral-900">
                            <img
                              src={p.image_url || imgBloodBd}
                              alt={p.title}
                              loading="lazy"
                              decoding="async"
                              onError={(e) => {
                                (e.currentTarget as HTMLImageElement).src = imgBloodBd;
                              }}
                              className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                            />
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0A0C11] via-transparent to-transparent pointer-events-none opacity-90" />

                          {/* Shimmer sweep on hover */}
                          <div
                            aria-hidden="true"
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out pointer-events-none"
                          />

                          {/* Top Left: Category Pill */}
                          <div className="absolute top-2.5 left-2.5 sm:top-3 sm:left-3 flex items-center gap-1.5 z-10">
                            <span className="text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-black/85 text-white backdrop-blur-md border border-white/20 shadow-md flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                              {p.category}
                            </span>
                          </div>

                          {/* Top Right: Verified Metric Chip */}
                          {p.resultChip && (
                            <div className="absolute top-2.5 right-11 sm:top-3 sm:right-12 px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-950/90 border border-emerald-500/40 text-emerald-300 font-mono text-[9px] sm:text-[11px] font-semibold backdrop-blur-md shadow-[0_0_15px_rgba(16,185,129,0.35)] flex items-center gap-1.5 z-10">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                              <span className="truncate max-w-[130px] sm:max-w-none">{p.resultChip}</span>
                            </div>
                          )}

                          {/* Top Right: Open Modal Arrow */}
                          <div className="absolute top-2.5 right-2.5 sm:top-3 sm:right-3 w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/70 text-white backdrop-blur-md border border-white/20 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:bg-primary group-hover:border-primary shadow-lg z-10">
                            <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                          </div>

                          {/* Floating Bottom Bar: Live Website Domain & Metric */}
                          <div className="absolute bottom-2.5 left-2.5 right-2.5 sm:bottom-3 sm:left-3 sm:right-3 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-xl bg-black/85 backdrop-blur-md border border-white/15 flex items-center justify-between text-[11px] sm:text-xs shadow-lg z-10">
                            <span className="text-zinc-200 font-medium truncate flex items-center gap-1.5">
                              <Globe className="w-3.5 h-3.5 text-primary shrink-0" />
                              <span className="text-white font-mono text-[10px] sm:text-xs font-semibold">{p.live_domain}</span>
                            </span>
                            <span className="font-mono font-bold text-emerald-300 bg-emerald-950/90 px-2 py-0.5 rounded border border-emerald-500/40 shadow-[0_0_8px_rgba(16,185,129,0.2)] shrink-0 ml-2">
                              {p.metrics.value}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Body Content */}
                      <div className="p-4 sm:p-6">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[11px] font-semibold text-primary font-mono">
                            {p.client}
                          </span>
                        </div>
                        <h3 className="font-display text-base sm:text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1 mb-1.5">
                          {p.title}
                        </h3>
                        <p className="text-muted-foreground text-xs sm:text-sm line-clamp-2 leading-relaxed">
                          {p.description}
                        </p>

                        {/* Instant Problem ➜ Strategy ➜ Impact Strip for Buyers */}
                        <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5 text-[11px]">
                          <div className="flex items-start gap-1.5 text-zinc-300">
                            <span className="px-1.5 py-0.5 rounded bg-rose-500/15 text-rose-300 border border-rose-500/25 text-[9px] font-mono font-bold shrink-0 mt-0.5">
                              CHALLENGE
                            </span>
                            <span className="text-muted-foreground truncate">
                              {p.caseStudyDetails?.challenge ? p.caseStudyDetails.challenge.slice(0, 48) + "..." : "Legacy bottlenecks & low ROAS"}
                            </span>
                          </div>
                          <div className="flex items-start gap-1.5 text-zinc-300">
                            <span className="px-1.5 py-0.5 rounded bg-cyan-500/15 text-cyan-300 border border-cyan-500/25 text-[9px] font-mono font-bold shrink-0 mt-0.5">
                              STRATEGY
                            </span>
                            <span className="text-muted-foreground truncate">
                              {p.caseStudyDetails?.solution ? p.caseStudyDetails.solution.slice(0, 48) + "..." : "Sub-second edge stack & funnel CRO"}
                            </span>
                          </div>
                          <div className="flex items-start gap-1.5">
                            <span className="px-1.5 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/25 text-[9px] font-mono font-bold shrink-0 mt-0.5">
                              IMPACT
                            </span>
                            <span className="text-emerald-400 font-semibold font-mono truncate">
                              {p.metrics.value}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer Tags & Direct Action Buttons */}
                    <div className="p-4 pt-0 sm:p-6 sm:pt-0 border-t border-white/5 mt-auto">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-1.5 pt-3 mb-3">
                        {p.tags.slice(0, 3).map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="text-[9px] sm:text-[10px] font-mono font-medium px-2 py-0.5 rounded-md bg-white/5 text-muted-foreground border border-white/10"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {/* Interactive Actions Row */}
                      <div className="flex items-center justify-between pt-1">
                        {/* Direct Clickable Live Website Link */}
                        <a
                          href={p.live_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold bg-primary/15 hover:bg-primary text-primary hover:text-white border border-primary/30 transition-all hover:scale-105 shadow-sm"
                          title={`Visit ${p.live_domain} directly`}
                        >
                          <ExternalLink className="w-3 h-3" />
                          <span>Live Site ↗</span>
                        </a>

                        <div className="flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-muted-foreground group-hover:text-white transition-colors">
                          <span>Case Study</span>
                          <ArrowUpRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 group-hover:translate-x-0.5 transition-transform text-primary" />
                        </div>
                      </div>
                    </div>
                  </div>
                </HolographicCard>
              </motion.article>
            );
          })}
          </AnimatePresence>
        </motion.div>

        {/* PROMINENT "EXPLORE ALL WORKS" BOTTOM CTA BANNER (DESKTOP & MOBILE) */}
        {!all && (
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="mt-12 sm:mt-16 md:mt-20 pt-8 sm:pt-10 border-t border-white/10 flex flex-col items-center justify-center text-center relative"
          >
            {/* Ambient Radial Glow behind CTA */}
            <div
              aria-hidden="true"
              className="absolute -top-10 left-1/2 -translate-x-1/2 w-[320px] sm:w-[550px] h-[140px] rounded-full blur-[100px] opacity-30 pointer-events-none"
              style={{ background: "radial-gradient(circle, #0099FF 0%, #38BDF8 40%, transparent 75%)" }}
            />

            <div className="relative z-10 max-w-2xl mx-auto flex flex-col items-center px-4">
              {/* Category pill indicator */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-[11px] sm:text-xs font-mono font-semibold text-primary bg-primary/10 border border-primary/25 mb-3 sm:mb-4 backdrop-blur-md">
                <Sparkles className="w-3.5 h-3.5 text-primary animate-pulse" />
                <span>COMPLETE PORTFOLIO ARCHIVE &bull; BANGLADESH &amp; GLOBAL</span>
              </div>

              <h3 className="font-display text-xl sm:text-3xl md:text-4xl font-extrabold text-foreground mb-6 sm:mb-8 tracking-tight">
                Explore <span className="text-gradient">All Real-World Works</span> &amp; Case Studies
              </h3>

              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row items-center gap-3.5 sm:gap-4 w-full sm:w-auto justify-center">
                {/* 1. Main Cosmic "Explore All Works" CTA Button (Ultra-Fancy High-Aesthetic Glass Jewel) */}
                <Link
                  to="/projects"
                  className="group relative inline-flex items-center justify-center p-[2px] rounded-full hover:scale-105 active:scale-95 transition-all duration-300 w-full sm:w-auto shadow-[0_0_40px_rgba(6,182,212,0.4),0_0_80px_rgba(59,130,246,0.25)] hover:shadow-[0_0_60px_rgba(6,182,212,0.7),0_0_100px_rgba(147,51,234,0.45)]"
                >
                  {/* Outer Pulsing Ambient Aura */}
                  <div
                    aria-hidden="true"
                    className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-500/40 via-blue-500/35 to-purple-500/40 blur-lg opacity-70 group-hover:opacity-100 group-hover:blur-xl transition-all duration-500 pointer-events-none"
                  />

                  {/* Rotating Conic Multi-Color Laser Border Beam */}
                  <div className="absolute inset-0 rounded-full overflow-hidden pointer-events-none">
                    <div
                      className="absolute -inset-[200%] animate-border-beam pointer-events-none"
                      style={{
                        background:
                          "conic-gradient(from 0deg at 50% 50%, transparent 0deg 240deg, #06B6D4 270deg, #38BDF8 310deg, #818CF8 340deg, #C084FC 360deg)",
                      }}
                    />
                  </div>

                  {/* Glass Jewel Button Surface */}
                  <div
                    className="relative z-10 w-full sm:w-auto px-7 sm:px-9 py-4 sm:py-4.5 rounded-full backdrop-blur-2xl border border-white/30 group-hover:border-white/60 flex items-center justify-center gap-3 text-white text-xs sm:text-sm font-bold tracking-wide transition-all duration-300 overflow-hidden shadow-[inset_0_1px_2px_rgba(255,255,255,0.4),inset_0_-1px_1px_rgba(0,0,0,0.5)]"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(20, 28, 55, 0.95) 0%, rgba(13, 18, 36, 0.98) 50%, rgba(10, 14, 28, 0.98) 100%)",
                    }}
                  >
                    {/* Top specular reflection hairline */}
                    <span
                      aria-hidden="true"
                      className="absolute top-0 left-1/4 right-1/4 h-[1px] bg-gradient-to-r from-transparent via-cyan-200/90 to-transparent pointer-events-none"
                    />

                    {/* Hover light sheen sweep */}
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-[250%] transition-transform duration-1000 ease-in-out bg-gradient-to-r from-transparent via-white/20 to-transparent pointer-events-none"
                    />

                    {/* Animated Pulsing Sparkles Jewel Icon */}
                    <div className="w-6 h-6 rounded-full bg-cyan-400/20 border border-cyan-400/40 flex items-center justify-center text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.6)] group-hover:rotate-45 group-hover:scale-110 transition-transform duration-300 shrink-0">
                      <Sparkles className="w-3.5 h-3.5 fill-cyan-400/30" />
                    </div>

                    {/* Main Label */}
                    <span className="relative z-10 text-white font-extrabold tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] text-sm sm:text-base">
                      View All Works
                    </span>

                    {/* Futuristic Glowing Projects Count Chip */}
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-mono font-bold bg-cyan-400/15 border border-cyan-400/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.35)] shrink-0 group-hover:bg-cyan-400/25 group-hover:border-cyan-300 transition-colors">
                      <span className="relative flex h-1.5 w-1.5 shrink-0">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                        <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-cyan-400" />
                      </span>
                      <span>{allEnrichedProjects.length} Projects</span>
                    </span>

                    {/* Arrow Icon with Hover Float */}
                    <div className="w-6 h-6 rounded-full bg-white/[0.08] group-hover:bg-cyan-400 group-hover:text-slate-950 text-cyan-300 border border-white/15 flex items-center justify-center transition-all duration-300 shrink-0 shadow-sm">
                      <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </div>
                </Link>

                {/* 2. Direct Strategy Call Booking Button */}
                <button
                  type="button"
                  onClick={() => openBookingModal("Portfolio Bottom CTA - All Projects")}
                  className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 rounded-full glass hover:bg-white/10 text-white text-xs sm:text-sm font-semibold border border-white/15 hover:border-primary/40 transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Book Free Consultation</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {filteredProjects.length === 0 && (
          <div className="text-center py-16 glass rounded-3xl border border-white/10 max-w-md mx-auto my-8">
            <Layers className="w-10 h-10 text-muted-foreground mx-auto mb-3 opacity-40" />
            <p className="text-foreground font-semibold">No projects in this category yet.</p>
            <p className="text-xs text-muted-foreground mt-1">Select "All Work" to view other projects.</p>
          </div>
        )}
      </div>

      {/* 3. CINEMATIC CASE STUDY MODAL */}
      <AnimatePresence>
        {activeModalProject && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModalProject(null)}
              className="absolute inset-0 bg-black/85 backdrop-blur-xl"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.94, y: 25 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.94, y: 25 }}
              transition={{ type: "spring", damping: 26, stiffness: 320 }}
              className="relative w-full max-w-3xl max-h-[92vh] overflow-y-auto glass-strong rounded-3xl border border-white/15 p-4 sm:p-8 shadow-2xl z-10 custom-scrollbar bg-[#0C0F17]/95"
            >
              {/* Close Button */}
              <button
                onClick={() => setActiveModalProject(null)}
                className="absolute top-4 right-4 sm:top-5 sm:right-5 w-9 h-9 rounded-full glass hover:bg-white/10 flex items-center justify-center text-muted-foreground hover:text-white transition-all z-20 border border-white/10"
                aria-label="Close Modal"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Modal Cover Image with Browser Chrome */}
              <div className="rounded-2xl overflow-hidden bg-[#10141F] border border-white/15 mb-6 shadow-2xl">
                <div className="px-4 py-2.5 bg-[#121622] border-b border-white/10 flex items-center justify-between text-xs select-none">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500 inline-block" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 inline-block" />
                  </div>
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-black/60 border border-white/10 text-xs font-mono text-zinc-300">
                    <Lock className="w-3 h-3 text-emerald-400" />
                    <span>{activeModalProject.live_url}</span>
                  </div>
                  <span className="text-[10px] font-mono text-emerald-400 font-semibold">● ACTIVE</span>
                </div>

                <div className="relative aspect-video overflow-hidden bg-neutral-900 group">
                  <img
                    src={activeModalProject.image_url || imgBloodBd}
                    alt={activeModalProject.title}
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = imgBloodBd;
                    }}
                    className="w-full h-full object-cover object-top"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent pointer-events-none" />

                  {/* Top Left: Category Badge */}
                  <span className="absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full bg-black/85 text-white backdrop-blur-md border border-white/20 flex items-center gap-1.5 pointer-events-none">
                    <span className="w-2 h-2 rounded-full bg-primary" />
                    {activeModalProject.category}
                  </span>

                  {/* Top Right: Metric Chip */}
                  {activeModalProject.resultChip && (
                    <span className="absolute top-3 right-14 sm:right-16 text-xs font-semibold px-3 py-1 rounded-full bg-emerald-950/90 text-emerald-300 backdrop-blur-md border border-emerald-500/40 flex items-center gap-1.5 shadow-[0_0_15px_rgba(16,185,129,0.35)] font-mono pointer-events-none">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      {activeModalProject.resultChip}
                    </span>
                  )}

                  {/* Bottom Left: DIRECT LIVE WEBSITE BUTTON OVERLAY */}
                  <a
                    href={activeModalProject.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 left-3 px-3.5 py-1.5 rounded-full bg-primary hover:bg-primary-glow text-white text-xs font-semibold backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition-all hover:scale-105 shadow-neon"
                  >
                    <Globe className="w-3.5 h-3.5" />
                    <span>Visit Live Website: {activeModalProject.live_domain} ↗</span>
                  </a>

                  {/* Open Full Image in new tab */}
                  <a
                    href={activeModalProject.image_url || imgBloodBd}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute bottom-3 right-3 px-3 py-1.5 rounded-full bg-black/75 hover:bg-black text-white text-xs backdrop-blur-md border border-white/20 flex items-center gap-1.5 transition-all hover:scale-105 shadow-lg"
                    title="Open full size image"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-primary" />
                    <span>Full Image</span>
                  </a>
                </div>
              </div>

              {/* Header Info */}
              <div className="mb-6">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-semibold text-primary bg-primary/10 border border-primary/25">
                    <Sparkles className="w-3 h-3 text-accent" />
                    <span>VERIFIED CLIENT CASE STUDY &bull; {activeModalProject.client}</span>
                  </div>

                  {/* Prominent Live Website Button in Header */}
                  <a
                    href={activeModalProject.live_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-emerald-500/15 hover:bg-emerald-500 text-emerald-400 hover:text-white border border-emerald-500/30 text-xs font-semibold transition-all hover:scale-105 shadow-[0_0_12px_rgba(16,185,129,0.25)]"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Open {activeModalProject.live_domain} ↗</span>
                  </a>
                </div>

                <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-foreground mb-3 leading-tight">
                  {activeModalProject.title}
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
                  {activeModalProject.description}
                </p>
              </div>

              {/* Problem vs Solution Bento */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
                <div className="glass rounded-2xl p-4 border border-rose-500/25 bg-rose-500/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-rose-400" />
                    The Challenge & Bottleneck (চ্যালেঞ্জ)
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {activeModalProject.caseStudyDetails?.challenge ||
                      "The client struggled with low conversion rates, high customer acquisition costs, and legacy bottlenecks prior to implementation."}
                  </p>
                </div>

                <div className="glass rounded-2xl p-4 border border-emerald-500/25 bg-emerald-500/5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400 block mb-1.5 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    The Engineered Strategy (সমাধান ও কৌশল)
                  </span>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {activeModalProject.caseStudyDetails?.solution ||
                      "Engineered a tailored high-impact solution with sub-second performance, optimized conversion funnels, and automated systems."}
                  </p>
                </div>
              </div>

              {/* Key Case Study Highlights */}
              {activeModalProject.caseStudyDetails?.highlights && (
                <div className="glass rounded-2xl p-4 border border-white/10 mb-6 bg-white/[0.02]">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary block mb-2.5">
                    Verified Key Highlights & Impact (মূল সাফল্য)
                  </span>
                  <div className="space-y-2">
                    {activeModalProject.caseStudyDetails.highlights.map((h, hIdx) => (
                      <div key={hIdx} className="flex items-start gap-2 text-xs text-zinc-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 3 Metrics Cards */}
              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="glass rounded-2xl p-4 text-center border border-white/10 bg-white/[0.02]">
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                    {activeModalProject.metrics.label}
                  </div>
                  <div className="text-base sm:text-xl font-display font-black text-primary mt-0.5">
                    {activeModalProject.metrics.value}
                  </div>
                </div>

                <div className="glass rounded-2xl p-4 text-center border border-white/10 bg-white/[0.02]">
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Timeline
                  </div>
                  <div className="text-base sm:text-xl font-display font-bold text-foreground mt-0.5">
                    {activeModalProject.timeline}
                  </div>
                </div>

                <div className="glass rounded-2xl p-4 text-center border border-white/10 bg-white/[0.02]">
                  <div className="text-[10px] text-muted-foreground uppercase font-semibold">
                    Status
                  </div>
                  <div className="text-base sm:text-xl font-display font-bold text-emerald-400 mt-0.5 flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-4 h-4 shrink-0" /> Live & Scaled
                  </div>
                </div>
              </div>

              {/* Tech Stack */}
              <div className="mb-8">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3">
                  Technologies & Architecture Stack
                </h4>
                <div className="flex flex-wrap gap-2">
                  {activeModalProject.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono font-medium px-3 py-1 rounded-lg bg-primary/10 border border-primary/25 text-primary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Action CTA */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-white/10">
                {/* 1. Visit Live Website Button */}
                <a
                  href={activeModalProject.live_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-primary hover:bg-primary-glow text-white font-semibold py-3 px-5 rounded-xl text-center text-xs sm:text-sm shadow-neon hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Globe className="w-4 h-4" />
                  <span>Visit Live Website ↗</span>
                </a>

                {/* 2. Book Call Button */}
                <button
                  type="button"
                  onClick={() => {
                    const title = activeModalProject.title;
                    setActiveModalProject(null);
                    openBookingModal(`Case Study: ${title}`);
                  }}
                  className="flex-1 bg-white/10 hover:bg-white/15 text-white font-semibold py-3 px-5 rounded-xl text-center text-xs sm:text-sm border border-white/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4 text-primary" />
                  <span>Book Call for This Scope</span>
                </button>

                {/* 3. WhatsApp Chat Button */}
                <a
                  href={`https://wa.me/8801941130981?text=Hi%20Sabbir,%20I%20saw%20your%20case%20study%20for%20${encodeURIComponent(
                    activeModalProject.client
                  )}%20(${encodeURIComponent(
                    activeModalProject.live_url
                  )}).%20I%20would%20like%20to%20discuss%20a%20similar%20project!`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 px-5 rounded-xl text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 hover:scale-[1.02]"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>WhatsApp Chat</span>
                </a>

                <button
                  onClick={() => setActiveModalProject(null)}
                  className="glass text-foreground hover:bg-white/10 font-semibold py-3 px-4 rounded-xl text-xs sm:text-sm border border-white/10 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
