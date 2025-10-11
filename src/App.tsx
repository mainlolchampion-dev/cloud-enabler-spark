import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import Dashboard from "./pages/Dashboard";
import AddWedding from "./pages/AddWedding";
import AddBaptism from "./pages/AddBaptism";
import AddParty from "./pages/AddParty";
import AllWeddings from "./pages/AllWeddings";
import AllBaptisms from "./pages/AllBaptisms";
import AllParties from "./pages/AllParties";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <AppSidebar />
            <main className="flex-1 overflow-auto">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/wedding/add" element={<AddWedding />} />
                <Route path="/wedding/all" element={<AllWeddings />} />
                <Route path="/baptism/add" element={<AddBaptism />} />
                <Route path="/baptism/all" element={<AllBaptisms />} />
                <Route path="/party/add" element={<AddParty />} />
                <Route path="/party/all" element={<AllParties />} />
                <Route path="/profile" element={<Profile />} />
                {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
          </div>
        </SidebarProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
