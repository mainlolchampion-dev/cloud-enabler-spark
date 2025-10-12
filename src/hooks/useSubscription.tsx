import { useState, useEffect } from "react";
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
    smsNotifications: false,
    advancedFeatures: false,
  },
  plus: {
    maxInvitations: 5,
    maxGuests: Infinity,
    smsNotifications: true,
    advancedFeatures: true,
  },
  premium: {
    maxInvitations: Infinity,
    maxGuests: Infinity,
    smsNotifications: true,
    advancedFeatures: true,
  },
};

export const useSubscription = () => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
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
  }, [user]);

  const fetchSubscription = async () => {
    try {
      const { data, error } = await supabase
        .from("user_subscriptions")
        .select("plan_type, status, expires_at")
        .eq("user_id", user?.id)
        .single();

      if (error) throw error;
      setSubscription(data);
    } catch (error) {
      console.error("Error fetching subscription:", error);
    } finally {
      setLoading(false);
    }
  };

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
    return PLAN_LIMITS[subscription.plan_type][feature];
  };

  return {
    subscription,
    loading,
    canCreateInvitation,
    canAddGuests,
    hasFeature,
    limits: subscription ? PLAN_LIMITS[subscription.plan_type] : PLAN_LIMITS.basic,
  };
};
