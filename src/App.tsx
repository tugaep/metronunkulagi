import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/ThemeProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { CatProvider, useCats } from "./contexts/CatContext";
import { RoamingCat } from "./components/RoamingCat";
import { AnalyticsTracker } from "./components/AnalyticsTracker";

const queryClient = new QueryClient();

const CatOverlay = () => {
  const { cats } = useCats();
  return (
    <>
      {cats.map((cat) => (
        <RoamingCat key={cat.id} cat={cat} />
      ))}
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <CatProvider>
        <TooltipProvider>
          <CatOverlay />
          <Toaster />
          <Sonner position="bottom-center" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
            <AnalyticsTracker />
          </BrowserRouter>
        </TooltipProvider>
      </CatProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
