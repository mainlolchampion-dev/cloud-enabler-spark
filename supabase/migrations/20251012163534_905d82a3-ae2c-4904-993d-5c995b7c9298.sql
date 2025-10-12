-- Update user subscription to basic plan
UPDATE user_subscriptions 
SET plan_type = 'basic', 
    updated_at = NOW()
WHERE user_id = '3bef4325-3d2d-41f9-85a6-a6cddfdb882b';