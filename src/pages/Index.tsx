import { lazy, Suspense } from "react";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/sections/Hero";
import Seo from "@/components/Seo";
import ErrorBoundary from "@/components/ui/ErrorBoundary";

import ScrollProgress from "@/components/site/ScrollProgress";
import BrandMarquee from "@/components/sections/BrandMarquee";

// Below-the-fold sections are code-split for faster initial paint
const About = lazy(() => import("@/components/sections/About"));
const Services = lazy(() => import("@/components/sections/Services"));
const Projects = lazy(() => import("@/components/sections/Projects"));
const RoiCalculator = lazy(() => import("@/components/sections/RoiCalculator"));
const Process = lazy(() => import("@/components/sections/Process"));
const Pricing = lazy(() => import("@/components/sections/Pricing"));
const Testimonials = lazy(() => import("@/components/sections/Testimonials"));
const Blog = lazy(() => import("@/components/sections/Blog"));
const FAQ = lazy(() => import("@/components/sections/FAQ"));
const Contact = lazy(() => import("@/components/sections/Contact"));
const Footer = lazy(() => import("@/components/sections/Footer"));
const WhatsAppButton = lazy(() => import("@/components/site/WhatsAppButton"));
const IntroVideoModal = lazy(() => import("@/components/site/IntroVideoModal"));

const Index = () => {
  return (
    <main className="relative min-h-screen w-full max-w-full overflow-x-hidden">
      <ScrollProgress />
      <Seo
        path="/"
        defaultTitle="Your All Solution Is Here — DevDigital"
        defaultDescription="Premium web development, UI/UX design and AI automation services by Sabbir."
      />
      <Navbar />
      <Hero />
      <BrandMarquee />
      <ErrorBoundary name="HomepageSections">
        {/* Progressive reveal: each section loads independently without blocking others */}
        <Suspense fallback={<div className="h-24 w-full" aria-hidden="true" />}><About /></Suspense>
        <Suspense fallback={<div className="h-24 w-full" aria-hidden="true" />}><Services /></Suspense>
        <Suspense fallback={<div className="h-24 w-full" aria-hidden="true" />}><RoiCalculator /></Suspense>
        <Suspense fallback={<div className="h-24 w-full" aria-hidden="true" />}><Projects /></Suspense>
        <Suspense fallback={<div className="h-24 w-full" aria-hidden="true" />}><Process /></Suspense>
        <Suspense fallback={<div className="h-24 w-full" aria-hidden="true" />}><Pricing /></Suspense>
        <Suspense fallback={<div className="h-24 w-full" aria-hidden="true" />}><Testimonials /></Suspense>
        <Suspense fallback={<div className="h-24 w-full" aria-hidden="true" />}><Blog /></Suspense>
        <Suspense fallback={<div className="h-24 w-full" aria-hidden="true" />}><FAQ /></Suspense>
        <Suspense fallback={<div className="h-24 w-full" aria-hidden="true" />}><Contact /></Suspense>
        <Suspense fallback={null}><Footer /></Suspense>
        <Suspense fallback={null}><WhatsAppButton /></Suspense>
        <Suspense fallback={null}><IntroVideoModal /></Suspense>
      </ErrorBoundary>
    </main>
  );
};

export default Index;
