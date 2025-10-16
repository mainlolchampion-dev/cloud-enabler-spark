import { BaseInvitation } from "@/lib/invitationStorage";
import { RomanticGarden } from "./RomanticGarden";
import { ClassicFormal } from "./ClassicFormal";
import { ModernMinimalist } from "./ModernMinimalist";
import { GardenRomance } from "./GardenRomance";
import { VintageRomance } from "./VintageRomance";
import { LuxeGold } from "./LuxeGold";
import { BurgundyGold } from "./BurgundyGold";
import { SafariAdventure } from "@/components/baptism/templates/SafariAdventure";
import { NeonNight } from "@/components/party/templates/NeonNight";

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
    modern: ModernMinimalist,
    garden: GardenRomance,
    vintage: VintageRomance,
    luxe: LuxeGold,
    burgundy_gold: BurgundyGold,
    safari_adventure: SafariAdventure,
    neon_night: NeonNight,
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
