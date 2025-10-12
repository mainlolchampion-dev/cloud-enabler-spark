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
  }>({
    subscription: null,
    loading: true,
  });

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setState({ subscription: null, loading: false });
      return;
    }
 
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      // CRITICAL: Always get fresh session before calling edge function
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.log("No active session, clearing subscription");
        setState({ subscription: null, loading: false });
        return;
      }
 
      // Call check-subscription edge function
      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
 
      console.log("check-subscription response:", { data, error });
 
      if (error) throw error;
 
      if (data && data.subscribed) {
        const newSubscription = {
          plan_type: data.plan_type,
          status: data.status,
          expires_at: data.subscription_end,
        };
        console.log("Setting subscription:", newSubscription);
        
        // CRITICAL: Set subscription and loading together in one atomic update
        setState({ subscription: newSubscription, loading: false });
      } else {
        console.log("No active subscription found");
        setState({ subscription: null, loading: false });
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
      // Fallback to database - this is critical for reliability
      console.log("Attempting database fallback...");
      try {
        const { data, error: dbError } = await supabase
          .from("user_subscriptions")
          .select("plan_type, status, expires_at")
          .eq("user_id", user?.id)
          .eq("status", "active")
          .maybeSingle();
 
        console.log("Database fallback result:", { data, error: dbError });
 
        if (!dbError && data) {
          console.log("Using database subscription:", data);
          setState({ subscription: data, loading: false });
        } else {
          console.log("No subscription found in database");
          setState({ subscription: null, loading: false });
        }
      } catch (dbError) {
        console.error("Error fetching from database:", dbError);
        setState({ subscription: null, loading: false });
      }
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setState({ subscription: null, loading: false });
      return;
    }

    fetchSubscription();

    // Auto-refresh every minute
    const interval = setInterval(fetchSubscription, 60000);

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
      clearInterval(interval);
      supabase.removeChannel(channel);
    };
  }, [user, fetchSubscription]);

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
    loading: state.loading,
    canCreateInvitation,
    canAddGuests,
    hasFeature,
    getPlanType,
    limits: state.subscription ? PLAN_LIMITS[state.subscription.plan_type] : PLAN_LIMITS.basic,
  };
};
