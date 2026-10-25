/**
 * PART 8 — CONTENT
 * Single source of truth for all Services content across sections.
 * Editable via Admin Panel with live Supabase persistence.
 */

export const services = [
  {
    id: "digital-marketing",
    index: "01",
    introTitle: "Welcome to Digital Marketing",
    heading: "WHAT I DO",
    subheading: "Digital Marketing",
    accent: "pink",
    items: [
      {
        id: "seo",
        number: 1,
        title: "SEO",
        short: "Rank higher on Google and win customers who are already searching.",
        image: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=800&q=80",
        details: {
          valueLine: "Capture high-intent buyers exactly when they search for your solutions.",
          overview: [
            "Full-spectrum search engine optimization covering technical architecture, semantic keyword targeting, and backlink authority.",
            "Engineered to dominate competitive SERPs, increase qualified organic inbound leads, and dramatically reduce customer acquisition costs."
          ],
          deliverables: [
            "Comprehensive technical audit & Core Web Vitals remediation",
            "High-intent keyword cluster mapping & content roadmap",
            "On-page metadata, schema markup & internal link optimization",
            "White-hat authority link building & digital PR outreach",
            "Monthly search rankings, organic conversions & ROI reporting"
          ],
          process: [
            { step: "Audit", text: "Deep crawl analysis of site indexation, crawl errors, schema, and competitor keyword gaps." },
            { step: "Strategy", text: "Build high-intent search topic clusters and keyword prioritization roadmap." },
            { step: "On-Page", text: "Optimize semantic headers, structured data, page speed, and conversion copywriting." },
            { step: "Authority", text: "Acquire contextual backlinks, brand mentions, and continuous keyword rank tracking." }
          ],
          tools: ["Ahrefs", "Google Search Console", "Semrush", "Screaming Frog", "SurferSEO"],
          stats: [
            { value: 180, suffix: "%", label: "Average organic traffic growth" },
            { value: 94, suffix: "%", label: "First page keyword placement" }
          ],
          timeline: "4 to 8 weeks for initial rank momentum, 3-6 months for market dominance",
          faq: [
            { q: "How long until I see real ranking results?", a: "Technical and on-page fixes reflect within 3 to 6 weeks. High-volume competitive keywords typically achieve top-3 rankings within 3 to 6 months." },
            { q: "Do you guarantee #1 rankings on Google?", a: "No legitimate SEO can guarantee Google rankings, but our verified data-driven frameworks consistently achieve first-page rankings and measurable revenue growth." }
          ],
          cta: { label: "Start this project", href: "https://wa.me/8801700000000?text=Hi,%20I%20want%20to%20rank%20my%20business%20on%20Google%20with%20SEO." }
        }
      },
      {
        id: "smm",
        number: 2,
        title: "Social Media Marketing",
        short: "Content and campaigns that build a loyal audience on Facebook, Instagram and TikTok.",
        image: "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80",
        details: {
          valueLine: "Transform casual scrollers into fiercely loyal customers and brand advocates.",
          overview: [
            "Strategic content creation, viral short-form video production, and active community engagement across top social channels.",
            "Position your brand as an unmistakable industry authority while driving consistent referral traffic and customer lifetime value."
          ],
          deliverables: [
            "Monthly multi-channel content calendar & visual themes",
            "High-retention Reels, TikToks & YouTube Shorts production",
            "Carousel infographics, static graphics & persuasive captions",
            "Community management, DM engagement & follower growth",
            "Influencer collaboration frameworks & monthly analytics"
          ],
          process: [
            { step: "Research", text: "Analyze competitor creative angles, audience demographics, and viral platform trends." },
            { step: "Production", text: "Script, record, and edit high-retention video content and interactive visual assets." },
            { step: "Publishing", text: "Strategic cross-platform distribution during peak audience activity windows." },
            { step: "Engagement", text: "Active comment moderation, outbound community networking, and lead nurturing." }
          ],
          tools: ["CapCut", "Figma", "Meta Business Suite", "TikTok Ads Manager", "Buffer"],
          stats: [
            { value: 340, suffix: "%", label: "Engagement rate lift" },
            { value: 2, suffix: "M+", label: "Targeted organic video views" }
          ],
          timeline: "Ongoing monthly growth; first viral traction within 14 to 21 days",
          faq: [
            { q: "Do you handle shooting video or just editing?", a: "We provide complete video editing, hook writing, sound design, and captioning. We can also coordinate direct recording guidelines." },
            { q: "Which platforms should my brand focus on?", a: "We prioritize Facebook and Instagram for consumer brands, TikTok for viral impulse purchases, and LinkedIn for B2B services." }
          ],
          cta: { label: "Start this project", href: "https://wa.me/8801700000000?text=Hi,%20I%20want%20to%20scale%20my%20Social%20Media%20presence." }
        }
      },
      {
        id: "meta-google-ads",
        number: 3,
        title: "Meta & Google Ads",
        short: "Targeted paid campaigns that turn every taka/dollar into measurable leads.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        details: {
          valueLine: "Predictable, scalable customer acquisition with verified return on ad spend.",
          overview: [
            "High-converting media buying across Facebook, Instagram, Google Search, YouTube, and Performance Max.",
            "Laser-focused audience targeting combined with psychological direct-response creative frameworks."
          ],
          deliverables: [
            "Full conversion API (CAPI) & Google Enhanced Tracking setup",
            "High-converting ad creatives: statics, UGC videos & sales copy",
            "Search keyword bidding, negative keyword siloing & PMax campaigns",
            "Dynamic retargeting funnels to recapture abandoned carts",
            "Weekly live ROAS tracking dashboard & transparent budget management"
          ],
          process: [
            { step: "Pixel Setup", text: "Configure server-side tracking, custom conversions, and attribution windows." },
            { step: "Creative Testing", text: "Launch 10+ hook and angle variations to identify breakout winners rapidly." },
            { step: "Scale", text: "Increase budget on winning ads horizontally and vertically while protecting ROAS." },
            { step: "Retargeting", text: "Deploy personalized dynamic retargeting to maximize customer lifetime value." }
          ],
          tools: ["Meta Ads Manager", "Google Ads", "Triple Whale", "Canva Pro", "Google Tag Manager"],
          stats: [
            { value: 4, suffix: ".8X", label: "Average verified ROAS" },
            { value: 65, suffix: "%", label: "Reduction in Cost Per Acquisition" }
          ],
          timeline: "Campaign launch in 5 to 7 days; preliminary optimization in 14 days",
          faq: [
            { q: "What is the minimum recommended budget for paid ads?", a: "We suggest at least $500 - $1,000 monthly ad spend so algorithms have sufficient conversion data to optimize efficiently." },
            { q: "How do you avoid ad fatigue and rising CPAs?", a: "We maintain a relentless creative refresh pipeline, introducing fresh angles and UGC formats every week to keep audience engagement high." }
          ],
          cta: { label: "Start this project", href: "https://wa.me/8801700000000?text=Hi,%20I%20want%20to%20run%20high-ROAS%20Meta%20and%20Google%20Ads." }
        }
      },
      {
        id: "content-branding",
        number: 4,
        title: "Content & Branding",
        short: "A consistent brand voice, visuals and content that people remember.",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=800&q=80",
        details: {
          valueLine: "Build an iconic brand identity that commands premium pricing.",
          overview: [
            "Comprehensive brand strategy, visual guidelines, persuasive brand storytelling, and strategic editorial content.",
            "Move away from competing on price by crafting an unmistakable luxury brand perception that commands loyalty."
          ],
          deliverables: [
            "Brand identity guidelines: color palette, typography & voice tokens",
            "Logo suite, stationery, packaging & social media kits",
            "Brand narrative, mission messaging & positioning statements",
            "Thought-leadership articles & SEO authority blog content",
            "Lead magnets, whitepapers & presentation deck templates"
          ],
          process: [
            { step: "Discovery", text: "Uncover your unique value proposition, ideal customer persona, and brand core." },
            { step: "Visual Identity", text: "Design modern design systems, color harmonies, logos, and typography suites." },
            { step: "Voice Guidelines", text: "Codify tone, terminology, copywriting principles, and customer promises." },
            { step: "Asset Rollout", text: "Deliver high-resolution brand assets across digital and physical touchpoints." }
          ],
          tools: ["Figma", "Adobe Illustrator", "Notion", "Grammarly", "Midjourney"],
          stats: [
            { value: 250, suffix: "%", label: "Brand recall rate improvement" },
            { value: 40, suffix: "%", label: "Higher premium pricing leverage" }
          ],
          timeline: "2 to 3 weeks for complete brand kit delivery",
          faq: [
            { q: "Do you provide source files with the branding kit?", a: "Yes, you receive full vector source files (Figma, SVG, EPS, AI), high-res exports, and complete brand guidelines in PDF." },
            { q: "Can you rebrand an existing legacy business?", a: "Yes, we specialize in modernizing legacy brands to look world-class while preserving existing trust and recognition." }
          ],
          cta: { label: "Start this project", href: "https://wa.me/8801700000000?text=Hi,%20I%20want%20to%20build%20a%20standout%20Brand%20and%20Content%20system." }
        }
      },
      {
        id: "analytics-reporting",
        number: 5,
        title: "Analytics & Reporting",
        short: "Clear dashboards that show what works, so we scale only the winners.",
        image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
        details: {
          valueLine: "Turn raw data into high-conviction business scaling decisions.",
          overview: [
            "Full-funnel attribution tracking, Google Analytics 4 configuration, and custom executive KPI dashboards.",
            "Eliminate guesswork by knowing exactly which channels and campaigns generate your highest profit margins."
          ],
          deliverables: [
            "Server-side GA4, Meta Pixel & TikTok Events tracking",
            "Custom real-time Google Looker Studio executive dashboard",
            "UTM attribution hierarchy & conversion goal setup",
            "Customer lifetime value (LTV) and churn rate cohorts",
            "Weekly executive performance breakdown with actionable takeaways"
          ],
          process: [
            { step: "Tracking Audit", text: "Identify broken tags, duplicate events, and attribution discrepancies." },
            { step: "Instrumentation", text: "Deploy Google Tag Manager triggers for clicks, purchases, and form leads." },
            { step: "Dashboard Build", text: "Connect live data sources into visual, easy-to-digest executive portals." },
            { step: "Review Routine", text: "Weekly walkthrough meetings highlighting winners to scale and losers to cut." }
          ],
          tools: ["Google Analytics 4", "Looker Studio", "Google Tag Manager", "Mixpanel", "Stripe Dashboard"],
          stats: [
            { value: 100, suffix: "%", label: "Data tracking accuracy" },
            { value: 35, suffix: "%", label: "Wasted ad spend eliminated" }
          ],
          timeline: "Setup within 3 to 5 business days",
          faq: [
            { q: "Why do I need server-side tracking?", a: "Browser ad-blockers and iOS privacy updates block up to 30% of browser events. Server-side tracking captures 99%+ of true conversions." },
            { q: "Will I need technical knowledge to view the reports?", a: "No, our Looker Studio dashboards are built for founders: high-level metrics at a glance with clean visuals and clear summaries." }
          ],
          cta: { label: "Start this project", href: "https://wa.me/8801700000000?text=Hi,%20I%20need%20custom%20Analytics%20and%20Tracking%20dashboards." }
        }
      },
      {
        id: "email-retention",
        number: 6,
        title: "Email & Retention Funnels",
        short: "Automated lifecycle emails and SMS that turn one-time buyers into repeat customers.",
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=800&q=80",
        details: {
          valueLine: "Unlock predictable recurring revenue from your existing customer database.",
          overview: [
            "Bespoke email and SMS automation flows built on Klaviyo, Mailchimp, and ActiveCampaign.",
            "Segmented messaging designed to recover lost checkout carts, drive repeat orders, and maximize lifetime customer value (LTV)."
          ],
          deliverables: [
            "Welcome onboarding series & educational indoctrination drip",
            "Abandoned checkout & browse abandonment recovery triggers",
            "Post-purchase thank you, cross-sell & VIP rewards sequences",
            "Dynamic audience segmentation based on RFM customer scoring",
            "Monthly promotional campaigns & Deliverability health monitoring"
          ],
          process: [
            { step: "Audit & Deliverability", text: "Fix DKIM, SPF, and DMARC DNS records to ensure primary inbox delivery." },
            { step: "Flow Blueprints", text: "Write high-converting, personalized copy and design branded email templates." },
            { step: "Trigger Integration", text: "Connect webhooks from Shopify, WooCommerce, or custom databases." },
            { step: "A/B Testing", text: "Continuously optimize subject lines, send times, and discount incentives." }
          ],
          tools: ["Klaviyo", "ActiveCampaign", "Postmark", "Twilio SMS", "Mailchimp"],
          stats: [
            { value: 42, suffix: "%", label: "Average email open rate" },
            { value: 38, suffix: "%", label: "Increase in customer repeat orders" }
          ],
          timeline: "Complete flow launch in 7 to 10 business days",
          faq: [
            { q: "How much revenue should email marketing generate?", a: "Healthy direct-to-consumer and SaaS brands typically generate 25% to 40% of their total monthly revenue from automated email flows." },
            { q: "Can you help with low deliverability or spam folder issues?", a: "Yes, our technical deliverability audit cleans unengaged contacts and configures custom sender domains to restore inbox reputation." }
          ],
          cta: { label: "Start this project", href: "https://wa.me/8801700000000?text=Hi,%20I%20want%20to%20build%20Email%20and%20Retention%20Funnels." }
        }
      }
    ]
  },
  {
    id: "web-development",
    index: "02",
    introTitle: "Welcome to Web Development",
    heading: "WHAT I DO",
    subheading: "Web Development",
    accent: "teal",
    items: [
      {
        id: "business-websites",
        number: 1,
        title: "Business Websites",
        short: "Fast, modern, mobile-first websites that make your business look world-class.",
        image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
        details: {
          valueLine: "Establish undeniable credibility and convert visitors into qualified appointments.",
          overview: [
            "Bespoke company websites engineered with modern React/Next.js, dark luxury aesthetics, and 60fps animations.",
            "Optimized for 95+ Google PageSpeed scores, seamless mobile navigation, and effortless lead capture."
          ],
          deliverables: [
            "Custom Figma UI/UX design matching your brand aesthetics",
            "Fully responsive development (Mobile, Tablet, Desktop, Ultra-wide)",
            "Lightning-fast performance (sub-second load times & 95+ Lighthouse)",
            "SEO-ready semantic HTML, meta tags, and automated sitemaps",
            "Interactive contact forms with WhatsApp and email automation"
          ],
          process: [
            { step: "Wireframing", text: "Plan information architecture, user journeys, and conversion CTA placements." },
            { step: "Visual Design", text: "Design high-fidelity Figma mockups with dark/light themes and modern typography." },
            { step: "Development", text: "Code clean, maintainable components with TypeScript, TailwindCSS, and Framer Motion." },
            { step: "Deployment", text: "Connect custom domain, configure SSL, perform cross-browser QA, and go live." }
          ],
          tools: ["React", "Next.js", "TypeScript", "TailwindCSS", "Framer Motion", "Vercel"],
          stats: [
            { value: 99, suffix: "/100", label: "Google PageSpeed performance" },
            { value: 3, suffix: "X", label: "Higher visitor-to-lead conversion" }
          ],
          timeline: "7 to 14 business days",
          faq: [
            { q: "Can I edit content easily without coding?", a: "Yes, we integrate an intuitive admin panel so you can update text, images, pricing, and services anytime." },
            { q: "Is hosting and domain setup included?", a: "We handle complete deployment on high-speed global CDNs (Vercel/Cloudflare) and connect your custom domain for free." }
          ],
          cta: { label: "Start this project", href: "https://wa.me/8801700000000?text=Hi,%20I%20want%20to%20build%20a%20modern%20Business%20Website." }
        }
      },
      {
        id: "ecommerce-stores",
        number: 2,
        title: "E-commerce Stores",
        short: "Online stores with local payment methods (bKash, Nagad), inventory and order tracking.",
        image: "https://images.unsplash.com/photo-1556742049-0a67c5574f73?auto=format&fit=crop&w=800&q=80",
        details: {
          valueLine: "Frictionless checkout experiences that maximize average order value and repeat sales.",
          overview: [
            "High-performance e-commerce stores equipped with local and international payment gateways, stock management, and automated shipping workflows.",
            "Engineered for high conversion rates with one-click checkouts and abandoned cart recovery."
          ],
          deliverables: [
            "Complete product catalog with filters, variants & instant search",
            "Local payment gateway integration: bKash, Nagad, Rocket, Cards & COD",
            "International gateways: Stripe, PayPal & SSLCommerz",
            "Automated customer SMS/Email order status notifications",
            "Admin inventory dashboard, coupon system & sales analytics"
          ],
          process: [
            { step: "Catalog Architecture", text: "Structure categories, attributes, variations, and shipping rate matrices." },
            { step: "Storefront UX", text: "Design friction-free product pages, sticky cart drawers, and rapid checkout flows." },
            { step: "Payment & API", text: "Securely link payment gateways, webhooks, and SMS dispatch providers." },
            { step: "Stress Testing", text: "Simulate test orders, checkout failures, and mobile payment redirections." }
          ],
          tools: ["Shopify", "WooCommerce", "Next.js Commerce", "SSLCommerz", "bKash API", "Stripe"],
          stats: [
            { value: 48, suffix: "%", label: "Cart abandonment reduction" },
            { value: 2, suffix: ".4s", label: "Average checkout completion speed" }
          ],
          timeline: "2 to 3 weeks",
          faq: [
            { q: "Can customers pay directly via bKash or Nagad?", a: "Yes! We integrate automated bKash/Nagad merchant gateways with instant verification and SMS confirmations." },
            { q: "Can I manage orders on my mobile phone?", a: "Yes, you get a clean mobile-friendly admin panel and real-time alerts whenever a customer places an order." }
          ],
          cta: { label: "Start this project", href: "https://wa.me/8801700000000?text=Hi,%20I%20want%20to%20build%20an%20E-commerce%20Store%20with%20bKash%20and%20cards." }
        }
      },
      {
        id: "web-apps-saas",
        number: 3,
        title: "Web Apps & SaaS",
        short: "Custom dashboards, marketplaces and platforms built to scale.",
        image: "https://images.unsplash.com/photo-1551434678-e076c223a692?auto=format&fit=crop&w=800&q=80",
        details: {
          valueLine: "Robust, scalable cloud applications engineered for thousands of concurrent users.",
          overview: [
            "Full-stack custom software development utilizing modern React architectures, Supabase PostgreSQL, and enterprise auth.",
            "From SaaS MVPs to internal management ERPs, built with strict security, real-time sync, and clean code."
          ],
          deliverables: [
            "Role-based authentication (Admin, Manager, Member) & permissions",
            "Relational PostgreSQL database architecture with row-level security",
            "Real-time subscriptions, live data tables & CSV/PDF export",
            "Stripe/Paddle recurring subscription billing & credit system",
            "REST/GraphQL APIs and automated third-party webhook endpoints"
          ],
          process: [
            { step: "System Architecture", text: "Design entity-relationship diagrams, API contracts, and user role schemas." },
            { step: "Frontend Portal", text: "Build responsive, high-performance UI components with Shadcn and Tailwind." },
            { step: "Backend & Database", text: "Develop Supabase edge functions, database triggers, and security policies." },
            { step: "QA & Hardening", text: "Perform penetration testing, SQL injection guards, and load benchmarking." }
          ],
          tools: ["React", "TypeScript", "Supabase", "PostgreSQL", "Node.js", "Docker", "Stripe API"],
          stats: [
            { value: 99, suffix: ".9%", label: "Platform uptime reliability" },
            { value: 60, suffix: "ms", label: "Average database query latency" }
          ],
          timeline: "3 to 6 weeks depending on feature scope",
          faq: [
            { q: "Is the codebase scalable for future developers?", a: "Yes, we adhere to strict TypeScript typings, modular folder structures, and comprehensive documentation for easy handoffs." },
            { q: "How is user data kept secure?", a: "We enforce PostgreSQL Row Level Security (RLS), encrypted sessions, SSL everywhere, and strict CORS policies." }
          ],
          cta: { label: "Start this project", href: "https://wa.me/8801700000000?text=Hi,%20I%20want%20to%20build%20a%20custom%20Web%20App%20or%20SaaS." }
        }
      },
      {
        id: "uiux-landing-pages",
        number: 4,
        title: "UI/UX & Landing Pages",
        short: "Conversion-focused design that guides visitors to take action.",
        image: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
        details: {
          valueLine: "Mesmerizing visual design engineered with psychological direct-response frameworks.",
          overview: [
            "Conversion rate optimized landing pages designed to skyrocket lead generation and product sales.",
            "Combines aesthetic dark glassmorphism, punchy typography, interactive 3D components, and clear calls-to-action."
          ],
          deliverables: [
            "Figma interactive prototype with desktop and mobile states",
            "High-converting landing page copywriting and structural wireframes",
            "Custom micro-animations, interactive pricing toggles & sticky CTAs",
            "A/B split testing configuration for headlines and offer variants",
            "Lead capture forms connected to your CRM or WhatsApp immediately"
          ],
          process: [
            { step: "Audience Psychology", text: "Study buyer objections, trust barriers, and high-converting competitor hooks." },
            { step: "Copy & Wireframe", text: "Draft conversion-first headline hierarchies, benefit stacks, and proof sections." },
            { step: "High-Fidelity Design", text: "Create stunning visuals, 3D elements, glass badges, and glowing accents." },
            { step: "Speed Coding", text: "Develop pixel-perfect page with sub-second loading speeds on all devices." }
          ],
          tools: ["Figma", "Framer Motion", "TailwindCSS", "Lucide Icons", "Hotjar"],
          stats: [
            { value: 24, suffix: ".6%", label: "Average landing page conversion rate" },
            { value: 350, suffix: "+", label: "Delivered conversion landing pages" }
          ],
          timeline: "5 to 7 business days",
          faq: [
            { q: "Do you provide copywriting or do I have to write it?", a: "We provide complete conversion copywriting including headlines, value propositions, FAQs, and compelling calls-to-action." },
            { q: "Can this landing page integrate with our Facebook/Google Ads?", a: "Yes, we install pixels, custom conversion events, and UTM parameters so every ad click is tracked with pinpoint accuracy." }
          ],
          cta: { label: "Start this project", href: "https://wa.me/8801700000000?text=Hi,%20I%20want%20a%20high-converting%20Landing%20Page." }
        }
      },
      {
        id: "maintenance-performance",
        number: 5,
        title: "Maintenance & Performance",
        short: "Speed, security, SEO fixes and ongoing support after launch.",
        image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
        details: {
          valueLine: "Zero downtime, 24/7 peace of mind, and continuous performance optimization.",
          overview: [
            "Comprehensive technical care for your web assets including real-time monitoring, security hardening, automated backups, and instant fixes.",
            "Never lose sleep over a broken checkout, slow loading speed, or unexpected plugin conflict."
          ],
          deliverables: [
            "24/7 uptime monitoring & instant downtime alert system",
            "Weekly automated offsite database and file backups",
            "Core Web Vitals monitoring and continuous speed optimization",
            "Security audits, vulnerability patches, malware scans & SSL renewals",
            "Priority developer support for on-demand content and banner updates"
          ],
          process: [
            { step: "Health Audit", text: "Benchmark current speed metrics, security vulnerabilities, and broken links." },
            { step: "Hardening", text: "Apply security headers, firewalls, image compression, and cache rules." },
            { step: "Automated Watch", text: "Configure 60-second heartbeat ping monitors and error reporting webhooks." },
            { step: "Ongoing Care", text: "Perform routine code updates, content modifications, and monthly health reports." }
          ],
          tools: ["Cloudflare", "UptimeRobot", "Sentry", "Google Lighthouse", "GitHub Actions"],
          stats: [
            { value: 99, suffix: ".99%", label: "Uptime guarantee" },
            { value: 15, suffix: "min", label: "Average emergency response time" }
          ],
          timeline: "Immediate ongoing monthly coverage",
          faq: [
            { q: "What happens if our website goes down at night?", a: "Our automated monitoring pings your site every 60 seconds. In case of downtime, an engineer is alerted immediately to restore service." },
            { q: "Are small content updates included in maintenance?", a: "Yes, all our maintenance tiers include monthly developer hours for text updates, banners, pricing adjustments, and new products." }
          ],
          cta: { label: "Start this project", href: "https://wa.me/8801700000000?text=Hi,%20I%20want%20reliable%20Website%20Maintenance%20and%20Speed%20Support." }
        }
      },
      {
        id: "cloud-api-architecture",
        number: 6,
        title: "Cloud & API Architecture",
        short: "Scalable backend APIs, database design, and serverless architectures engineered for speed.",
        image: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
        details: {
          valueLine: "Bulletproof data pipelines and cloud infrastructure built to handle millions of requests.",
          overview: [
            "Robust relational and NoSQL database modeling with PostgreSQL, Supabase, and Redis edge caching.",
            "Secure REST and GraphQL endpoints equipped with JWT authentication, rate limiting, and automated backups."
          ],
          deliverables: [
            "PostgreSQL database schema design & row-level security (RLS)",
            "Edge functions & serverless API endpoints (Supabase / Cloudflare)",
            "Third-party integrations: Stripe, Twilio, OpenAI, Resend",
            "Real-time WebSocket data subscriptions & live updates",
            "Comprehensive Swagger/Postman API documentation"
          ],
          process: [
            { step: "Schema Modeling", text: "Architect normalized relational tables, indexing, and foreign constraints." },
            { step: "Security Rules", text: "Implement row-level security policies to prevent unauthorized data access." },
            { step: "API Implementation", text: "Build high-throughput edge functions and automated validation middleware." },
            { step: "Load Benchmarking", text: "Stress test endpoint latency under simulated high-concurrency traffic." }
          ],
          tools: ["Supabase", "PostgreSQL", "Cloudflare Workers", "Docker", "Redis"],
          stats: [
            { value: 45, suffix: "ms", label: "Average global API response time" },
            { value: 100, suffix: "%", label: "Data security compliance" }
          ],
          timeline: "5 to 10 business days",
          faq: [
            { q: "Can this integrate with our mobile apps?", a: "Yes, our backend APIs provide standard JSON REST endpoints compatible with iOS, Android, and Flutter applications." },
            { q: "Is Supabase scalable for enterprise workloads?", a: "Absolutely. Supabase is built on production PostgreSQL and scales automatically to millions of active monthly users." }
          ],
          cta: { label: "Start this project", href: "https://wa.me/8801700000000?text=Hi,%20I%20need%20scalable%20Cloud%20and%20API%20Architecture." }
        }
      }
    ]
  },
  {
    id: "ai-automation",
    index: "03",
    introTitle: "Welcome to AI Automation",
    heading: "WHAT I DO",
    subheading: "AI Automation",
    accent: "purple",
    items: [
      {
        id: "ai-chatbots",
        number: 1,
        title: "AI Chatbots & Agents",
        short: "Custom GPT and Claude-powered agents trained on your proprietary data that answer, qualify, and book clients 24/7.",
        image: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
        details: {
          valueLine: "Autonomous 24/7 client engagement that qualifies leads and books appointments while you sleep.",
          overview: [
            "Bespoke intelligent assistant systems connected to your knowledge base, CRM, and calendar.",
            "Engineered with strict guardrails to represent your brand voice accurately with zero hallucinations."
          ],
          deliverables: [
            "Vector database RAG pipeline trained on company documents & FAQs",
            "Multi-channel deployment: Website widget, WhatsApp, Messenger & Slack",
            "Human handoff protocols & automated appointment booking workflows",
            "Conversation memory, sentiment detection & lead qualification logic",
            "Real-time conversation logs & analytics dashboard"
          ],
          process: [
            { step: "Knowledge Scrape", text: "Ingest company docs, product catalogues, and previous support tickets." },
            { step: "Prompt Engineering", text: "Define brand tone, objection handling scripts, and guardrail rules." },
            { step: "RAG & Testing", text: "Benchmark retrieval accuracy, latency, and conversation fluidity." },
            { step: "Live Deployment", text: "Integrate widget, webhook triggers, and staff monitoring portal." }
          ],
          tools: ["OpenAI API", "Claude", "LangChain", "Pinecone", "Supabase Vector"],
          stats: [
            { value: 85, suffix: "%", label: "Automated support resolution rate" },
            { value: 3, suffix: "X", label: "Increase in lead capture rate" }
          ],
          timeline: "7 to 10 business days",
          faq: [
            { q: "Will the chatbot hallucinate or give wrong information?", a: "We implement strict RAG (Retrieval-Augmented Generation) grounding and system prompts so the bot strictly answers from your approved source data." },
            { q: "Can the bot book meetings directly on Calendly or Google Calendar?", a: "Yes, our bots natively integrate with Calendly, Cal.com, and Google Calendar to schedule verified appointments in real-time." }
          ],
          cta: { label: "Start this project", href: "https://wa.me/8801700000000?text=Hi,%20I%20want%20to%20build%20an%20AI%20Chatbot." }
        }
      },
      {
        id: "workflow-automation",
        number: 2,
        title: "Workflow & Zapier Automation",
        short: "Automate manual tasks across Make.com, Zapier, and custom webhooks to save 20+ hours every week.",
        image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80",
        details: {
          valueLine: "Eliminate repetitive manual data entry and connect your tools into one cohesive machine.",
          overview: [
            "End-to-end automation pipelines that pass data between your ads, CRM, invoicing, email, and fulfillment tools.",
            "Built with error handling, fallbacks, and real-time alerts."
          ],
          deliverables: [
            "Make.com / Zapier / n8n multi-step scenario architectures",
            "Lead auto-distribution to sales reps with instant SMS/Slack alerts",
            "Automated proposal generation, e-signatures, and contract filing",
            "Stripe / bKash webhook reconciliation with bookkeeping software",
            "Comprehensive workflow documentation & error monitoring"
          ],
          process: [
            { step: "Process Audit", text: "Identify repetitive employee workflows and data bottlenecks." },
            { step: "Architecture", text: "Design visual integration flow with webhook triggers and payload schemas." },
            { step: "Build & Test", text: "Develop multi-branch scenarios with edge-case error handlers." },
            { step: "Handover", text: "Train your team and configure automated monitoring notifications." }
          ],
          tools: ["Make.com", "Zapier", "n8n", "Webhooks", "Postman"],
          stats: [
            { value: 25, suffix: " hrs/wk", label: "Average team time saved" },
            { value: 99, suffix: ".8%", label: "Data sync reliability rate" }
          ],
          timeline: "5 to 8 business days",
          faq: [
            { q: "What tools can you connect together?", a: "We can connect virtually any modern SaaS platform: CRM (HubSpot, Salesforce), Spreadsheets, WhatsApp, Slack, Stripe, Shopify, Google Drive, and custom REST APIs." },
            { q: "What happens if a webhook fails?", a: "All scenarios include automated retry queues and instant notifications to your Slack or email with exact error payloads." }
          ],
          cta: { label: "Start this project", href: "https://wa.me/8801700000000?text=Hi,%20I%20want%20to%20automate%20my%20workflows." }
        }
      },
      {
        id: "lead-scraping-bots",
        number: 3,
        title: "B2B Lead Enrichment & Scraping",
        short: "High-volume targeted B2B lead generation pipelines with verified emails, phones, and decision-maker data.",
        image: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=800&q=80",
        details: {
          valueLine: "Fill your sales pipeline with verified decision-makers on complete autopilot.",
          overview: [
            "Custom web scrapers and data enrichment bots that identify high-probability prospects from directories, LinkedIn, and public registries.",
            "Every email is SMTP-verified to guarantee < 1% bounce rates."
          ],
          deliverables: [
            "Custom Puppeteer / Python crawlers for targeted niche directories",
            "Apollo / LinkedIn Sales Navigator automated extraction & deduplication",
            "Triple-layer email verification (DNS, MX, SMTP handshake)",
            "Automated data enrichment: company revenue, headcount, tech stack",
            "Direct sync into Smartlead, Instantly, or your CRM"
          ],
          process: [
            { step: "Target Profile", text: "Define exact ICP criteria: industry, geometry, titles, and tech stack." },
            { step: "Extractor Engine", text: "Deploy rotating-proxy scrapers with anti-ban protections." },
            { step: "Enrichment", text: "Clean phone numbers, extract verified emails, and verify domains." },
            { step: "Delivery", text: "Export clean CSVs or stream directly into cold email sequences." }
          ],
          tools: ["Python", "Puppeteer", "Apollo.io", "ScrapingBee", "Clearbit"],
          stats: [
            { value: 98, suffix: "%", label: "Email deliverability accuracy" },
            { value: 10, suffix: "k+", label: "Verified leads processed weekly" }
          ],
          timeline: "3 to 5 business days",
          faq: [
            { q: "Are the extracted emails GDPR and CAN-SPAM compliant?", a: "Yes, we exclusively gather publicly available business contact information and clean databases against global suppression lists." },
            { q: "Can this stream directly into Instantly or Smartlead?", a: "Yes, we build automated webhook connectors that load verified leads directly into your active cold outreach campaigns." }
          ],
          cta: { label: "Start this project", href: "https://wa.me/8801700000000?text=Hi,%20I%20want%20targeted%20B2B%20Lead%20Scraping." }
        }
      },
      {
        id: "ai-content-engines",
        number: 4,
        title: "AI Content Generation Engines",
        short: "Programmatic SEO content, product descriptions, and multi-format social copy generated at scale.",
        image: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=800&q=80",
        details: {
          valueLine: "Scale your content output 100x without sacrificing depth, accuracy, or brand voice.",
          overview: [
            "Automated content pipelines that turn keywords and raw ideas into fully researched, SEO-optimized articles, carousels, and landing pages.",
            "Includes human-in-the-loop review workflows."
          ],
          deliverables: [
            "Programmatic SEO pipelines generating hundreds of localized pages",
            "Automated eCommerce product description & feature bullets generators",
            "Repurposing engine: Video to blog, thread, newsletter & infographic script",
            "Custom brand voice fine-tuning & style guide validation checks",
            "CMS auto-publishing integrations (WordPress, Webflow, Strapi)"
          ],
          process: [
            { step: "Voice Model", text: "Calibrate system prompts against your top-performing content pieces." },
            { step: "Outline Engine", text: "Build semantic topic outlines with SERP competitor heading analysis." },
            { step: "Draft & Fact Check", text: "Multi-pass generation with fact verification and link insertion." },
            { step: "CMS Push", text: "Auto-format Markdown and publish to draft or live queue." }
          ],
          tools: ["OpenAI GPT-4o", "Perplexity API", "WordPress REST API", "Webflow CMS", "AirTable"],
          stats: [
            { value: 100, suffix: "+", label: "Articles generated per batch" },
            { value: 80, suffix: "%", label: "Editorial cost reduction" }
          ],
          timeline: "4 to 7 business days",
          faq: [
            { q: "Will Google penalize AI-generated content?", a: "Google rewards high-quality, helpful content regardless of how it is produced. Our multi-pass framework includes humanized structuring and original data." },
            { q: "Does the system format images and headings automatically?", a: "Yes, our pipelines output semantic H2/H3 tags, bold highlights, tables, and auto-generated image placeholders." }
          ],
          cta: { label: "Start this project", href: "https://wa.me/8801700000000?text=Hi,%20I%20want%20Programmatic%20AI%20Content%20generation." }
        }
      },
      {
        id: "crm-pipeline-automation",
        number: 5,
        title: "CRM & Sales Pipeline Automation",
        short: "Smart CRM architectures that automatically route leads, score intent, send follow-ups, and update deals.",
        image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=800&q=80",
        details: {
          valueLine: "Stop losing deals to slow follow-up—close leads within minutes of initial inquiry.",
          overview: [
            "Complete sales pipeline orchestration across HubSpot, GoHighLevel, or custom Supabase backends.",
            "Automated behavioral triggers ensure no prospect slips through the cracks."
          ],
          deliverables: [
            "Speed-to-lead automated response (SMS & Email within 60 seconds)",
            "Predictive lead scoring based on website activity and company size",
            "Multi-stage deal pipelines with automated stage movement triggers",
            "Stale lead reactivation sequences with personalized dynamic tokens",
            "Executive sales conversion rate & rep activity dashboards"
          ],
          process: [
            { step: "Funnel Mapping", text: "Map customer journey from first touch to closed-won invoice." },
            { step: "Trigger Setup", text: "Configure webhooks for form fills, chat starts, and demo requests." },
            { step: "Drip Blueprints", text: "Write high-converting multi-channel follow-up sequences." },
            { step: "Analytics", text: "Create stage-by-stage pipeline velocity and bottleneck dashboards." }
          ],
          tools: ["GoHighLevel", "HubSpot", "Twilio", "ActiveCampaign", "Slack"],
          stats: [
            { value: 4, suffix: "X", label: "Faster average speed-to-lead" },
            { value: 42, suffix: "%", label: "Higher demo attendance rate" }
          ],
          timeline: "5 to 8 business days",
          faq: [
            { q: "Which CRM do you recommend for our business?", a: "For agencies and service businesses, we highly recommend GoHighLevel or HubSpot. For custom web applications, we build lightweight Supabase-driven pipelines." },
            { q: "Can you send SMS and WhatsApp messages automatically?", a: "Yes, using Twilio and Meta WhatsApp Business Cloud API, leads receive immediate confirmation messages and appointment reminders." }
          ],
          cta: { label: "Start this project", href: "https://wa.me/8801700000000?text=Hi,%20I%20want%20Automated%20CRM%20and%20Pipeline%20Workflows." }
        }
      },
      {
        id: "voice-ai-agents",
        number: 6,
        title: "Voice AI & Inbound Call Agents",
        short: "Human-like conversational voice agents that answer calls, schedule appointments, and resolve FAQs 24/7.",
        image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?auto=format&fit=crop&w=800&q=80",
        details: {
          valueLine: "Zero missed customer calls with ultra-low latency conversational AI receptionists.",
          overview: [
            "Deploy voice assistants powered by Vapi, Bland, and OpenAI Realtime API connected directly to your telephony stack.",
            "Answers customer questions, checks database records in real time, and transfers to human staff when necessary."
          ],
          deliverables: [
            "Custom telephony integration with Twilio & local business phone numbers",
            "Sub-500ms conversational voice latency with dynamic interruptions",
            "Real-time Google Calendar and CRM appointment booking logic",
            "Automated call recording, transcription & executive summaries",
            "Live call handoff to human agents when complex support is required"
          ],
          process: [
            { step: "Script Architecture", text: "Write conversational prompts, objection handlers, and guardrails." },
            { step: "Voice Calibration", text: "Select natural vocal timbre, pronunciation, and speech cadence." },
            { step: "Tool Connections", text: "Integrate calendar availability lookups and CRM contact updates." },
            { step: "Test Simulations", text: "Conduct simulated edge-case phone calls to verify fluid dialogue." }
          ],
          tools: ["Vapi", "Bland AI", "Twilio", "OpenAI Realtime", "Make.com"],
          stats: [
            { value: 98, suffix: "%", label: "Reduction in missed phone inquiries" },
            { value: 450, suffix: "ms", label: "Ultra-low conversational latency" }
          ],
          timeline: "5 to 8 business days",
          faq: [
            { q: "Does the voice sound like an unnatural robot?", a: "No, we use state-of-the-art neural voice models (ElevenLabs & Deepgram) that feature natural breathing, pauses, and realistic human tones." },
            { q: "Can it book calls directly into our calendar?", a: "Yes, during the conversation the AI checks real-time slot availability and books the caller directly into Google Calendar or Calendly." }
          ],
          cta: { label: "Start this project", href: "https://wa.me/8801700000000?text=Hi,%20I%20want%20to%20deploy%20Voice%20AI%20Call%20Agents." }
        }
      }
    ]
  }
];
