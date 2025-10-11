import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import AddWedding from "./pages/AddWedding";
import AddBaptism from "./pages/AddBaptism";
import AddParty from "./pages/AddParty";
import AllWeddings from "./pages/AllWeddings";
import AllBaptisms from "./pages/AllBaptisms";
import AllParties from "./pages/AllParties";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";
import WeddingInvitation from "./pages/public/WeddingInvitation";
import BaptismInvitation from "./pages/public/BaptismInvitation";
import PartyInvitation from "./pages/public/PartyInvitation";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Public routes without sidebar */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/prosklisi/:id" element={
            <>
              {(() => {
                const id = window.location.pathname.split('/')[2];
                const invite = localStorage.getItem(`invite:${id}`);
                if (!invite) return <NotFound />;
                const data = JSON.parse(invite);
                if (data.type === 'wedding') return <WeddingInvitation />;
                if (data.type === 'baptism') return <BaptismInvitation />;
                if (data.type === 'party') return <PartyInvitation />;
                return <NotFound />;
              })()}
            </>
          } />
          
          {/* Protected routes with sidebar */}
          <Route path="/*" element={
            <ProtectedRoute>
              <SidebarProvider>
                <div className="min-h-screen flex w-full">
                  <AppSidebar />
                  <main className="flex-1 overflow-auto">
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/wedding/add" element={<AddWedding />} />
                      <Route path="/wedding/all" element={<AllWeddings />} />
                      <Route path="/baptism/add" element={<AddBaptism />} />
                      <Route path="/baptism/all" element={<AllBaptisms />} />
                      <Route path="/party/add" element={<AddParty />} />
                      <Route path="/party/all" element={<AllParties />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                  </main>
                </div>
              </SidebarProvider>
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
