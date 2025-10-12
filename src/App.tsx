import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { SubscriptionProtectedRoute } from "@/components/SubscriptionProtectedRoute";
import { FeatureProtectedRoute } from "@/components/FeatureProtectedRoute";
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
import Pricing from "./pages/Pricing";
import SubscriptionManagement from "./pages/SubscriptionManagement";
import AdvancedAnalytics from "./pages/AdvancedAnalytics";
import NotificationPreferences from "./pages/NotificationPreferences";
import NotificationHistory from "./pages/NotificationHistory";
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
          <Route path="/pricing" element={<Pricing />} />
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
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="subscription" element={<SubscriptionManagement />} />
              <Route path="wedding/add" element={<SubscriptionProtectedRoute><AddWedding /></SubscriptionProtectedRoute>} />
              <Route path="wedding/edit/:id" element={<SubscriptionProtectedRoute><AddWedding /></SubscriptionProtectedRoute>} />
              <Route path="wedding/all" element={<AllWeddings />} />
              <Route path="baptism/add" element={<SubscriptionProtectedRoute><AddBaptism /></SubscriptionProtectedRoute>} />
              <Route path="baptism/edit/:id" element={<SubscriptionProtectedRoute><AddBaptism /></SubscriptionProtectedRoute>} />
              <Route path="baptism/all" element={<AllBaptisms />} />
              <Route path="party/add" element={<SubscriptionProtectedRoute><AddParty /></SubscriptionProtectedRoute>} />
              <Route path="party/edit/:id" element={<SubscriptionProtectedRoute><AddParty /></SubscriptionProtectedRoute>} />
              <Route path="party/all" element={<AllParties />} />
                      <Route path="rsvp/:id" element={<RSVPManagement />} />
                      <Route path="guests/:id" element={<GuestManagement />} />
                      <Route 
                        path="seating/:id" 
                        element={
                          <FeatureProtectedRoute 
                            feature="seatingChart" 
                            featureName="Seating Chart Planner"
                            requiredPlan="premium"
                          >
                            <SeatingManagement />
                          </FeatureProtectedRoute>
                        } 
                      />
                      <Route 
                        path="gifts/:id" 
                        element={
                          <FeatureProtectedRoute 
                            feature="giftRegistry" 
                            featureName="Gift Registry"
                            requiredPlan="plus"
                          >
                            <GiftRegistryManagement />
                          </FeatureProtectedRoute>
                        } 
                      />
                      <Route path="events/:id" element={<EventsTimelineManagement />} />
                      <Route 
                        path="analytics/:id" 
                        element={
                          <FeatureProtectedRoute 
                            feature="advancedAnalytics" 
                            featureName="Advanced Analytics"
                            requiredPlan="premium"
                          >
                            <AdvancedAnalytics />
                          </FeatureProtectedRoute>
                        } 
                      />
                      <Route path="profile" element={<Profile />} />
                      <Route path="notifications" element={<NotificationPreferences />} />
                      <Route path="notification-history" element={<NotificationHistory />} />
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
