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
import InvitationRouter from "./pages/public/InvitationRouter";
import RSVPManagement from "./pages/RSVPManagement";
import UserGuide from "./pages/UserGuide";
import FAQ from "./pages/FAQ";
import TermsOfService from "./pages/TermsOfService";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import GDPR from "./pages/GDPR";
import Contact from "./pages/Contact";
import GuestManagement from "./pages/GuestManagement";
import SeatingManagement from "./pages/SeatingManagement";
import GiftRegistryManagement from "./pages/GiftRegistryManagement";
import EventsTimelineManagement from "./pages/EventsTimelineManagement";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Routes>
          {/* Public routes without sidebar */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/prosklisi/:id" element={<InvitationRouter />} />
          <Route path="/proskisi/:id" element={<InvitationRouter />} /> {/* Alternative spelling for backwards compatibility */}
          <Route path="/user-guide" element={<UserGuide />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/gdpr" element={<GDPR />} />
          <Route path="/contact" element={<Contact />} />
          
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
              <Route path="/wedding/edit/:id" element={<AddWedding />} />
              <Route path="/wedding/all" element={<AllWeddings />} />
              <Route path="/baptism/add" element={<AddBaptism />} />
              <Route path="/baptism/edit/:id" element={<AddBaptism />} />
              <Route path="/baptism/all" element={<AllBaptisms />} />
              <Route path="/party/add" element={<AddParty />} />
              <Route path="/party/edit/:id" element={<AddParty />} />
              <Route path="/party/all" element={<AllParties />} />
                      <Route path="/rsvp/:id" element={<RSVPManagement />} />
                      <Route path="/guests/:id" element={<GuestManagement />} />
                      <Route path="/seating/:id" element={<SeatingManagement />} />
                      <Route path="/gifts/:id" element={<GiftRegistryManagement />} />
                      <Route path="/events/:id" element={<EventsTimelineManagement />} />
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
