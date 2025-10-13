-- Add specific UPDATE policy for gift_registry to allow public users to mark items as purchased
-- while restricting what fields they can modify

CREATE POLICY "Public can mark gifts as purchased"
ON public.gift_registry FOR UPDATE
USING (
  EXISTS (
    SELECT 1 FROM public.invitations
    WHERE invitations.id = gift_registry.invitation_id
    AND invitations.status = 'published'
  )
  AND NOT purchased  -- Only allow updating unpurchased items
)
WITH CHECK (
  -- Ensure the item is being marked as purchased
  purchased = true
  AND purchased_by IS NOT NULL
  AND purchased_at IS NOT NULL
  -- The following fields must not change from their current values
  AND item_name = (SELECT item_name FROM public.gift_registry WHERE id = gift_registry.id)
  AND COALESCE(item_description, '') = COALESCE((SELECT item_description FROM public.gift_registry WHERE id = gift_registry.id), '')
  AND COALESCE(price, 0) = COALESCE((SELECT price FROM public.gift_registry WHERE id = gift_registry.id), 0)
  AND COALESCE(store_name, '') = COALESCE((SELECT store_name FROM public.gift_registry WHERE id = gift_registry.id), '')
  AND COALESCE(store_url, '') = COALESCE((SELECT store_url FROM public.gift_registry WHERE id = gift_registry.id), '')
  AND COALESCE(image_url, '') = COALESCE((SELECT image_url FROM public.gift_registry WHERE id = gift_registry.id), '')
  AND priority = (SELECT priority FROM public.gift_registry WHERE id = gift_registry.id)
  AND invitation_id = (SELECT invitation_id FROM public.gift_registry WHERE id = gift_registry.id)
);