import { ReactNode, useEffect } from "react";
import { getThemeById, InvitationTheme } from "@/config/invitationThemes";

interface ThemeProviderProps {
  themeId: string;
  children: ReactNode;
}

export function ThemeProvider({ themeId, children }: ThemeProviderProps) {
  const theme = getThemeById(themeId) || getThemeById('romantic');

  useEffect(() => {
    if (!theme) return;

    // Apply theme CSS variables to root
    const root = document.documentElement;
    
    // Apply color variables
    root.style.setProperty('--background', theme.colors.background);
    root.style.setProperty('--foreground', theme.colors.foreground);
    root.style.setProperty('--primary', theme.colors.primary);
    root.style.setProperty('--primary-foreground', theme.colors.primaryForeground);
    root.style.setProperty('--secondary', theme.colors.secondary);
    root.style.setProperty('--secondary-foreground', theme.colors.secondaryForeground);
    root.style.setProperty('--accent', theme.colors.accent);
    root.style.setProperty('--accent-foreground', theme.colors.accentForeground);
    root.style.setProperty('--muted', theme.colors.muted);
    root.style.setProperty('--muted-foreground', theme.colors.mutedForeground);
    root.style.setProperty('--border', theme.colors.border);

    // Apply gradient variables
    root.style.setProperty('--gradient-hero', theme.gradients.hero);
    root.style.setProperty('--gradient-section', theme.gradients.section);
    root.style.setProperty('--gradient-overlay', theme.gradients.overlay);

    // Apply shadow variables
    root.style.setProperty('--shadow-card', theme.shadows.card);
    root.style.setProperty('--shadow-image', theme.shadows.image);
    root.style.setProperty('--shadow-elegant', theme.shadows.elegant);

    // Cleanup function to reset to defaults when unmounting
    return () => {
      // Optionally reset to default theme
      root.style.removeProperty('--background');
      root.style.removeProperty('--foreground');
      root.style.removeProperty('--primary');
      root.style.removeProperty('--primary-foreground');
      root.style.removeProperty('--secondary');
      root.style.removeProperty('--secondary-foreground');
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-foreground');
      root.style.removeProperty('--muted');
      root.style.removeProperty('--muted-foreground');
      root.style.removeProperty('--border');
      root.style.removeProperty('--gradient-hero');
      root.style.removeProperty('--gradient-section');
      root.style.removeProperty('--gradient-overlay');
      root.style.removeProperty('--shadow-card');
      root.style.removeProperty('--shadow-image');
      root.style.removeProperty('--shadow-elegant');
    };
  }, [theme]);

  if (!theme) {
    return <>{children}</>;
  }

  // Apply theme fonts to body
  const bodyClassName = `${theme.fonts.body}`;

  return (
    <div className={bodyClassName} data-theme={themeId}>
      {children}
    </div>
  );
}
