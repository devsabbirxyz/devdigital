import { lazy, Suspense, useEffect } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";
import ErrorBoundary from "@/components/ui/ErrorBoundary";
import { useMarkAppMounted } from "@/loader/useLoadingTask";
import h1 from "@/assets/hero-1.jpg";
import h2 from "@/assets/hero-2.jpg";
import h3 from "@/assets/hero-3.jpg";
import h4 from "@/assets/hero-4.jpg";
import Index from "./pages/Index.tsx";

const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const AllProjects = lazy(() => import("./pages/AllProjects.tsx"));
const Auth = lazy(() => import("./pages/Auth.tsx"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.tsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.tsx"));
const ServicePage = lazy(() => import("./pages/ServicePage.tsx"));
const HireMe = lazy(() => import("./pages/HireMe.tsx"));
const AmbientCursorGlow = lazy(() => import("@/components/site/AmbientCursorGlow"));
const CommandPalette = lazy(() => import("@/components/site/CommandPalette"));
const LeadMagnetModal = lazy(() => import("@/components/site/LeadMagnetModal"));
const AiTerminal = lazy(() => import("@/components/site/AiTerminal"));
const BookingModal = lazy(() => import("@/components/site/BookingModal"));
const SocialProofTicker = lazy(() => import("@/components/site/SocialProofTicker"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes cache — eliminates duplicate Supabase network requests
      gcTime: 10 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function DynamicFavicon() {
  useEffect(() => {
    const mgr = window.__loading;
    mgr?.register("branding_favicon");

    (async () => {
      try {
        const { data } = await supabase.from("site_settings").select("value").eq("key", "branding").maybeSingle();
        const url = (data?.value as { favicon_url?: string } | null)?.favicon_url;
        if (url) {
          document.querySelectorAll("link[rel~='icon'], link[rel='apple-touch-icon']").forEach((el) => el.remove());
          const link = document.createElement("link");
          link.rel = "icon";
          link.href = url;
          document.head.appendChild(link);
          const apple = document.createElement("link");
          apple.rel = "apple-touch-icon";
          apple.href = url;
          document.head.appendChild(apple);
        }
      } catch {
        // failed calls count as done
      } finally {
        mgr?.done("branding_favicon");
      }
    })();
  }, []);
  return null;
}

const App = () => {
  useMarkAppMounted();

  // Wire initial backend auth check + hero asset preloading into loading manager
  useEffect(() => {
    const mgr = window.__loading;
    if (!mgr) return;

    // 1. Supabase auth session check (per §4)
    mgr.register("auth_session");
    supabase.auth.getSession()
      .catch(() => ({}))
      .finally(() => {
        mgr.done("auth_session");
      });

    // 2. Preload primary above-the-fold hero image
    mgr.trackImages([h1]);
  }, []);

  return (
    <ErrorBoundary name="GlobalApp">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <div className="fixed-bg" aria-hidden="true" />
          <DynamicFavicon />
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <ErrorBoundary name="RootRouter">
              <Suspense fallback={null}>
                <AmbientCursorGlow />
                <CommandPalette />
                <LeadMagnetModal />
                <AiTerminal />
                <BookingModal />
                <SocialProofTicker />
              </Suspense>

              <Suspense
                fallback={
                  <div className="min-h-screen flex items-center justify-center text-muted-foreground text-sm font-mono">
                    Loading...
                  </div>
                }
              >
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/projects" element={<AllProjects />} />
                  <Route path="/hire-me" element={<HireMe />} />
                  <Route path="/blog/:slug" element={<BlogPost />} />
                  <Route path="/services/:slug" element={<ServicePage />} />
                  <Route path="/digitalmarketingservice" element={<ServicePage forcedSlug="digital-marketing" />} />
                  <Route path="/aiautomation" element={<ServicePage forcedSlug="ai-automation" />} />
                  <Route path="/webdev" element={<ServicePage forcedSlug="web-development" />} />
                  <Route path="/webdevelopment" element={<ServicePage forcedSlug="web-development" />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/admin" element={<AdminLayout />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </BrowserRouter>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
