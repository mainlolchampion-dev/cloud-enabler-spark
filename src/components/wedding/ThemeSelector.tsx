import { invitationThemes, InvitationTheme } from "@/config/invitationThemes";
import { Card, CardContent } from "@/components/ui/card";
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface ThemeSelectorProps {
  selectedTheme: string;
  onThemeChange: (themeId: string) => void;
  category?: 'wedding' | 'baptism' | 'party' | 'all';
}

export function ThemeSelector({ selectedTheme, onThemeChange, category = 'all' }: ThemeSelectorProps) {
  const themes = category === 'all' 
    ? invitationThemes 
    : invitationThemes.filter(t => t.category === category || t.category === 'all');

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {themes.map((theme) => (
        <ThemePreviewCard
          key={theme.id}
          theme={theme}
          selected={selectedTheme === theme.id}
          onClick={() => onThemeChange(theme.id)}
        />
      ))}
    </div>
  );
}

interface ThemePreviewCardProps {
  theme: InvitationTheme;
  selected: boolean;
  onClick: () => void;
}

function ThemePreviewCard({ theme, selected, onClick }: ThemePreviewCardProps) {
  const { colors, fonts, gradients, layout } = theme;
  
  return (
    <Card
      onClick={onClick}
      className={cn(
        "cursor-pointer transition-all duration-300 hover:shadow-lg hover:scale-105 relative overflow-hidden",
        selected && "ring-2 ring-primary shadow-xl"
      )}
    >
      {selected && (
        <div className="absolute top-3 right-3 z-10 bg-primary text-primary-foreground rounded-full p-1.5 shadow-lg">
          <Check className="w-4 h-4" />
        </div>
      )}
      
      <div 
        className="h-32 relative"
        style={{
          background: gradients.hero,
        }}
      >
        <div 
          className="absolute inset-0"
          style={{
            background: gradients.overlay,
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <h3 
            className={cn(
              "text-2xl font-bold drop-shadow-md",
              fonts.heading
            )}
            style={{
              color: `hsl(${colors.primaryForeground})`,
            }}
          >
            {theme.nameEl}
          </h3>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-3">
        <div className="space-y-1">
          <h4 className="font-semibold text-sm">{theme.nameEl}</h4>
          <p className="text-xs text-muted-foreground">{theme.description}</p>
        </div>
        
        {/* Color Palette Preview */}
        <div className="flex gap-2">
          <div 
            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: `hsl(${colors.primary})` }}
            title="Primary"
          />
          <div 
            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: `hsl(${colors.secondary})` }}
            title="Secondary"
          />
          <div 
            className="w-6 h-6 rounded-full border-2 border-white shadow-sm"
            style={{ backgroundColor: `hsl(${colors.accent})` }}
            title="Accent"
          />
        </div>
        
        {/* Typography Preview */}
        <div className="pt-2 border-t border-border/40 space-y-1">
          <p className={cn("text-xs", fonts.heading)}>Heading Font</p>
          <p className={cn("text-xs", fonts.body)}>Body Font</p>
        </div>
      </CardContent>
    </Card>
  );
}
