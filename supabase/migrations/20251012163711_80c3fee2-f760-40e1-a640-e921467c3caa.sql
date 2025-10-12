-- Remove user subscription to simulate new user without plan
DELETE FROM user_subscriptions 
WHERE user_id = '3bef4325-3d2d-41f9-85a6-a6cddfdb882b';