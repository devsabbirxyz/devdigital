import { useEffect } from "react";
import Navbar from "@/components/site/Navbar";
import Footer from "@/components/sections/Footer";
import Projects from "@/components/sections/Projects";
import WhatsAppButton from "@/components/site/WhatsAppButton";

export default function AllProjects() {
  useEffect(() => {
    document.title = "Projects — Portfolio";
  }, []);
  return (
    <main className="relative min-h-screen">
      <Navbar />
      <div className="pt-32 pb-12 container">
        <h1 className="font-display text-5xl md:text-6xl font-bold text-center">
          All <span className="text-gradient">Projects</span>
        </h1>
        <p className="text-center text-muted-foreground mt-4 max-w-xl mx-auto">
          A collection of work across design, development, and AI automation.
        </p>
      </div>
      <Projects all />
      <Footer />
      <WhatsAppButton />
    </main>
  );
}
