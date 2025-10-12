import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { History, Mail, MessageSquare, Webhook, Calendar } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import { el } from "date-fns/locale";

interface NotificationRecord {
  id: string;
  type: string;
  subject: string | null;
  recipient: string;
  status: string;
  error_message: string | null;
  sent_at: string;
  invitation_id: string | null;
}

export default function NotificationHistory() {
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<NotificationRecord[]>([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('notification_history')
        .select('*')
        .eq('user_id', user.id)
        .order('sent_at', { ascending: false })
        .limit(100);

      if (error) throw error;

      setNotifications(data || []);
    } catch (error) {
      console.error('Error loading notifications:', error);
      toast.error('Σφάλμα φόρτωσης ιστορικού');
    } finally {
      setLoading(false);
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'email':
        return <Mail className="w-4 h-4" />;
      case 'sms':
        return <MessageSquare className="w-4 h-4" />;
      case 'webhook':
        return <Webhook className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'destructive' | 'secondary'> = {
      sent: 'default',
      failed: 'destructive',
      pending: 'secondary',
    };

    const labels: Record<string, string> = {
      sent: 'Στάλθηκε',
      failed: 'Απέτυχε',
      pending: 'Εκκρεμεί',
    };

    return (
      <Badge variant={variants[status] || 'secondary'}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      email: 'Email',
      sms: 'SMS',
      webhook: 'Webhook',
    };
    return labels[type] || type;
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <History className="w-8 h-8 text-primary" />
            <h1 className="font-serif text-4xl font-bold text-foreground">
              Ιστορικό Ειδοποιήσεων
            </h1>
          </div>
          <p className="text-muted-foreground text-lg">
            Δείτε όλες τις ειδοποιήσεις που έχουν σταλεί
          </p>
        </div>

        {/* Notifications Table */}
        <Card>
          <CardHeader>
            <CardTitle>Πρόσφατες Ειδοποιήσεις</CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="text-center py-12">
                <History className="w-16 h-16 mx-auto text-muted-foreground/40 mb-4" />
                <p className="text-muted-foreground">Δεν υπάρχουν ειδοποιήσεις</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Τύπος</TableHead>
                    <TableHead>Θέμα</TableHead>
                    <TableHead>Παραλήπτης</TableHead>
                    <TableHead>Κατάσταση</TableHead>
                    <TableHead>Ημερομηνία</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {notifications.map((notification) => (
                    <TableRow key={notification.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {getTypeIcon(notification.type)}
                          <span>{getTypeLabel(notification.type)}</span>
                        </div>
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        {notification.subject || 'N/A'}
                      </TableCell>
                      <TableCell className="font-mono text-sm">
                        {notification.recipient}
                      </TableCell>
                      <TableCell>{getStatusBadge(notification.status)}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Calendar className="w-4 h-4" />
                          {format(new Date(notification.sent_at), "d MMM yyyy, HH:mm", { locale: el })}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
