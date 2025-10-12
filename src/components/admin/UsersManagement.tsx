import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Search, Mail, Calendar, Shield, MoreVertical, CreditCard, Key, Trash2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { el } from "date-fns/locale";
import { UserActionsDialog } from "./UserActionsDialog";

interface UserData {
  id: string;
  email: string;
  created_at: string;
  last_sign_in_at: string;
  role: string;
  subscription_plan: string;
  subscription_status: string;
}

export function UsersManagement() {
  const [users, setUsers] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [dialogAction, setDialogAction] = useState<"plan" | "password" | "delete" | null>(null);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      // Get user subscriptions and roles
      const { data: subscriptions } = await supabase
        .from('user_subscriptions')
        .select('user_id, plan_type, status');

      const { data: roles } = await supabase
        .from('user_roles')
        .select('user_id, role');

      // Combine data - showing user IDs instead of emails (admin access needed)
      const userIds = new Set([
        ...(subscriptions || []).map(s => s.user_id),
        ...(roles || []).map(r => r.user_id)
      ]);

      const usersData: UserData[] = Array.from(userIds).map(userId => {
        const userRole = roles?.find(r => r.user_id === userId);
        const userSub = subscriptions?.find(s => s.user_id === userId);

        return {
          id: userId,
          email: userId.substring(0, 12) + '...', // Show partial user ID
          created_at: new Date().toISOString(),
          last_sign_in_at: new Date().toISOString(),
          role: userRole?.role || 'user',
          subscription_plan: userSub?.plan_type || 'basic',
          subscription_status: userSub?.status || 'active',
        };
      });

      setUsers(usersData);
    } catch (error) {
      console.error('Error loading users:', error);
      toast.error('Σφάλμα φόρτωσης χρηστών');
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(user =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'premium':
        return 'bg-purple-100 text-purple-800';
      case 'plus':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleActionClick = (user: UserData, action: "plan" | "password" | "delete") => {
    setSelectedUser(user);
    setDialogAction(action);
    setDialogOpen(true);
  };

  const handleDialogSuccess = () => {
    loadUsers();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Διαχείριση Χρηστών</span>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Αναζήτηση email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="text-center py-8">
            <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Πλάνο</TableHead>
                <TableHead>Κατάσταση</TableHead>
                <TableHead>Εγγραφή</TableHead>
                <TableHead>Τελευταία Σύνδεση</TableHead>
                <TableHead>Ενέργειες</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {user.email}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Shield className="w-4 h-4 text-muted-foreground" />
                      <span className="capitalize">{user.role}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={getPlanColor(user.subscription_plan)}>
                      {user.subscription_plan === 'basic' ? 'Basic' : 
                       user.subscription_plan === 'plus' ? 'Plus' : 'Premium'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={user.subscription_status === 'active' ? 'default' : 'secondary'}>
                      {user.subscription_status === 'active' ? 'Ενεργή' : 'Ανενεργή'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(user.created_at), "d MMM yyyy", { locale: el })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(user.last_sign_in_at), "d MMM yyyy", { locale: el })}
                    </div>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Ενέργειες</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem onClick={() => handleActionClick(user, "plan")}>
                          <CreditCard className="w-4 h-4 mr-2" />
                          Αλλαγή Πλάνου
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleActionClick(user, "password")}>
                          <Key className="w-4 h-4 mr-2" />
                          Αλλαγή Κωδικού
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem 
                          onClick={() => handleActionClick(user, "delete")}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Διαγραφή Χρήστη
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>

      {selectedUser && (
        <UserActionsDialog
          userId={selectedUser.id}
          userEmail={selectedUser.email}
          currentPlan={selectedUser.subscription_plan}
          open={dialogOpen}
          onOpenChange={setDialogOpen}
          action={dialogAction}
          onSuccess={handleDialogSuccess}
        />
      )}
    </Card>
  );
}
