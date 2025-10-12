-- Drop the trigger that automatically creates basic subscription
DROP TRIGGER IF EXISTS on_auth_user_created_subscription ON auth.users;

-- Drop the function
DROP FUNCTION IF EXISTS public.handle_new_user_subscription();