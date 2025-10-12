import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";

export const useAdminStatus = () => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminStatus = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        
        // Use the has_role function which is more reliable
        const { data, error } = await supabase.rpc('has_role', {
          _user_id: user.id,
          _role: 'admin'
        });

        if (error) {
          console.error('useAdminStatus: Error checking admin status:', error);
          setIsAdmin(false);
        } else {
          console.log('useAdminStatus: Admin check result:', { userId: user.id, isAdmin: data });
          setIsAdmin(!!data);
        }
      } catch (error) {
        console.error('useAdminStatus: Exception:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminStatus();
  }, [user?.id]);

  return { isAdmin, loading: authLoading || loading };
};
