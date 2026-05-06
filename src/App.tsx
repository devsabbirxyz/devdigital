import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import AllProjects from "./pages/AllProjects.tsx";
import Auth from "./pages/Auth.tsx";
import AdminLayout from "./pages/admin/AdminLayout.tsx";
import Dashboard from "./pages/admin/Dashboard.tsx";
import Navigation from "./pages/admin/Navigation.tsx";
import HeroAdmin from "./pages/admin/HeroAdmin.tsx";
import AboutAdmin from "./pages/admin/About.tsx";
import ServicesAdmin from "./pages/admin/Services.tsx";
import ProjectsAdmin from "./pages/admin/ProjectsAdmin.tsx";
import PricingAdmin from "./pages/admin/PricingAdmin.tsx";
import ContactInfoAdmin from "./pages/admin/ContactInfo.tsx";
import Submissions from "./pages/admin/Submissions.tsx";
import FooterAdmin from "./pages/admin/FooterAdmin.tsx";
import WhatsAppAdmin from "./pages/admin/WhatsAppAdmin.tsx";
import IntroVideoAdmin from "./pages/admin/IntroVideoAdmin.tsx";
import AdminUsers from "./pages/admin/AdminUsers.tsx";
import BlogAdmin from "./pages/admin/BlogAdmin.tsx";
import ServicePagesAdmin from "./pages/admin/ServicePagesAdmin.tsx";
import BlogPost from "./pages/BlogPost.tsx";
import ServicePage from "./pages/ServicePage.tsx";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/projects" element={<AllProjects />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="navigation" element={<Navigation />} />
            <Route path="hero" element={<HeroAdmin />} />
            <Route path="about" element={<AboutAdmin />} />
            <Route path="services" element={<ServicesAdmin />} />
            <Route path="projects" element={<ProjectsAdmin />} />
            <Route path="pricing" element={<PricingAdmin />} />
            <Route path="contact" element={<ContactInfoAdmin />} />
            <Route path="submissions" element={<Submissions />} />
            <Route path="footer" element={<FooterAdmin />} />
            <Route path="whatsapp" element={<WhatsAppAdmin />} />
            <Route path="intro-video" element={<IntroVideoAdmin />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="blog" element={<BlogAdmin />} />
            <Route path="service-pages" element={<ServicePagesAdmin />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
