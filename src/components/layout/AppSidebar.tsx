import { ChevronDown, Heart, LayoutDashboard, LogOut, User } from "lucide-react";
import { NavLink, useLocation } from "react-router-dom";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const [gamosOpen, setGamosOpen] = useState(true);
  const [baptismOpen, setBaptismOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  return (
    <Sidebar className="border-r-0">
      <div className="flex items-center gap-2 p-4 border-b border-sidebar-border">
        <div className="w-10 h-10 bg-white/10 rounded-lg flex items-center justify-center">
          <Heart className="w-6 h-6 text-white" fill="currentColor" />
        </div>
        {state === "expanded" && (
          <span className="font-semibold text-white text-lg">Προσκλητήρια</span>
        )}
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/")}>
                <NavLink to="/" className="flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5" />
                  {state === "expanded" && <span>Πίνακας Ελέγχου</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <Collapsible open={gamosOpen} onOpenChange={setGamosOpen}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      {state === "expanded" && <span>Γάμος</span>}
                    </div>
                    {state === "expanded" && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          gamosOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
              <CollapsibleContent>
                <SidebarMenu className="ml-4">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/wedding/all")}>
                      <NavLink to="/wedding/all">
                        {state === "expanded" && <span>Όλες οι Προσκλήσεις</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/wedding/add")}>
                      <NavLink to="/wedding/add">
                        {state === "expanded" && <span>Προσθήκη Πρόσκλησης</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={baptismOpen} onOpenChange={setBaptismOpen}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      {state === "expanded" && <span>Βάπτιση</span>}
                    </div>
                    {state === "expanded" && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform ${
                          baptismOpen ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
              <CollapsibleContent>
                <SidebarMenu className="ml-4">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/baptism/all")}>
                      <NavLink to="/baptism/all">
                        {state === "expanded" && <span>Όλες οι Προσκλήσεις</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/baptism/add")}>
                      <NavLink to="/baptism/add">
                        {state === "expanded" && <span>Προσθήκη Πρόσκλησης</span>}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </CollapsibleContent>
            </Collapsible>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/profile")}>
                <NavLink to="/profile" className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  {state === "expanded" && <span>Προφίλ</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button className="flex items-center gap-2 w-full">
                  <LogOut className="w-5 h-5" />
                  {state === "expanded" && <span>Έξοδος</span>}
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="border-t border-sidebar-border">
        <SidebarTrigger className="w-full justify-center py-3 hover:bg-white/10">
          {state === "expanded" && <span className="text-sm">Σύμπτυξη μενού</span>}
        </SidebarTrigger>
      </SidebarFooter>
    </Sidebar>
  );
}
