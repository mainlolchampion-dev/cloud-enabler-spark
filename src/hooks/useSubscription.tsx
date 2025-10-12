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
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    if (!user) return;
 
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
 
      // Call check-subscription edge function
      const { data, error } = await supabase.functions.invoke("check-subscription", {
        headers: {
          Authorization: `Bearer ${session.access_token}`,
        },
      });
 
      if (error) throw error;
 
      if (data && data.subscribed) {
        setSubscription({
          plan_type: data.plan_type,
          status: data.status,
          expires_at: data.subscription_end,
        });
      } else {
        // No active subscription
        setSubscription(null);
      }
    } catch (error) {
      console.error("Error fetching subscription:", error);
      // Fallback to database
      try {
        const { data, error: dbError } = await supabase
          .from("user_subscriptions")
          .select("plan_type, status, expires_at")
          .eq("user_id", user?.id)
          .eq("status", "active")
          .maybeSingle();
 
        if (!dbError && data) {
          setSubscription(data);
        } else {
          setSubscription(null);
        }
      } catch (dbError) {
        console.error("Error fetching from database:", dbError);
        setSubscription(null);
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!user) {
      setLoading(false);
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
    if (!user || !subscription) return false;

    const limits = PLAN_LIMITS[subscription.plan_type];
    if (limits.maxInvitations === Infinity) return true;

    const { count } = await supabase
      .from("invitations")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("status", "published");

    return (count || 0) < limits.maxInvitations;
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
    loading,
    canCreateInvitation,
    canAddGuests,
    hasFeature,
    getPlanType,
    limits: subscription ? PLAN_LIMITS[subscription.plan_type] : PLAN_LIMITS.basic,
  };
};
