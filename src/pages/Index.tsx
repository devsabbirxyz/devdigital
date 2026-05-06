import { useEffect } from "react";
import Navbar from "@/components/site/Navbar";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import Services from "@/components/sections/Services";
import Projects from "@/components/sections/Projects";
import Pricing from "@/components/sections/Pricing";
import Contact from "@/components/sections/Contact";
import Blog from "@/components/sections/Blog";
import Footer from "@/components/sections/Footer";
import WhatsAppButton from "@/components/site/WhatsAppButton";
import IntroVideoModal from "@/components/site/IntroVideoModal";

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
      <About />
      <Services />
      <Projects />
      <Pricing />
      <Contact />
      <Blog />
      <Footer />
      <WhatsAppButton />
      <IntroVideoModal />
    </main>
  );
};

export default Index;
