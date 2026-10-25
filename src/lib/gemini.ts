/**
 * DevDigital AI Assistant Service using Google Gemini API
 * Trained with comprehensive knowledge of DevDigital & Sabbir's portfolio
 */

export interface ChatMessage {
  role: "user" | "model";
  text: string;
}

const DEVDIGITAL_KNOWLEDGE_BASE = `
# FOUNDER & IDENTITY:
- Name: Sabbir (Founder of DevDigital / devdigital.xyz)
- Role: Full-Stack Growth Engineer, Web Developer & Performance Marketing Specialist
- Location: Dhaka, Bangladesh (UTC+6)
- Track Record: 50+ scaled client projects, 100% verified client satisfaction, clients across USA, Europe, UK, and Bangladesh.
- Direct WhatsApp Line: +880 1941-130981 (wa.me/8801941130981)
- Email: developersabbir.x@gmail.com
- Meeting Link: Free 15-30 minute strategy audit call available on Google Meet / Zoom.

# CORE SERVICES & EXPERTISE:
1. Digital Marketing & Paid Ad Acquisition:
   - Meta Ads (Facebook & Instagram) and Google Ads high-ROAS scaling.
   - Server-Side Meta Conversions API (CAPI) with 99% event match rate (solves iOS 14+ tracking loss).
   - Creative testing, funnel optimization, high-converting landing page CRO.
   - Proven 3.2x to 5.4x verified ROAS for e-commerce and lead-gen clients.

2. Full-Stack Web Development:
   - Modern stack: Next.js 14/15, React, TypeScript, Tailwind CSS, Supabase (PostgreSQL), Vite.
   - Sub-second load speeds (99+ Google Lighthouse performance score).
   - Custom web apps, SaaS platforms, e-commerce storefronts, and conversion-optimized landing pages.
   - Clean, maintainable architecture with 100% intellectual property (IP) handover.

3. AI Automations & Autonomous Agents:
   - n8n automated workflows, Python agents, LangChain, Gemini API, OpenAI integration.
   - Automated CRM sync, WhatsApp chatbot assistants, instant lead scoring & routing.
   - 24/7 autonomous triage that saves businesses 20+ human hours every week.

# PRICING PACKAGES:
1. Free Discovery ($0):
   - 30-minute 1:1 strategy discovery session with Sabbir on Google Meet.
   - Complete audit of Meta & Google Ads, CRO review of current website, AI automation roadmap.
   - 100% free with zero commitment.

2. Growth Engine ($490/month, or $365/month billed annually - save 25%):
   - Meta & Google Ads campaign scaling + Server-side CAPI (99% match).
   - Continuous landing page CRO and speed optimizations.
   - Automated CRM & WhatsApp lead routing.
   - Weekly video performance reports + direct private line with Sabbir.

3. Scale & Dominate ($1,250/month, or $935/month billed annually - save 25%):
   - Everything in Growth Engine.
   - Complete turnkey custom Next.js web application.
   - 24/7 autonomous conversational AI agents for lead capture.
   - Omnichannel paid acquisition (Meta, Google, YouTube).
   - Continuous A/B testing & priority 4-hour SLA response.

4. Enterprise Titan ("Let's talk" / Custom Scope):
   - Dedicated full-stack developer & ad strategist squad.
   - Proprietary internal AI bots & custom n8n pipelines.
   - Multi-tenant architecture & payment gateways.
   - Private dedicated Slack channel, 1-hour critical SLA, full NDA & IP ownership handover.

# GUARANTEES & POLICIES:
- 100% IP Ownership: Clients own all repositories, ad accounts, and data.
- Zero Lock-in: Cancel anytime with total flexibility.
- Direct Communication: Private line with Sabbir via WhatsApp or Slack.
`;

const SYSTEM_INSTRUCTION = `You are "Sabbir AI (ai-copilot v2.6)", the official strategic AI assistant for DevDigital (founded by Sabbir).

You have complete knowledge of DevDigital:
${DEVDIGITAL_KNOWLEDGE_BASE}

YOUR BEHAVIOR & RULES:
1. Tone: Confident, sharp, authoritative, modern, and warmly helpful.
2. Language:
   - If the user writes in Bengali or Banglish, respond in natural, fluent, and professional Bengali (or Banglish).
   - If the user writes in English, respond in polished, executive English.
3. Keep answers concise, punchy, and formatted with clean bullet points so they read smoothly in the terminal window (100-200 words max).
4. Direct Answers: Provide specific numbers, tech stack details, pricing, and strategies directly without hesitation.
5. Proactive Call-to-Action: Conclude answers by inviting the user to either:
   - Message Sabbir directly on WhatsApp (+880 1941-130981) for a quick chat, or
   - Book a Free 1:1 Strategy Meeting on the website.`;

// Tested & verified working Google Gemini models in order of speed and stability
const CANDIDATE_MODELS = [
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
  "gemini-3.1-pro-preview",
];

export async function askGemini(
  prompt: string,
  history: ChatMessage[] = []
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey || apiKey === "your_gemini_api_key_here") {
    return generateLocalFallback(prompt);
  }

  // Format previous history into Gemini contents format
  const contents = [
    ...history.slice(-6).map((msg) => ({
      role: msg.role === "user" ? "user" : "model",
      parts: [{ text: msg.text }],
    })),
    {
      role: "user",
      parts: [{ text: prompt }],
    },
  ];

  const payload = {
    systemInstruction: {
      parts: [{ text: SYSTEM_INSTRUCTION }],
    },
    contents,
    generationConfig: {
      temperature: 0.65,
      maxOutputTokens: 600,
    },
  };

  let lastError: Error | null = null;

  // Try candidate models in order
  for (const model of CANDIDATE_MODELS) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 12000);

      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
          signal: controller.signal,
        }
      );

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        const errMsg = errorData?.error?.message || `HTTP ${response.status}`;
        lastError = new Error(`Model ${model}: ${errMsg}`);
        continue;
      }

      const data = await response.json();
      const text = data.candidates?.[0]?.content?.parts?.[0]?.text;

      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (err: any) {
      lastError = err;
    }
  }

  // If Gemini API experiences temporary downtime or rate-limit, fallback to rich local knowledge base
  console.warn("Gemini remote fallback triggered:", lastError?.message);
  return generateLocalFallback(prompt);
}

/**
 * High-fidelity intelligent local fallback responder that knows all details of DevDigital
 */
function generateLocalFallback(query: string): string {
  const q = query.toLowerCase();

  // Pricing / Cost
  if (q.includes("price") || q.includes("cost") || q.includes("package") || q.includes("plan") || q.includes("টাকা") || q.includes("দাম") || q.includes("খরচ")) {
    return (
      `DevDigital-এর প্রাইসিং প্যাকেজসমূহ:\n\n` +
      `1. Free Discovery ($0): ৩০ মিনিটের ফ্রি স্ট্র্যাটেজি কল + অ্যাড ও ওয়েবসাইট অডিট।\n` +
      `2. Growth Engine ($490/মাস বা $365 বার্ষিক): Meta & Google Ads স্কেলিং, সার্ভার-সাইড CAPI (99% ম্যাচ), CRO ও অটোমেশন।\n` +
      `3. Scale & Dominate ($1,250/মাস বা $935 বার্ষিক): ফুল Next.js প্ল্যাটফর্ম + অমনিচ্যানেল অ্যাডস + ২৪/৭ AI অটোনোমাস এজেন্টস।\n` +
      `4. Enterprise Titan (কাস্টম স্কোপ): ডেডিকেটেড স্কোয়াড, প্রাইভেট স্ল্যাক এবং ফুল আইপি হ্যান্ডওভার।\n\n` +
      `আপনার প্রজেক্টের সঠিক খরচের জন্য সাব্বিরের সাথে সরাসরি হোয়াটসঅ্যাপে (+880 1941-130981) কথা বলতে পারেন!`
    );
  }

  // Digital Marketing / Ads
  if (q.includes("marketing") || q.includes("ads") || q.includes("meta") || q.includes("facebook") || q.includes("google") || q.includes("মার্কেটিং") || q.includes("বিজ্ঞাপন")) {
    return (
      `DevDigital পেইড অ্যাকুইজিশনে প্রমাণিত রেজাল্ট ডেলিভার করে:\n\n` +
      `• Meta (Facebook & Instagram) ও Google Ads হাই-ROAS স্কেলিং (৩.২x থেকে ৫.৪x গড় ROAS)।\n` +
      `• Server-Side Meta CAPI: iOS ১৪+ ট্র্যাকিং লস বাইপাস করে ৯৯% ইভেন্ট ম্যাচ রেট নিশ্চিত করে।\n` +
      `• হাই-কনভার্টিং ল্যান্ডিং পেজ অপটিমাইজেশন (CRO) যা অ্যাড স্পেন্ড অপচয় রোধ করে।\n\n` +
      `আপনার ক্যাম্পেইন অডিটের জন্য সাব্বিরকে হোয়াটসঅ্যাপে মেসেজ দিন (+880 1941-130981)।`
    );
  }

  // Web Development / Tech
  if (q.includes("web") || q.includes("next") || q.includes("react") || q.includes("site") || q.includes("ওয়েবসাইট") || q.includes("ডেভেলপমেন্ট")) {
    return (
      `DevDigital-এর ওয়েব আর্কিটেকচার:\n\n` +
      `• টেক স্ট্যাক: Next.js 14/15, React, TypeScript, Tailwind CSS, Supabase (PostgreSQL)।\n` +
      `• পারফরম্যান্স: সাব-সেকেন্ড পেজ লোড এবং Google Lighthouse 99+ স্কোর।\n` +
      `• ১০০% সোর্স কোড ও আইপি ওনারশিপ পুরোপুরি আপনার নামে হ্যান্ডওভার করা হয়।\n\n` +
      `আপনার ওয়েবসাইট নিয়ে আলোচনা করতে ওয়েবসাইটে "Book a Meeting" শিডিউল করুন অথবা হোয়াটসঅ্যাপে জানান।`
    );
  }

  // AI & Automation
  if (q.includes("ai") || q.includes("automation") || q.includes("agent") || q.includes("n8n") || q.includes("রোবট") || q.includes("অটোমেশন")) {
    return (
      `DevDigital AI অটোমেশন সিস্টেম:\n\n` +
      `• n8n এবং Python এজেন্টের মাধ্যমে লিড ক্যাপচার, স্ক্রিনিং ও অটোমেটিক CRM-এ রাউটিং।\n` +
      `• ২৪/৭ ইন্টেলিজেন্ট হোয়াটসঅ্যাপ ও ওয়েব চ্যাটবট অ্যাসিস্ট্যান্ট।\n` +
      `• প্রতি সপ্তাহে বিজনেস ওনারদের ২০+ কর্মঘণ্টা বাঁচিয়ে দেয়।\n\n` +
      `আপনার বিজনেসে AI ইন্টিগ্রেট করতে সাব্বিরের সাথে ফ্রি কনসাল্টেশন বুক করুন!`
    );
  }

  // General Default Response
  return (
    `আমি Sabbir AI (DevDigital-এর ইন্টেলিজেন্ট অ্যাসিস্ট্যান্ট)।\n\n` +
    `সাব্বির এবং DevDigital নিম্নলিখিত বিষয়ে বিশেষজ্ঞ:\n` +
    `1. Digital Marketing: Meta ও Google Ads স্কেলিং (গড় 3.2x-5.4x ROAS) এবং 99% CAPI ট্র্যাকিং।\n` +
    `2. Web Development: দ্রুতগতির Next.js 14/15, React ও Supabase প্ল্যাটফর্ম।\n` +
    `3. AI Automations: n8n ও পাইথন দিয়ে ২৪/৭ স্বয়ংক্রিয় বিজনেস পাইপলাইন।\n\n` +
    `সরাসরি সাব্বিরের সাথে পরামর্শ করতে হোয়াটসঅ্যাপে যুক্ত হন: +880 1941-130981 অথবা সাইটে ফ্রি স্ট্র্যাটেজি কল বুক করুন!`
  );
}
