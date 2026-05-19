import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";

const NotFound = lazy(() => import("./pages/NotFound.tsx"));
const AllProjects = lazy(() => import("./pages/AllProjects.tsx"));
const Auth = lazy(() => import("./pages/Auth.tsx"));
const AdminLayout = lazy(() => import("./pages/admin/AdminLayout.tsx"));
const BlogPost = lazy(() => import("./pages/BlogPost.tsx"));
const ServicePage = lazy(() => import("./pages/ServicePage.tsx"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/projects" element={<AllProjects />} />
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
