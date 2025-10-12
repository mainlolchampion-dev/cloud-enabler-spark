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
  const { user } = useAuth();
  const [state, setState] = useState<{
    subscription: Subscription | null;
    loading: boolean;
    initialized: boolean;
  }>({
    subscription: null,
    loading: true,
    initialized: false,
  });

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setState({ subscription: null, loading: false, initialized: true });
      return;
    }
 
    console.log("[SUBSCRIPTION] Starting fetch...");
    setState(prev => ({ ...prev, loading: true, initialized: false }));
    
    try {
      // First check database directly - faster
      const { data: dbData, error: dbError } = await supabase
        .from("user_subscriptions")
        .select("plan_type, status, expires_at")
        .eq("user_id", user.id)
        .eq("status", "active")
        .maybeSingle();

      console.log("[SUBSCRIPTION] Database check:", { data: dbData, error: dbError });

      if (!dbError && dbData) {
        console.log("[SUBSCRIPTION] Found in database:", dbData);
        setState({ 
          subscription: {
            plan_type: dbData.plan_type,
            status: dbData.status,
            expires_at: dbData.expires_at
          }, 
          loading: false,
          initialized: true
        });
        return;
      }

      // If not in database, check Stripe
      console.log("[SUBSCRIPTION] Not in database, checking Stripe...");
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: checkData, error: checkError } = await supabase.functions.invoke("check-subscription", {
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        });

        if (checkError) {
          console.error("[SUBSCRIPTION] Stripe check error:", checkError);
        } else {
          console.log("[SUBSCRIPTION] Stripe result:", checkData);
        }
        
        // Wait and check database again
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const { data: dbData2, error: dbError2 } = await supabase
          .from("user_subscriptions")
          .select("plan_type, status, expires_at")
          .eq("user_id", user.id)
          .eq("status", "active")
          .maybeSingle();

        if (!dbError2 && dbData2) {
          console.log("[SUBSCRIPTION] Found after Stripe check:", dbData2);
          setState({ 
            subscription: {
              plan_type: dbData2.plan_type,
              status: dbData2.status,
              expires_at: dbData2.expires_at
            }, 
            loading: false,
            initialized: true
          });
          return;
        }
      }

      console.log("[SUBSCRIPTION] No subscription found");
      setState({ subscription: null, loading: false, initialized: true });
    } catch (error) {
      console.error("[SUBSCRIPTION] Error:", error);
      setState({ subscription: null, loading: false, initialized: true });
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setState({ subscription: null, loading: false, initialized: true });
      return;
    }

    // Don't refetch if already initialized and subscription exists
    if (state.initialized && state.subscription) {
      return;
    }

    fetchSubscription();

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
        () => {
          fetchSubscription();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, fetchSubscription, state.initialized, state.subscription]);

  const canCreateInvitation = async () => {
    console.log("canCreateInvitation called:", { hasUser: !!user, hasSubscription: !!state.subscription, planType: state.subscription?.plan_type });
    
    if (!user || !state.subscription) {
      console.log("canCreateInvitation: No user or subscription");
      return false;
    }

    const limits = PLAN_LIMITS[state.subscription.plan_type];
    console.log("canCreateInvitation: Plan limits:", { planType: state.subscription.plan_type, maxInvitations: limits.maxInvitations });
    
    if (limits.maxInvitations === Infinity) {
      console.log("canCreateInvitation: Unlimited invitations (Infinity)");
      return true;
    }

    const { count } = await supabase
      .from("invitations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id);

    console.log("canCreateInvitation: Current count:", count, "Limit:", limits.maxInvitations);
    return (count || 0) < limits.maxInvitations;
  };

  const canAddGuests = async (invitationId: string) => {
    if (!state.subscription) return false;

    const limits = PLAN_LIMITS[state.subscription.plan_type];
    if (limits.maxGuests === Infinity) return true;

    const { count } = await supabase
      .from("guests")
      .select("*", { count: "exact", head: true })
      .eq("invitation_id", invitationId);

    return (count || 0) < limits.maxGuests;
  };

  const hasFeature = (feature: keyof typeof PLAN_LIMITS.basic) => {
    if (!state.subscription) return false;
    const featureValue = PLAN_LIMITS[state.subscription.plan_type][feature];
    return featureValue === true || (typeof featureValue === 'number' && featureValue > 0);
  };

  const getPlanType = () => {
    return state.subscription?.plan_type || 'basic';
  };

  return {
    subscription: state.subscription,
    loading: state.loading || !state.initialized,
    canCreateInvitation,
    canAddGuests,
    hasFeature,
    getPlanType,
    limits: state.subscription ? PLAN_LIMITS[state.subscription.plan_type] : PLAN_LIMITS.basic,
  };
};
