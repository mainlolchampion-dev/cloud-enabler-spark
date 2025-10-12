import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomFontUploader } from "./CustomFontUploader";
import { CustomSubdomainSettings } from "./CustomSubdomainSettings";
import { Settings, Type, Globe } from "lucide-react";

interface InvitationSettingsProps {
  invitationId: string;
  currentSubdomain?: string;
  onSubdomainUpdate?: (subdomain: string) => void;
  onFontSelect?: (fontUrl: string, fontName: string) => void;
}

export function InvitationSettings({
  invitationId,
  currentSubdomain,
  onSubdomainUpdate,
  onFontSelect,
}: InvitationSettingsProps) {
  return (
    <Card className="border-2">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Settings className="w-5 h-5" />
          Premium Ρυθμίσεις
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="subdomain" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="subdomain" className="flex items-center gap-2">
              <Globe className="w-4 h-4" />
              Custom Subdomain
            </TabsTrigger>
            <TabsTrigger value="fonts" className="flex items-center gap-2">
              <Type className="w-4 h-4" />
              Custom Fonts
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="subdomain" className="mt-6">
            <CustomSubdomainSettings
              invitationId={invitationId}
              currentSubdomain={currentSubdomain}
              onSubdomainUpdate={onSubdomainUpdate}
            />
          </TabsContent>
          
          <TabsContent value="fonts" className="mt-6">
            <CustomFontUploader
              invitationId={invitationId}
              onFontSelect={onFontSelect}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
