import { BaseInvitation } from "@/lib/invitationStorage";
import { RomanticGarden } from "./RomanticGarden";
import { ClassicFormal } from "./ClassicFormal";

interface TemplateRouterProps {
  invitation: BaseInvitation;
  events: any[];
  giftItems: any[];
  onOpenDirections: (position: [number, number]) => void;
}

export function TemplateRouter({ invitation, events, giftItems, onOpenDirections }: TemplateRouterProps) {
  const theme = invitation.theme || 'romantic';
  
  const templates = {
    romantic: RomanticGarden,
    classic: ClassicFormal,
    modern: RomanticGarden, // Will create ModernMinimalist next
    garden: RomanticGarden,
    vintage: RomanticGarden, // Will create VintageRomance next
    luxe: ClassicFormal, // Similar to classic
  };

  const TemplateComponent = templates[theme as keyof typeof templates] || RomanticGarden;

  return (
    <TemplateComponent
      invitation={invitation}
      events={events}
      giftItems={giftItems}
      onOpenDirections={onOpenDirections}
    />
  );
}
