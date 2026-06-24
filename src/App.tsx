import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import { supabase } from "@/integrations/supabase/client";

const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const AllProjects = lazy(() => import("./pages/AllProjects.tsx"));
const Auth = lazy(() => import("./pages/Auth.tsx"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.tsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.tsx"));
const ServicePage = lazy(() => import("./pages/ServicePage.tsx"));
const HireMe = lazy(() => import("./pages/HireMe.tsx"));

const queryClient = new QueryClient();

function DynamicFavicon() {
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from("site_settings").select("value").eq("key", "branding").maybeSingle();
      const url = (data?.value as { favicon_url?: string } | null)?.favicon_url;
      if (!url) return;
      document.querySelectorAll("link[rel~='icon'], link[rel='apple-touch-icon']").forEach((el) => el.remove());
      const link = document.createElement("link");
      link.rel = "icon";
      link.href = url;
      document.head.appendChild(link);
      const apple = document.createElement("link");
      apple.rel = "apple-touch-icon";
      apple.href = url;
      document.head.appendChild(apple);
    })();
  }, []);
  return null;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <DynamicFavicon />
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/projects" element={<AllProjects />} />
          <Route path="/hire-me" element={<HireMe />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/services/:slug" element={<ServicePage />} />
          <Route path="/digitalmarketingservice" element={<ServicePage forcedSlug="digital-marketing" />} />
          <Route path="/aiautomation" element={<ServicePage forcedSlug="ai-automation" />} />
          <Route path="/webdev" element={<ServicePage forcedSlug="web-development" />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/admin" element={<AdminLayout />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
