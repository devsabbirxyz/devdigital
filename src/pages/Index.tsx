import { lazy, Suspense } from "react";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/sections/Hero";
import Seo from "@/components/Seo";

// Below-the-fold sections are code-split for faster initial paint
const About = lazy(() => import("@/components/sections/About"));
const Stats = lazy(() => import("@/components/sections/Stats"));
const Services = lazy(() => import("@/components/sections/Services"));
const Projects = lazy(() => import("@/components/sections/Projects"));
const Testimonials = lazy(() => import("@/components/sections/Testimonials"));
const Pricing = lazy(() => import("@/components/sections/Pricing"));
const Contact = lazy(() => import("@/components/sections/Contact"));
const Blog = lazy(() => import("@/components/sections/Blog"));
const Footer = lazy(() => import("@/components/sections/Footer"));
const WhatsAppButton = lazy(() => import("@/components/site/WhatsAppButton"));
const IntroVideoModal = lazy(() => import("@/components/site/IntroVideoModal"));

const Index = () => {
  return (
    <main className="relative min-h-screen">
      <Seo
        path="/"
        defaultTitle="Your All Solution Is Here — DevDigital"
        defaultDescription="Premium web development, UI/UX design and AI automation services by Sabbir."
      />
      <Navbar />
      <Hero />
      <Suspense fallback={<div className="h-32" />}>
        <About />
        <Stats />
        <Services />
        <Projects />
        <Pricing />
        <Testimonials />
        <Contact />
        <Blog />
        <Footer />
        <WhatsAppButton />
        <IntroVideoModal />
      </Suspense>
    </main>
  );
};

export default Index;
