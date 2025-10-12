import { ChevronDown, Heart, LayoutDashboard, LogOut, User, PartyPopper, Baby, CreditCard, Bell, History } from "lucide-react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const { toast } = useToast();
  const [gamosOpen, setGamosOpen] = useState(true);
  const [baptismOpen, setBaptismOpen] = useState(false);
  const [partyOpen, setPartyOpen] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = async () => {
    await signOut();
    toast({
      title: "Αποσύνδεση επιτυχής",
      description: "Έχετε αποσυνδεθεί με επιτυχία",
    });
    navigate("/");
  };

  return (
    <Sidebar className="border-r bg-sidebar" collapsible="none">
      <div className="flex items-center gap-2 p-4 border-b border-sidebar-border">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Heart className="w-6 h-6 text-primary" fill="currentColor" />
        </div>
        <span className="font-serif text-xl font-semibold text-sidebar-foreground">WediLink</span>
      </div>

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/dashboard")}>
                <NavLink to="/dashboard" className="flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5" />
                  <span>Πίνακας Ελέγχου</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <Collapsible open={gamosOpen} onOpenChange={setGamosOpen}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <Heart className="w-5 h-5" />
                      <span>Γάμος</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        gamosOpen ? "rotate-180" : ""
                      }`}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
              <CollapsibleContent>
                <SidebarMenu className="ml-4">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/wedding/all")}>
                      <NavLink to="/wedding/all">
                        <span>Όλες οι Προσκλήσεις</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/wedding/add")}>
                      <NavLink to="/wedding/add">
                        <span>Προσθήκη Πρόσκλησης</span>
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
                      <Baby className="w-5 h-5" />
                      <span>Βάπτιση</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        baptismOpen ? "rotate-180" : ""
                      }`}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
              <CollapsibleContent>
                <SidebarMenu className="ml-4">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/baptism/all")}>
                      <NavLink to="/baptism/all">
                        <span>Όλες οι Προσκλήσεις</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/baptism/add")}>
                      <NavLink to="/baptism/add">
                        <span>Προσθήκη Πρόσκλησης</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </CollapsibleContent>
            </Collapsible>

            <Collapsible open={partyOpen} onOpenChange={setPartyOpen}>
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <PartyPopper className="w-5 h-5" />
                      <span>Party</span>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform ${
                        partyOpen ? "rotate-180" : ""
                      }`}
                    />
                  </SidebarMenuButton>
                </CollapsibleTrigger>
              </SidebarMenuItem>
              <CollapsibleContent>
                <SidebarMenu className="ml-4">
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/party/all")}>
                      <NavLink to="/party/all">
                        <span>Όλες οι Προσκλήσεις</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild isActive={isActive("/party/add")}>
                      <NavLink to="/party/add">
                        <span>Προσθήκη Πρόσκλησης</span>
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                </SidebarMenu>
              </CollapsibleContent>
            </Collapsible>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/subscription")}>
                <NavLink to="/subscription" className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  <span>Συνδρομή</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/profile")}>
                <NavLink to="/profile" className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  <span>Προφίλ</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/notifications")}>
                <NavLink to="/notifications" className="flex items-center gap-2">
                  <Bell className="w-5 h-5" />
                  <span>Ειδοποιήσεις</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={isActive("/notification-history")}>
                <NavLink to="/notification-history" className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  <span>Ιστορικό</span>
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton asChild>
                <button onClick={handleLogout} className="flex items-center gap-2 w-full">
                  <LogOut className="w-5 h-5" />
                  <span>Έξοδος</span>
                </button>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
