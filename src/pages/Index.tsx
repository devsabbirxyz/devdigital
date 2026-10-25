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
        <Suspense fallback={<div className="h-32" />}>
          <About />
          <Services />
          <RoiCalculator />
          <Projects />
          <Process />
          <Pricing />
          <Testimonials />
          <Blog />
          <FAQ />
          <Contact />
          <Footer />
          <WhatsAppButton />
          <IntroVideoModal />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
};

export default Index;
