import { useState, useEffect, useCallback } from "react";
import { useAuth } from "./useAuth";
import { supabase } from "@/integrations/supabase/client";

interface Subscription {
  plan_type: "basic" | "plus" | "premium";
  status: string;
  expires_at: string | null;
}

const PLAN_LIMITS = {
  basic: {
    maxInvitations: 1,
    maxGuests: 50,
    // Basic Features - ENABLED
    themes: 5,
    rsvpForm: true,
    emailConfirmations: true,
    photoGallery: true,
    addToCalendar: true,
    csvExport: true,
    // Plus Features - DISABLED
    premiumThemes: false,
    passwordProtection: false,
    giftRegistry: false,
    livePhotoWall: false,
    guestListManagement: false,
    dietaryTracking: false,
    webhooks: false,
    // Premium Features - DISABLED
    customSubdomain: false,
    emailReminders: false,
    seatingChart: false,
    customFonts: false,
    abTesting: false,
    smsReminders: false,
    advancedAnalytics: false,
    prioritySupport: false,
  },
  plus: {
    maxInvitations: 5,
    maxGuests: Infinity,
    // Basic Features - ALL ENABLED
    themes: 10,
    rsvpForm: true,
    emailConfirmations: true,
    photoGallery: true,
    addToCalendar: true,
    csvExport: true,
    // Plus Features - ENABLED
    premiumThemes: true,
    passwordProtection: true,
    giftRegistry: true,
    livePhotoWall: true,
    guestListManagement: true,
    dietaryTracking: true,
    webhooks: true,
    // Premium Features - DISABLED
    customSubdomain: false,
    emailReminders: false,
    seatingChart: false,
    customFonts: false,
    abTesting: false,
    smsReminders: false,
    advancedAnalytics: false,
    prioritySupport: false,
  },
  premium: {
    maxInvitations: Infinity,
    maxGuests: Infinity,
    // All Features - ENABLED
    themes: Infinity,
    rsvpForm: true,
    emailConfirmations: true,
    photoGallery: true,
    addToCalendar: true,
    csvExport: true,
    premiumThemes: true,
    passwordProtection: true,
    giftRegistry: true,
    livePhotoWall: true,
    guestListManagement: true,
    dietaryTracking: true,
    webhooks: true,
    customSubdomain: true,
    emailReminders: true,
    seatingChart: true,
    customFonts: true,
    abTesting: true,
    smsReminders: true,
    advancedAnalytics: true,
    prioritySupport: true,
  },
};

export const useSubscription = () => {
  const { user, loading: authLoading } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    // Wait for auth to finish loading first
    if (authLoading) {
      console.log("[SUBSCRIPTION] Waiting for auth to finish loading");
      return;
    }

    if (!user) {
      console.log("[SUBSCRIPTION] No user, clearing subscription");
      setSubscription(null);
      setLoading(false);
      return;
    }
 
    console.log("[SUBSCRIPTION] Fetching for user:", user.id);
    setLoading(true);
    
    try {
      // First check database directly
      const { data: dbData, error: dbError } = await supabase
        .from("user_subscriptions")
        .select("plan_type, status, expires_at")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      console.log("[SUBSCRIPTION] Database result:", { data: dbData, error: dbError });

      if (!dbError && dbData) {
        console.log("[SUBSCRIPTION] Active subscription found in DB");
        setSubscription({
          plan_type: dbData.plan_type,
          status: dbData.status,
          expires_at: dbData.expires_at
        });
        setLoading(false);
        return;
      }

      // If not found, sync with Stripe
      console.log("[SUBSCRIPTION] No active subscription in DB, checking Stripe...");
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: checkData, error: checkError } = await supabase.functions.invoke("check-subscription", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        console.log("[SUBSCRIPTION] Stripe check complete:", { data: checkData, error: checkError });
        
        // Wait for DB to update
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Check DB again
        const { data: dbData2, error: dbError2 } = await supabase
          .from("user_subscriptions")
          .select("plan_type, status, expires_at")
          .eq("user_id", user.id)
          .eq("status", "active")
          .maybeSingle();

        if (!dbError2 && dbData2) {
          console.log("[SUBSCRIPTION] Found after Stripe sync");
          setSubscription({
            plan_type: dbData2.plan_type,
            status: dbData2.status,
            expires_at: dbData2.expires_at
          });
          setLoading(false);
          return;
        }
      }

      console.log("[SUBSCRIPTION] No subscription found anywhere");
      setSubscription(null);
      setLoading(false);
    } catch (error) {
      console.error("[SUBSCRIPTION] Error fetching:", error);
      setSubscription(null);
      setLoading(false);
    }
  }, [user, authLoading]);

  useEffect(() => {
    console.log("[SUBSCRIPTION] Effect triggered, user:", !!user, "authLoading:", authLoading);
    
    // If auth is still loading, wait
    if (authLoading) {
      console.log("[SUBSCRIPTION] Auth still loading, waiting...");
      setLoading(true);
      return;
    }

    fetchSubscription();

    if (!user) return;

    // Listen for changes
    const channel = supabase
      .channel("subscription-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "user_subscriptions",
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log("[SUBSCRIPTION] Real-time update received:", payload);
          fetchSubscription();
        }
      )
      .subscribe();

    return () => {
      console.log("[SUBSCRIPTION] Cleaning up subscription listener");
      supabase.removeChannel(channel);
    };
  }, [user, authLoading, fetchSubscription]);

  const canCreateInvitation = async () => {
    console.log("[SUBSCRIPTION] canCreateInvitation called:", { 
      hasUser: !!user, 
      hasSubscription: !!subscription, 
      planType: subscription?.plan_type 
    });
    
    if (!user || !subscription) {
      console.log("[SUBSCRIPTION] canCreateInvitation: No user or subscription");
      return false;
    }

    const limits = PLAN_LIMITS[subscription.plan_type];
    console.log("[SUBSCRIPTION] canCreateInvitation: Plan limits:", { 
      planType: subscription.plan_type, 
      maxInvitations: limits.maxInvitations 
    });
    
    if (limits.maxInvitations === Infinity) {
      console.log("[SUBSCRIPTION] canCreateInvitation: Unlimited invitations");
      return true;
    }

    const { count } = await supabase
      .from("invitations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    const canCreate = (count || 0) < limits.maxInvitations;
    console.log("[SUBSCRIPTION] canCreateInvitation result:", { 
      count, 
      limit: limits.maxInvitations, 
      canCreate 
    });
    return canCreate;
  };

  const canAddGuests = async (invitationId: string) => {
    if (!subscription) return false;

    const limits = PLAN_LIMITS[subscription.plan_type];
    if (limits.maxGuests === Infinity) return true;

    const { count } = await supabase
      .from("guests")
      .select("*", { count: "exact", head: true })
      .eq("invitation_id", invitationId);

    return (count || 0) < limits.maxGuests;
  };

  const hasFeature = (feature: keyof typeof PLAN_LIMITS.basic) => {
    if (!subscription) return false;
    const featureValue = PLAN_LIMITS[subscription.plan_type][feature];
    return featureValue === true || (typeof featureValue === 'number' && featureValue > 0);
  };

  const getPlanType = () => {
    return subscription?.plan_type || 'basic';
  };

  return {
    subscription,
    loading: authLoading || loading, // Keep loading true while auth is loading too
    canCreateInvitation,
    canAddGuests,
    hasFeature,
    getPlanType,
    limits: subscription ? PLAN_LIMITS[subscription.plan_type] : PLAN_LIMITS.basic,
    refreshSubscription: fetchSubscription,
  };
};
