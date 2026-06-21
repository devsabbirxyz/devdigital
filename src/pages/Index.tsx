import { lazy, Suspense, useEffect } from "react";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/sections/Hero";

// Below-the-fold sections are code-split for faster initial paint
const About = lazy(() => import("@/components/sections/About"));
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
  useEffect(() => {
    document.title = "Portfolio — Premium Digital Experiences";
    const meta = document.querySelector('meta[name="description"]') || (() => {
      const m = document.createElement("meta");
      m.setAttribute("name", "description");
      document.head.appendChild(m);
      return m;
    })();
    meta.setAttribute(
      "content",
      "Premium portfolio showcasing innovative design, web development, and AI-powered automation."
    );
  }, []);

  return (
    <main className="relative min-h-screen">
      <Navbar />
      <Hero />
      <Suspense fallback={<div className="h-32" />}>
        <About />
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
